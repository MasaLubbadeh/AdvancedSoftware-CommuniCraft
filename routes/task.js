const mysql = require('mysql');
const express = require('express');
const router=express.Router()
const { connection } = require('../connection');
router.use(express.json());

const {addTask,assignTask,updateTaskStatus, getProjectTasks} = require('../controllers/task')

router.post('/addTask', addTask);
//router.post('/project/:projectID/tasks', addTask);

router.put('/assignTask', assignTask);
//router.put('/project/:projectID/tasks/:taskID', addTask);


router.put('/:userID/updateTaskStatus',updateTaskStatus);
//router.put('/project/:projectID/tasks/:taskID', addTask);


router.get('/:id/allTasks',getProjectTasks);
//router.get('/project/:projectID/tasks/list', getProjectTasks);

//router.delete('/:id/allTasks',deleteTask);


/*module.exports = {
    router,
    mysql,
    connection,
  };*/
  module.exports=router;