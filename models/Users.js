const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,'name is required'],
    minLength:3,
    maxLength:80
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  },
  role:{
    type:String,
    default:'student',
    enum:['student','company']
  }

},{timestamps:true});

userSchema.add({
  bio:{
    type:String
  },
  profession:{
    type:String
  },
  resetPasswordToken:{
    type:String
  }
})

//mongoose pre and post method

// userSchema.pre('save',function(next){
//   if(this.password.length<=7 && this.password.length>=20){
//     return res.json({msg:"password length can not be less than 7 or more than 20",success:false})
//   }
//   next()
// })

module.exports = mongoose.model( 'users',userSchema)