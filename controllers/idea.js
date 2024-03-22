const {connection} = require("../connection");

const createIdea = (req, res) => {
    // Check if request body is missing
    if (!req.body) {
        return res.status(400).json({ message: 'Invalid request, request body is missing' });
    }

    // Extract data from request body
    const {projectID, describtion } = req.body;

    // Check if description is missing
    if (!describtion) {
        return res.status(400).json({ message: 'Description is required' });
    }

    // Assuming you have some way to determine the current project, e.g., from a session or request header
   // const currentProjectID = req.currentUser.currentProjectID; // Adjust this based on your application logic

    // Assuming you have already established a database connection and have access to it
    // Insert the new idea into the database
    const query = 'INSERT INTO ideas (describtion, projectID) VALUES (?, ?)';
    connection.query(query, [describtion, projectID], (err, results) => {
        if (err) {
            console.error('Error creating idea', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Respond with success message
        return res.status(201).json({ message: 'Idea created successfully', ideaID: results.insertId });
    });
};

// Middleware to check if the user is part of the project team
const checkProjectMembership = (req, res, next) => {
    //const projectId = req.params.projectId; 
    const projectID = 1;
    const userID = req.user.userID; // 'ID' should match the property in the JWT payload

    const query = 'SELECT * FROM user_project WHERE projectID = ? AND userID = ?';
    connection.query(query, [projectID, userID], (err, results) => {
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

const updateIdea = (req, res) => {
    // Check if request body is missing
    if (!req.body) {
        return res.status(400).json({ message: 'Invalid request, request body is missing' });
    }

    // Extract data from request body
    const { ideaID, description } = req.body;

    // Check if ideaID and description are provided
    if (!ideaID || !description) {
        return res.status(400).json({ message: 'Idea ID and description are required' });
    }

    // Idea update logic goes here...

    // Return success response
    return res.status(200).json({ message: 'Idea updated successfully' });
};


const getIdeas = (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: 'Invalid request, request body is missing' });
    }
    const projectID = req.body;

    const query = 'SELECT * FROM ideas WHERE projectID = ?';
    connection.query(query, [projectID], (err, results) => {
        if (err) {
            console.error('Error retrieving ideas', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        return res.status(200).json({ ideas: results });
    });
};

const deleteIdea = (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: 'Invalid request, request body is missing' });
    }    
    const ID = req.body;

    const query = 'DELETE FROM ideas WHERE ID = ?';
    connection.query(query, [ID], (err, results) => {
        if (err) {
            console.error('Error deleting idea', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Idea not found' });
        }

        return res.status(200).json({ message: 'Idea deleted successfully' });
    });
};

module.exports = {createIdea, checkProjectMembership, updateIdea,getIdeas,deleteIdea};
