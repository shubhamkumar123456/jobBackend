const mongoose = require('mongoose');


const connectToDB = ()=>{
    mongoose.connect('mongodb://127.0.0.1:27017/JobPortal')
    .then(() => console.log('connected to mongodb successfully'))
    .catch(()=>console.log('error in connecting mongodb'))
}

module.exports = connectToDB