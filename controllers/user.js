const {connection} = require("../connection");
  session=require('../routes/login')
 //session = require('express-session');

const ViewUserProfile=(req, res)=>{
    if (!req.body) {
      res.status(400).json({ message: 'Invalid request, request body is missing' });
      return;
    }
    const { userID } = req.body;
    const query = 'SELECT userName,email,skill FROM user WHERE userID=?';
    connection.query(query, [userID], (err, results) => {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      ///console.log(results)
      if (results.length > 0) {
        res.status(200).json({ message: 'User Profile ',
        user: results[0] });
  
      }
      else {
        // User not found or password incorrect~, return error response
        res.status(401).json({ message: 'No Such User' });
      }
  
    });
  }

const UpdateUserInfo=(req, res) => {
    if (!req.body) {
      res.status(400).json({ message: 'Invalid request, request body is missing' });
      return;
    }
     session = req.session;
    const SuserId = session.userID; 
    let { userID, userName, email, password } = req.body;
    if (SuserId !== userID) {
      res.status(401).json({ message: 'Unauthorized: You cant modify another user' });
      return;
    }
    let query = 'SELECT * FROM user WHERE userID=?';
    connection.query(query, [userID], (err, results) => {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
  
      if (userName == 'NoChange') {
        userName = results[0].userName
      }
      if (email == 'NoChange') {
        email = results[0].email;
      }
      if (password == 'NoChange') {
        password = results[0].password;
      }
      const query = "UPDATE user SET userName = ?, email = ?, password = ? WHERE userID = ?";
      connection.query(query, [userName, email, password, userID], (err, results1) => {
        if (err) {
          console.error('Error executing query', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
        // Fetch the updated data from the database
        const fetchQuery = "SELECT * FROM user WHERE userID = ?";
        connection.query(fetchQuery, [userID], (fetchErr, fetchResults) => {
          if (fetchErr) {
            console.error('Error fetching user data', fetchErr);
            res.status(500).json({ error: 'Internal server error' });
            return;
          }
          if (results1.affectedRows > 0) {
            res.status(200).json({ message: 'Updated successfully', Before: results[0], After: fetchResults[0] });
  
          }
          else {
            // User not found or password incorrect~, return error response
            res.status(401).json({ message: 'No Such User' });
          }
        });
  
  
      });
    });
  
  
  
  
  }

const SearchBySkill=(req, res)=>{
    if (!req.body) {
      res.status(400).json({ message: 'Invalid request, request body is missing' });
      return;
    }
    const { skill } = req.body;
    const query = 'SELECT userName,email,skill FROM user WHERE skill=?';
    connection.query(query, [skill], (err, results) => {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      ///console.log(results)
      if (results.length > 0) {
        res.status(200).json({ message: 'Users with skill '+skill,
        user: results });
  
      }
      else {
        // User not found or password incorrect~, return error response
        res.status(401).json({ message: 'No Such User' });
      }
  
    });
  }
 const deleteUser=(req, res) => {
    if (!req.body) {
      res.status(400).json({ message: 'Invalid request, request body is missing' });
      return;
    }
    const { userID } = req.body;
    const query = 'DELETE FROM user WHERE userID=?';
    connection.query(query, [userID], (err, results) => {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      ///console.log(results)
      if (results.affectedRows > 0) {
        res.status(200).json({ message: 'Deleted successfully' });
  
      }
      else {
        // User not found or password incorrect~, return error response
        res.status(401).json({ message: 'No Such User' });
      }
  
    });
  
  
  }

  const createUser = (req, res) => {
    if (!req.body) {
        res.status(400).json({ message: 'Invalid request, request body is missing' });
        return;
    }

    let { userID, userName, email, password } = req.body;

    //  Check if required fields are present
    if (!userID || !userName || !email || !password) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
    }

    
    const query = 'SELECT * FROM user WHERE userID = ?';
    connection.query(query, [userID], (err, results) => {
        if (err) {
            console.error('Error executing query', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
         //  Check if userID already exists
        if (results.length > 0) {
            res.status(400).json({ message: 'User with this ID already exists' });
            return;
        }

        // If the userID is unique, proceed to create the user
        const createUserQuery = 'INSERT INTO user (userID, userName, email, password) VALUES (?, ?, ?, ?)';
        connection.query(createUserQuery, [userID, userName, email, password], (createErr, createResult) => {
            if (createErr) {
                console.error('Error creating user', createErr);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }

            // Respond with success message
            res.status(200).json({ message: 'User created successfully', user: { userID, userName, email, password } });
        });
    });
};

module.exports={
    ViewUserProfile,
    UpdateUserInfo,
    SearchBySkill,
    deleteUser,
    createUser
}