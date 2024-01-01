// const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
schema = mongoose.Schema;
const User = new schema({

    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:false
    },

})
// hashPassword generates a salt and hashes the given password.

User.methods.encryptPassword = async (password) => {


    // Generate a salt for password hashing.
    const salt = await bcrypt.genSalt(10);


    // Hash the password using the generated salt.
    return await bcrypt.hash(password,salt);

}
   // Check if the input password matches the stored password
User.methods.comparePassword = function (password) {
    return bcrypt.compare(password,this.password);
}
const newUser = mongoose.model("user",User)
module.exports = newUser