const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({
    title:{
        type:String,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    description:{
        type:String,
    },
    company:{
        type:String
    },
    salary:{
        type:String
    },
    image:{
        type:String
    },
    jobRole:{
        type:String,
    },
    requirements:{
        type:Array
    },
    skills:{
        type:Array
    },
 
    lastDate:{
        type:String
    }

},{timestamps:true})

jobSchema.add({
    location:{
        type:String,
        required:true
    },
    jobType:{
        type:String,
        required:true
    },
    ShiftAndSchedule:{
        type:String,
        required:true
    },
    lastDateOfApply:{
        type:Date
    },
    applicants:[
        { 
                type:mongoose.Schema.Types.ObjectId,
                ref:'users'
        
         
        }
    ],
})

module.exports = mongoose.model('job',jobSchema)