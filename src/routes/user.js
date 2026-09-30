const express = require("express");
const { checkUser } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

userRouter.get("/user/requests/received",checkUser,async (req,res)=>{
    try {
        const loggedInUser = req.user;
        const fetchedConnectionRequest = await connectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",["firstName","lastName","age","skills","about"])

        res.json({
            message:"Connection Requests fetched successfully",
            data: fetchedConnectionRequest
        })
    }catch(err){
        res.status(400).send("Error: "+err.message)
    }

})

userRouter.get("/user/connections",checkUser,async(req,res)=>{
    try{
        const loggedInUser = req.user;

        const fetchedConnectionRequest = await connectionRequest.find({
            $or:[
                {fromUserId: loggedInUser._id, status:"accepted"},
                {toUserId: loggedInUser._id, status:"accepted"}
            ]
        }).populate("fromUserId","firstName lastName").populate("toUserId","firstName lastName")

        res.json({
            message:"Connection requests fetched",
            data: fetchedConnectionRequest
        })
    }
    catch(err){
        res.status(400).send({
            message:"Error: " + err.message
        })
    }
})

userRouter.get("/feed",checkUser,async (req,res)=>{
    try {
        const loggedInUser = req.user;
        let page = req.query.page || 1;
        let limit = req.query.limit || 10;
        limit = limit > 50 ? 50 : limit;
        let skip = (page-1)*limit

        const fetchedConnectionRequest = await connectionRequest.find({
            $or:[{fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}]
        })

        const hideUsers = new Set();
        fetchedConnectionRequest.forEach(req=>{
            hideUsers.add(req.fromUserId);
            hideUsers.add(req.toUserId)
        })

        const users = await User.find({
            _id:{
                $nin:Array.from(hideUsers)
            }
        }).select("firstName lastName age about").skip(skip).limit(limit)

        res.json({
            message:"Feed fetched",
            data:users
        })
    }
    catch(err){
        res.status(400).send({
            message:"Error " + err.message
        })
    }
})
module.exports=userRouter