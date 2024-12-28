const express = require('express');
const app = express();
const port = 8080;
const cors = require('cors')

const connection = require('./db')  // 
connection();
const userRouter = require('./routes/user')
const jobRouter = require('./routes/job')
const applicantRouter = require('./routes/applicants')

app.use(cors())
app.use(express.json({limit:"50mb"})) // middleware are functions the that  have the access of requesting to an object and responding to an object. they can modify the request and resposne and can also be used between the routes

app.set('view engine', 'ejs')
app.get('/',(req,res)=>{
    res.send('welcome page')

})

app.use('/users',userRouter);
app.use('/job',jobRouter);
app.use('/applicant',applicantRouter)


app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})




    