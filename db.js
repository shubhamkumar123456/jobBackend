const mongoose = require('mongoose');
require('dotenv').config()

const connectToDB = ()=>{
    mongoose.connect(`mongodb+srv://clboy768:${process.env.MONGO_PASSWORD}@jobportal.funkw.mongodb.net/?retryWrites=true&w=majority&appName=jobPortal`)
    .then(() => console.log('connected to mongodb successfully'))
    .catch(()=>console.log('error in connecting mongodb'))
}

module.exports = connectToDB