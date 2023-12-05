// const express = require("express")
const mongoose = require("mongoose")
schema = mongoose.Schema;
const User = new schema({

    userName:{
        type: String,
        required: true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },

})
const newUser = mongoose.model("user",User)
module.exports = newUser