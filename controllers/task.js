const mysql = require('mysql');
const { connection } = require('../connection');

const addTask = async (req, res) => {
    const { taskTitle, description, projectName } = req.body; 

    try {
        const projectID = await getProjectID(projectName);
        if (!projectID) {
            return res.status(404).json({ error: 'project not found' });
        }

        const taskInsertResult = await new Promise((resolve, reject) => {
            connection.query('INSERT INTO task (taskTitle, description, projectID) VALUES (?, ?, ?)', [taskTitle, description, projectID], (err, result) => {
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

const assignTask = async (req, res) => {
    const { taskTitle, projectName, userName } = req.body; 
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
        const taskID = await getTaskID(taskTitle);
        if (!taskID) {
            return res.status(404).json({ error: 'task not found' });
        }

        const taskAssignResult = await new Promise((resolve, reject) => {
            console.log('hii');
            const status= 'In Progress';
            connection.query('UPDATE task SET userID=?, status=? WHERE projectID=? AND taskTitle=?', [userID, status, projectID, taskTitle], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        res.status(201).json({ message: 'task assigned successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const updateTaskStatus = async (req, res) => { 
    const { taskTitle, projectName, status } = req.body; 
    try {
        const projectID = await getProjectID(projectName);
        if (!projectID) {
            return res.status(404).json({ error: 'project not found' });
        }

      /*  const userProjectExists = await checkUserProject(userID, projectID);
        if (!userProjectExists) {
            return res.status(403).json({ error: 'user is not part of this project' });
        }*/
        const taskID = await getTaskID(taskTitle);
        if (!taskID) {
            return res.status(404).json({ error: 'task not found' });
        }

        const taskAssignResult = await new Promise((resolve, reject) => {
            console.log('hii');
            connection.query('UPDATE task SET status=? WHERE projectID=? AND taskTitle=?', [status, projectID,taskTitle], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        res.status(201).json({ message: 'task updated successfully' });
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

const getProjectTasks = async (req, res) => {
    const projectID = req.params.id;

   
        connection.query('SELECT task.taskTitle, task.description, user.userName FROM task JOIN user ON task.userID = user.userID WHERE task.projectID = ?', [projectID], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'An error occurred while retrieving tasks' });
                return;
            }

            if (result.length === 0) {
                res.status(404).json({ error: 'There are no tasks to this project' });
                return;
            }

            const tasksData = result.map(task => ({
                taskTitle: task.taskTitle,
                description: task.description,
                userName: task.userName
            }));
        
            res.status(200).json(tasksData);

        });
       
       
   
}

function getTaskID(taskTitle) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT taskID FROM task WHERE taskTitle = ?', [taskTitle], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.length > 0 ? result[0].taskID : null);
            }
        });
    });
}
module.exports= {addTask,assignTask,updateTaskStatus, getUserID, getProjectTasks}
