const mongoose = require("mongoose")
const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    status:{
        type:"String",
        enum:{
            values:["accepted","rejected","interested","ignored"]
        }
    }
})

connectionRequestSchema.pre("save",function() {
    if(this.fromUserId.equals(this.toUserId)){
        throw new Error("You cannot send a request to yourself")
    }
})
const connectionRequest = mongoose.model("connectionRequest",connectionRequestSchema)
module.exports = connectionRequest;