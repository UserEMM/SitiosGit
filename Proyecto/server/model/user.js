const mongoose = require("mongoose");

var schema = new mongoose.Schema({
    IdDocument:{
        type:String,
        required:true
    },
    FirstName:{
        type:String,
        required:true
    },
    LastName:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    },
    State:{
        type:String,
        required:true
    },
    Canton:{
        type:String,
        required:true
    },
    District:{
        type:String,
        required:true
    },
    SecurityQuestion1:{
        type:String,
        required:true
    },
    SecurityQuestion2:{
        type:String,
        required:true
    },
    SecurityQuestion3:{
        type:String,
        required:true
    },
    Status:{
        type:String,
        required:true
    },
    
})

const UserDB = mongoose.model('users',schema);

module.exports = UserDB;