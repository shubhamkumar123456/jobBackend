const { registerUser, loginUser, updateUser, deleteUser, forgetPassword, varifyPasswordToken, resetPassword } = require("../controllers/user");

const express = require('express');
const checkToken = require("../middleware/checkToken");
const router = express.Router();

router.post('/create', registerUser)
router.post('/login', loginUser)
router.put('/update/:_id', checkToken, updateUser)
router.delete('/delete/:_id', checkToken, deleteUser)
router.post('/forgetPassword', forgetPassword);
router.get('/forgetPassword/:token', varifyPasswordToken);
router.post('/resetPassword/:token', resetPassword);



module.exports = router