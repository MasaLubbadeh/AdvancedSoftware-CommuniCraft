const mysql = require('mysql');
const express = require('express');
const router=express.Router()
const { connection } = require('../connection');
router.use(express.json());

const {addTask, getProjectTasks} = require('../controllers/task')

router.post('/addTask', addTask);
router.get('/:id/allTasks',getProjectTasks);

module.exports = {
    router,
    mysql,
    connection,
  };