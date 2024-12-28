const jwt = require('jsonwebtoken')
require('dotenv').config()

const checkToken = (req, res, next) => {
    try {
        let token = req.headers.authorization;
        console.log(token)

        if (!token) {
            return res.json({ msg: "token not found", success: false })
        }

        console.log(process.env.JWT_SECRET)
        // let decode = jwt.verify(token, process.env.JWT_SECRET)
        // console.log("decode= ",decode)
        // req.user = decode  
        // next()
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
              // Handle token errors
              if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ msg: 'Token expired',success:false });
              } else if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ msg: 'Invalid token, access denied',success:false });
              } else {
                return res.status(401).json({ msg: 'Authentication failed',success:false });
              }
            }
        console.log("decode= ",decoded)
        req.user = decoded  
        next()
        })
    } catch (error) {
        return res.json({ msg: "invalid token", success: false,error:error.message })
    }


}


module.exports = checkToken