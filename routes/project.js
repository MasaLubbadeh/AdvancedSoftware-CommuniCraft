const mysql = require('mysql');
const express = require('express');
const router=express.Router()

const { connection } = require('../connection');
const { get_project,  delete_project, add_project,
    finishedProjects, projectSharing, getAllprojects
    // updateProject, authenticateTokenHandler,checkProjectMembership
     }  = require('../controllers/project');

const {createIdea, checkProjectMembership, updateIdea} =require('../controllers/idea');


  
router.use(express.json());

////////////////////////////Raya's//////////////////////////////////
router.post('/addpro', add_project);

router.delete('/deletePro', delete_project )

router.get('/getProject', get_project);

///////////////////////////////masa's///////////////////////////////
router.post('/createIdea',createIdea)
router.put('/projects/ideas', checkProjectMembership, updateIdea);

///////////////////////////////leen's //////////////////////////


//get all projects
router.get('/projects', getAllprojects );

//update project details :
//router.put('/:projectId',updateProjectRoute);
//router.put('/:projectId', authenticateTokenHandler, checkProjectMembership, updateProject);

// Get all finished projects
     router.get('/projects/finished', finishedProjects);

//share finished projects
     router.post('/projects/share',projectSharing);

/*module.exports = {
    router,
    mysql,
    connection,
  };*/

  module.exports=router;