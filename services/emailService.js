
// services/emailService.js
const nodemailer = require('nodemailer');

// Create transporter (configure with your SMTP details)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'leenbatta0@gmail.com',
        pass: 'qfgw jbnb lgup aelo'
    },
    tls: {
        rejectUnauthorized: false // Disable SSL verification
    }
});

// Function to send email
function sendEmail(recipientEmail, project) {
    return new Promise((resolve, reject) => {
        // Define email message
        const mailOptions = {
            from: 'leenbatta0@gmail.com',
            to: recipientEmail,
            subject: `Check out this project: ${project.projectName}`,
            text: `Project Name: ${project.projectName}\nDescription: ${project.description}`
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
    });
}

module.exports = { sendEmail };
