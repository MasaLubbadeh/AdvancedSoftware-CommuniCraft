///const mysql = require('mysql');
const express = require('express');
const app = express();
const { connection } = require('./connection');
//const { error } = require('console');

const projectRouter=require('./routes/project');
const taskRouter=require('./routes/task');


app.use(express.json());

app.use('', projectRouter.router);

app.use('', taskRouter.router);


app.post('/addUser', (req, res) => {
    const {userName , email	,password, skill}= req.body;
    connection.query('INSERT INTO user (userName , email ,password, skill) VALUES (?,?,?,?)', [userName , email ,password, skill], (err, result) => {
        if (err) {
            console.error(err);
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        } else {
            userID = result.insertId;
            res.status(201).send({ message: 'New user inserted successfully'});
            console.log('New user inserted successfully with ID:', userID);
        }
    });

} );





app.listen(3000,()=>{
    console.log('listeninggg on 3000...')
    })