const mysql = require('mysql');
const express = require('express');
const app = express();
const { connection } = require('./connection');

const session = require('express-session');
const auth =require('./routes/login')
const user =require('./routes/user')
//const project=require('./routes/project')

const taskRoute=require('./routes/task');

const bodyParser = require('body-parser');
const loginRoute = require('./routes/login');

const projectRoute=require('./routes/project');


app.use(express.json());

app.use('', taskRoute);
app.use('/',auth)
app.use('/user',user)
//app.use('/',projectRoute)
app.use('', projectRoute);
app.use('', taskRoute);

app.use(bodyParser.json());

app.use('/api', loginRoute); 
//app.use('/api', projectRoute);


///////////////////////////////////leen's code///////////////////////////////////


// const projectsRoute = require('./routes/projectsRoute');
 //const updateProjectRoute = require('./routes/updateProjectRoute');
// const finishedProjectsRoute = require('./routes/finishedProjectsRoute');
// const projectSharingRoute=require('./routes/projectSharingRoute');
// const resourcesRoute = require('./routes/resourcesRoute');


// //use the update project route 
// app.use('/api/projects', updateProjectRoute);
// //************ 
// app.use('/api', finishedProjectsRoute);
// //
// app.use('/api', projectSharingRoute);
// //use the resources route::
// app.use('/api', resourcesRoute);

app.listen(3000,()=>{
    console.log('listeninggg on 3000...')
    })