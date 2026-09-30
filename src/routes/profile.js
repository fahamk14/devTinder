const express = require("express");
const profileRouter = express.Router();
const { checkUser } = require("../middlewares/auth");
const User = require("../models/user")
const bcrypt = require("bcrypt")
const validator = require("validator")
const { checkEditValidation } = require("../utils/validation");

profileRouter.get("/profile/view",checkUser, (req,res)=>{
    try{
        res.send(req.user);
    }catch(error){
        res.status(500).send("Error : " + error.message)
    }
})

profileRouter.patch("/profile/edit",checkUser,async (req,res)=>{
    if(!checkEditValidation(req)){
        return res.status(400).send("Invalid edit request");
    }
    const fetchedUser = await User.findById(req.user._id)
    Object.keys(req.body).forEach(field=>fetchedUser[field] = req.body[field])
    fetchedUser.save();
    res.json({
        message:"Profile Updated Successfully",
        data:fetchedUser
    });
})

profileRouter.patch("/profile/password",checkUser,async (req,res)=>{
    // Add update password logic here
    const isNewPasswordStrong = validator.isStrongPassword(req.body.newPassword)
    if(!isNewPasswordStrong){
        throw new Error("Password not strong, try again !")
    }
    const passwordHash = await bcrypt.hash(req.body.newPassword,10)
    req.user.password = passwordHash;
    const user = new User(req.user);
    user.save();
    res.json({
        message:"Password Updated Successfully"
    })
})

module.exports = profileRouter;