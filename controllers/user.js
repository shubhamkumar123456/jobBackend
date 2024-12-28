const UserCollection = require('../models/Users')
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
var jwt = require('jsonwebtoken');
var randomstring = require("randomstring");
const nodemailer = require("nodemailer");
// const path = require('path');
require('dotenv').config()

// console.log(process.env.JWT_Secret)
const registerUser = async (req, res) => {
    // res.send("register function is running")
    const { name, email, password, role } = req.body;

    if (password.length < 7 || password.length > 20) {
        return res.json({ msg: "password length can not be less than 7 or more than 20", success: false })
    }

    if (!name) {
        return res.json({ msg: "name is required", success: false })
    }
    if (!email) {
        return res.json({ msg: "email is required", success: false })
    }
    if (!password) {
        return res.json({ msg: "password is required", success: false })
    }

    let findUser = await UserCollection.findOne({ email });

    if (findUser) {
        return res.json({ msg: "user already registered", success: false })
    }
    else {
        try {
            let hashedPassword = bcrypt.hashSync(password, salt)

            let data = await UserCollection.create({
                name,
                email,
                password: hashedPassword,
                role,
              
            })
            res.status(201).json({ msg: "user registered successfully", success: true });
        } catch (error) {
            res.status(500).json({ msg: "error in register user", success: false, error: error.message })
        }
    }



}

const loginUser = async (req, res) => {
    // res.send("login function is running")
    const { email, password } = req.body;
  
    try {
        let findUser = await UserCollection.findOne({ email });

        if (findUser) {
            let comparePassword = bcrypt.compareSync(password, findUser.password)
            if (comparePassword) {
                let token = jwt.sign({ _id: findUser._id, role: findUser.role }, process.env.JWT_Secret,{expiresIn:'24h'})
                res.json({ msg: "login successfull", success: true, token: token, role:findUser.role, tokenExpires:'24h' })
            }
            else {
                return res.json({ msg: "wrong password", success: false })
            }
        }
        else {
            return res.json({ msg: "user not found please signup", success: false })
        }
    } catch (error) {
        res.status(500).json({ msg: "error in login user", success: false, error: error.message })
    }
}

const updateUser = async (req, res) => {

    const { name, password, bio, profession } = req.body;

    let { _id, role } = req.user;
    let userId = req.params._id;

    try {
        console.log("login user id = ", _id);
        console.log("params id = ", userId)
    
        if (_id == userId) {
            if (password) {
                var hashedPassword = bcrypt.hashSync(password, salt)
            }
    
            let data = await UserCollection.findByIdAndUpdate(_id, { $set: { name, password: hashedPassword, bio, profession } });
            res.json({ msg: "user updated successfully",success:true });
        }
        else {
            return res.json({ msg: "not authorized to update this account", success: false })
        }
    } catch (error) {
        res.status(500).json({ msg: "error in updating user", success: false, error: error.message }) 
    }
  
}

const deleteUser = async (req, res) => {
   const  {_id,role} = req.user
    // res.send("delete function is running")
   try {
    let paramsId = req.params._id;
    if(_id==paramsId){
        let data = await UserCollection.findByIdAndDelete(_id)
        res.json({ msg: "user deleted successfully",success:true })
    }
    else{
        return res.json({ msg: "not authorized to update this account", success: false })
    }
   } catch (error) {
    res.status(500).json({ msg: "error in deleting user", success: false, error: error.message })
   }
   
}


const forgetPassword  = async(req,res)=>{
    const {email} = req.body;
  try {
    let user = await UserCollection.findOne({email});
    if(!user){
        return res.json({msg:"user not found or invalid email",success:false})
    }

    let token = randomstring.generate(30);
    console.log(token)
    user.resetPasswordToken = token;
    await user.save();

    await sendEmail(email , token)
     res.json({msg:"please check your email for password reset",success:true})
  } catch (error) {
    res.json({msg:"error in forget password",success:false ,error:error.message})
  }

}

async function sendEmail(email , resetToken){
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: process.env.App_Email,
          pass: process.env.App_Password,
        },
      });

      async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: process.env.App_Email, // sender address
          to: email, // list of receivers
          subject: "Password reset request", // Subject line
          text: `Please click the link below to choose a new password \n 
                http://localhost:8080/users/forgetPassword/${resetToken}
          `, // plain text body
       
        });
      
        console.log("Message sent: %s", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
      }
      
      main().catch(console.error);




}

const varifyPasswordToken = async(req,res)=>{
    // res.send("sb bdhiya")
    let token = req.params.token;
    console.log(token)
    let user = await UserCollection.findOne({resetPasswordToken:token})
    if(user){
        res.render('ForgetPassword', {token})
        // let x = path.join(__dirname,)
    }
    else{
        res.json({msg:"token expired",success:false})
    }
}


const resetPassword = async(req,res)=>{
       try {
        const {newPassword} = req.body;
        let {token} = req.params

        if(!token){
            return res.json({msg:"token expired",success:false})
        }
        if(!newPassword){
            return res.json({msg:"password is required",success:false})
        }

        let user = await UserCollection.findOne({resetPasswordToken:token})
        let hashedPassword = bcrypt.hashSync(newPassword, salt);

        user.password = hashedPassword
        user.resetPasswordToken = null
        await user.save()

        res.json({msg:"password updated successfully",success:true})
       } catch (error) {
        res.json({msg:"error in updaing password", success:false, errror:error.message})
       }

      
}


module.exports = {
    registerUser,
    loginUser,
    updateUser,
    deleteUser,
    forgetPassword,
    varifyPasswordToken,
    resetPassword
}
