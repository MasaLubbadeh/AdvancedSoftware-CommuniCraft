// //login.js
// 
// // app.post('/login',login);


//   const router = express.Router();
// router.post('/login',login);
//   module.exports = login; 
const express = require('express');
const { connection } = require('../connection');
const router = express.Router();
const login=require('../controllers/login')
router.post('/login',login);  


module.exports = router; 