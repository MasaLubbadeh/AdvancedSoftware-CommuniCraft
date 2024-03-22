const mysql = require('mysql');
const express = require("express");
const app = express();
const connection = mysql.createConnection({
    host: 'localhost', // or your MySQL server address
    user: 'root',
    password: '',
    database: 'communicraft'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
});

module.exports = {
    app,
    mysql,
    connection,
  };