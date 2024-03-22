const express = require("express");
const { connection } = require("../connection");
const { ViewUserProfile,
  UpdateUserInfo,
  SearchBySkill,
  deleteUser,
  createUser}= require('../controllers/user')
const router= express.Router();
router.use(express.json());

router.delete('/RemoveByID', deleteUser);

router.put('/updateUserInfo',UpdateUserInfo );

router.get('/SearchBySkill',SearchBySkill);

router.get('/UserProfile',ViewUserProfile);

router.get('/UserProfile',ViewUserProfile);

router.post('/createUser',createUser);

module.exports=router;