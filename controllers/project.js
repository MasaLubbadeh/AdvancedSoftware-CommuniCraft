const mysql = require('mysql');
const { connection } = require('../connection');
const {getUserID} = require('./task')

function gatherUserData(projectID, res, responseData) {
    connection.query('SELECT userID FROM user_project WHERE projectID = ?', [projectID], (err, userProjectResult) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while retrieving user project data' });
            return;
        }

        if (userProjectResult.length > 0) {
            const userIDs = userProjectResult.map(row => row.userID);

            connection.query('SELECT userName FROM user WHERE userID IN (?)', [userIDs], (err, userResult) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'An error occurred while retrieving user names' });
                    return;
                }

                const userNames = userResult.map(row => row.userName);
                responseData.userNames = userNames;
                res.status(200).json(responseData);
            });
        } else {
            res.status(200).json(responseData);
        }
    });
}
function insertUserProject(projectID, userName) {
    return new Promise((resolve, reject) => {
        getUserID(userName)
            .then(userID => {
                if (!userID) {
                    reject(new Error('User ID not available'));
                }
                connection.query('INSERT INTO user_project (projectID, userID) VALUES (?, ?)', [projectID, userID], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            })
            .catch(reject);
    });
}
const get_project= (req, res) => {
    let { projectID, projectName, userName } = req.query;
    let responseData = {};

    if (projectID) {
        connection.query('SELECT * FROM project WHERE projectID = ?', [projectID], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'An error occurred while retrieving the project' });
                return;
            }

            if (result.length === 0) {
                res.status(404).json({ error: 'Project not found' });
                return;
            }
            responseData.project = result[0];

            // Call the function to gather user data
            gatherUserData(projectID, res, responseData);
        });
    } // of projectID
    else if (projectName) {
        connection.query('SELECT * FROM project WHERE projectName = ?', [projectName], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'An error occurred while retrieving the project' });
                return;
            }

            if (result.length === 0) {
                res.status(404).json({ error: 'Project not found' });
                return;
            }

            // If project name found, get project ID
            const projectID = result[0].projectID;
            responseData.project = result[0];

            // Call the function to gather user data
            gatherUserData(projectID, res, responseData);
        });
    }
    else if (userName) {
            connection.query('SELECT project.* FROM project JOIN user_project ON project.projectID = user_project.projectID JOIN user ON user_project.userID = user.userID WHERE user.userName = (?)', [userName], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'An error occurred while retrieving username' });
                return;
            }

            if (result.length === 0) {
                res.status(404).json({ error: 'There are no projects' });
                return;
            }

            res.status(200).json({ projects: result });

        });
    }
    ////
    else{
        res.status(404).json({ error: 'Project not found' });
        return;
    }
}

const delete_project= async (req , res) => {
    const { projectName } = req.body;
    let projectIDtoDelete=-1;
    try{
    
        const selectResult = await new Promise((resolve, reject) => {
            connection.query('SELECT projectID FROM project WHERE projectName = ? ', [projectName], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        if (selectResult.length > 0) {
            projectIDtoDelete = selectResult[0].projectID;
        } else {
            // Handle the case where no project is found with the specified projectName
            console.status(500).error('No project found with the specified projectName');
        }
    
        const projectDeleteResult1 = await new Promise((resolve, reject) => {
            connection.query('DELETE FROM user_project WHERE projectID = ? ', [projectIDtoDelete], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    
        const projectDeleteResult2 = await new Promise((resolve, reject) => {
            connection.query('DELETE FROM project WHERE projectID = ? ', [projectIDtoDelete], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        res.status(201).json({ message: `project with ID ${projectIDtoDelete} deleted successfully` });
    
    }//try
    catch(error){
        console.error('Error:', error);
        res.status(500).json({ error: 'project doesn\'t exist' });
    }
    }

const add_project= async (req, res) => {
    try {
        let projectID = -1;
        const { projectName, groupSize, type, material, category, userNames  } = req.body;

        // Loop through each username
        const usersExist = [];//array to store if usernames exist
        for (const userName of userNames) {
            const userID = await getUserID(userName);// reuse the function
            const exists = userID !== null;
            usersExist.push(exists);
            }

        if (usersExist.includes(false)) {
            return res.status(404).json({ error: 'One or more usernames do not exist' });
            }
        
        // Insert
        const projectInsertResult = await new Promise((resolve, reject) => {
            connection.query('INSERT INTO project (projectName, groupSize,type, material, category) VALUES (?, ?, ?, ?, ?)', [projectName, groupSize, type, material, category], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        projectID = projectInsertResult.insertId;
        console.log('New project inserted successfully with ID:', projectID);

        await Promise.all(userNames.map(userName => insertUserProject(projectID, userName))); //mapping each username given
        console.log('New project-user relationships inserted successfully');

        res.status(201).json({ message: 'New project inserted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
module.exports= {
    get_project,
    delete_project,
    add_project
}