const mysql = require('mysql');
const { connection } = require('../connection');

const addTask = async (req, res) => {
    const { taskTitle, description, userName, projectName } = req.body; 

    try {
        const userID = await getUserID(userName);
        if (!userID) {
            return res.status(404).json({ error: 'user not found' });
        }

        const projectID = await getProjectID(projectName);
        if (!projectID) {
            return res.status(404).json({ error: 'project not found' });
        }

        const userProjectExists = await checkUserProject(userID, projectID);
        if (!userProjectExists) {
            return res.status(403).json({ error: 'user is not part of this project' });
        }

        const taskInsertResult = await new Promise((resolve, reject) => {
            connection.query('INSERT INTO task (taskTitle, description, projectID, userID) VALUES (?, ?, ?, ?)', [taskTitle, description, projectID, userID], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        res.status(201).json({ message: 'New task added successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


function getUserID(userName) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT userID FROM user WHERE userName=?', [userName], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.length > 0 ? result[0].userID : null);
            }
        });
    });
}

function getProjectID(projectName) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT projectID FROM project WHERE projectName = ?', [projectName], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.length > 0 ? result[0].projectID : null);
            }
        });
    });
}

function checkUserProject(userID, projectID) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM user_project WHERE userID = ? AND projectID = ?', [userID, projectID], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.length > 0);
            }
        });
    });
}

const getProjectTasks = async(req, res) => {
    const projectID = req.params.id;

    try {
        const result =await connection.query('SELECT task.taskTitle, task.description, user.userName FROM task JOIN user_project ON task.taskID = user_project.taskID JOIN user ON user_project.userID = user.userID  WHERE user_project.projectID = ?', [projectID]);
        
        if(result.length ==0 ){
            return res.status(404).json({ error: 'No tasks found for the project' });
        }
        
        const tasksData = result.map(task => ({
            taskTitle: task.taskTitle,
            description: task.description,
            userName: task.userName
        }));
        res.status(200).json(tasksData);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


module.exports= {addTask, getUserID, getProjectTasks}
