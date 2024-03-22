const express = require('express')
const app = express()
const session = require('express-session');
const auth =require('./routes/login')
const user =require('./routes/user')
//const project=require('./routes/project')
const projectRouter=require('./routes/project');
const taskRouter=require('./routes/task');




app.use('/login',auth)
app.use('/user',user)
//app.use('/',project)
app.use('', projectRouter.router);
app.use('', taskRouter.router);
app.listen(3000, () => {
    console.log('server is listening')
  });