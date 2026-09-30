const validator = require("validator");

const validateSignUp = (req)=>{
    const {firstName, lastName, email, password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }
    else if(!validator.isEmail(email)){
        throw new Error("Email is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong")
    }
}

const checkEditValidation =async (req) =>{
    const allowedFields = ["age","gender","photo","skills"]
    const isEditAllowed = Object.keys(req.body).every(field=>allowedFields.includes(field))
    if(!isEditAllowed){
        throw new Error("Edit not allowed")
    } else {
        return true;
    }
}

module.exports = {
    validateSignUp,
    checkEditValidation
}