const express = require("express")
const requestRouter = express.Router()
const User  = require("../models/user")
const connectionRequest = require("../models/connectionRequest")
const {checkUser} = require("../middlewares/auth")

requestRouter.post("/requests/:status/:toUserId", checkUser, async (req,res)=>{
    try {
        const fromUserId = req.user._id
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["interested","ignored"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message:"Status is incorrect"
            })
        }

        const toUser = await User.findById(toUserId)
        if(!toUser){
            return res.status(400).json({
                message: "To User does not exist"})
        }
        const isConnectionRequestExists = await connectionRequest.find({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId, toUserId:fromUserId}
            ]
        })
        console.log(isConnectionRequestExists)
        console.log(fromUserId,toUserId)
        if(isConnectionRequestExists.length){
            return res.status(400).json({
                message: "Connection Request already exists"})
        }

        const newConnection = await connectionRequest.create({
            fromUserId,toUserId,status
        })
        const data = await newConnection.save()
        res.json({
            message:req.user.firstName + " " + status + " " + toUser.firstName,
            data
        })
    }catch(err){
        res.status(400).json({
            message: "Error: " + err.message
        })
    }
})

requestRouter.post("/requests/review/:status/:requestId",checkUser, async (req,res)=>{
    try {
        const loggedInUser = req.user;
        const {status, requestId} = req.params;

        const allowedStatus = ["accepted","rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message:"Status is invalid"
            })
        }

        const fetchedConnectionRequest = await connectionRequest.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status:"interested"
        })

        if(!fetchedConnectionRequest){
            return res.status(404).json({
                message:"Cnnection request not found"
            })
        }
        fetchedConnectionRequest.status = status;
        const data = fetchedConnectionRequest.save();

        res.json({
            message:loggedInUser.firstName + " " + status + " request",
            data
        })
    }catch(err){
        res.status(400).json({
            message:"Error: " + err.message
        })
    }
})

module.exports = requestRouter
