const mysql = require('mysql');
const express = require('express');
const router=express.Router()

const { connection } = require('../connection');
const{ get_project,
    delete_project,
    add_project} = require('../controllers/project')

const {createIdea,
    checkProjectMembership,
    updateIdea} =require('../controllers/idea')
    
router.use(express.json());


router.post('/addpro', add_project);

router.delete('/deletePro', delete_project )

router.get('/getProject', get_project);



router.post('/createIdea',createIdea)
router.put('/projects/ideas', checkProjectMembership, updateIdea);


module.exports = {
    router,
    mysql,
    connection,
  };