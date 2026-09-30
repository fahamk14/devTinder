const mongoose = require("mongoose");
const validator =  require("validator")
const jwt =  require("jsonwebtoken")
const bcrypt = require("bcrypt")

const userSchema =new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:50
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address")
            }
        }
    },
    password:{
        type:String,
        required:true,
        minLength:8,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Your password is weak")
            }
        }
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        validate:{
            validator:function(value){
                if(!["male","female","other"].includes(value)){
                    throw new Error("Invalid Gender value")
                }
            },
            message:"Gender must be male, female, or other"
        }
    },
    photo:{
        type:String,
        default:"https://img.magnific.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?semt=ais_hybrid&w=740&q=80",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Photo URL")
            }
        }
    },
    skills:{
        type:[String]
    }
},{
    timestamps:true
})

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({id:user._id},"secretKey",{expiresIn:"1d"});
    return token;
}

userSchema.methods.comparePassword = async function(passwordInput){
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInput,passwordHash);
    return isPasswordValid;
}

const User = mongoose.model("User", userSchema);
module.exports = User;