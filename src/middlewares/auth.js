const jwt = require("jsonwebtoken");
const User = require("../models/user")

const checkUser = async (req,res,next)=>{
    const token = req.cookies.token;
    if(token === "null"){
        return res.status(401).send("Unauthorized");
    }
    const decoded = jwt.verify(token,"secretKey");
    if(!decoded){
        return res.status(400).json({
            message:"Token Expired, Login again !!"
        })
    }
    const user = await User.findById(decoded.id)
    if(!user){
        return res.status(400).send("User not found");
    }
    req.user = user;
    next();
}

module.exports = {
    checkUser
}