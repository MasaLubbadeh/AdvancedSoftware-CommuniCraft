
const express = require('express');
const router = express.Router();
const { connection } = require('../connection');
const { authenticateTokenHandler } = require('../auth/auth');

// Middleware to check if the user is part of the project team
const checkProjectMembership = (req, res, next) => {
    const projectId = req.params.projectId; 
    const userId = req.user.ID;

    const query = 'SELECT * FROM user_project WHERE projectID = ? AND userID = ?';
    connection.query(query, [projectId, userId], (err, results) => {
        if (err) {
            console.error('Error executing query', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (results.length === 0) {
            return res.status(403).json({ message: "User is not authorized to update this project." });
        }
        next(); // User is authorized
    });
};

// PUT request for updating a project
router.put('/:projectId', authenticateTokenHandler, checkProjectMembership, (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: 'Invalid request, request body is missing' });
    }
    
    // updating project details
    const { projectName, groupSize, type, material, category } = req.body;
    const projectId = req.params.projectId;
    
    const query = 'UPDATE project SET projectName = ?, groupSize = ?, type = ?, material = ?, category = ? WHERE projectID = ?';
    
    connection.query(query, [projectName, groupSize, type, material, category, projectId], (err, results) => {
        if (err) {
            console.error('Error executing query', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (results.affectedRows > 0) {
            res.status(200).json({ message: 'Project updated successfully' });
        }
      
         else {
            // No rows affected means the projectID doesn't exist
            res.status(404).json({ message: 'Project not found' });
        }
    });
});


///////////////updateIdea
/*
router.put('/:projectId/ideas', authenticateTokenHandler, checkProjectMembership, (req, res) => {
    // Check if request body is missing
    if (!req.body) {
        return res.status(400).json({ message: 'Invalid request, request body is missing' });
    }

    const { ID, description } = req.body;

    // Check if ideaID and description are provided
    if (!ID || !description) {
        return res.status(400).json({ message: 'Idea ID and description are required' });
    }

    return res.status(200).json({ message: 'Idea updated successfully' });
});*/
module.exports = router;