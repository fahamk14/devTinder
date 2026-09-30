
const express = require("express");
const authRouter = express.Router();

const {validateSignUp} = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const validator = require("validator");

authRouter.post("/signup",async (req,res)=>{
    try {

        validateSignUp(req);
        const {firstName, lastName, email, password} = req.body;
        const passwordHash = await bcrypt.hash(password,10)
        const user = new User({
            firstName,
            lastName,
            email,
            password:passwordHash
        })
        await user.save()
        res.send("User created successfully")
    } catch (error) {
        res.status(500).send("Error creating user: " + error.message)
    }
})

authRouter.post("/login", async(req,res)=>{
    try {
        const {email, password} = req.body;
        if(!validator.isEmail(email)){
            throw new Error("Invalid Email")
        }

        const user = await User.findOne({email:email})
        if(!user){
            throw new Error("Invalid Credentials")
        }

        const isPasswordValid = await user.comparePassword(password);
        if(!isPasswordValid){
            throw new Error("Invalid Credentials")
        }

        const token = await user.getJWT();
        res.cookie("token",token,{
            expires:new Date(Date.now() + 8 * 3600000)
        })
        res.send("Login Successfully")
    } catch (error) {
        res.status(500).send("Error : " + error.message)
    }
})

authRouter.post("/logout", (req,res)=>{
    res.cookie("token","null",{
        expires:new Date(Date.now())
    }).send("Logout Successfully")
})

module.exports = authRouter;
