const express = require("express");
const {connection} = require("../connection");
const jwt = require('jsonwebtoken');
const {generateToken} = require("../auth");
const session = require('express-session');
const router= express.Router();
router.use(express.json());

router.use(session({
  secret: 'your-secret-key', // Change this to a long random string used to sign the session ID cookie
  resave: false,
  saveUninitialized: true
}));
///const  LogIn  = require("../controllers/autherization");
// Use express-session middleware



router.post('/', (req, res) => {
  
  if (!req.body) {
    res.status(400).json({ message: 'Invalid request, request body is missing' });
    return;
}
   

    const { userName , password } = req.body; ////body from postman

   

    // Find the user in the database
    const query = 'SELECT * FROM user WHERE userName = ? AND password = ?';
        connection.query(query, [userName, password], (err, results) => {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      if (results.length > 0) {
        // User found, return success response
         // Store user ID in session
            req.session.userID = results[0].userID;
        const token = generateToken({
          ID: results[0].userID,
          Name: results[0].userName,
          LastName: results[0].email,
          Password: results[0].password,
          skill: results[0].skill,
      });

     // return res.send(token);
        //const user = results[0];
        res.status(200).json({ token :token,message: 'Login successful', user: results[0] });
    } else {
        // User not found or password incorrect~, return error response
        res.status(401).json({ message: 'Invalid username or password' });
    }
  
   
  

    });
  });

module.exports=router,session