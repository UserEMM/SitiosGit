const mongoose = require("mongoose");

var schema = new mongoose.Schema({
    Email:{
        type:String,
        required:true
    },
    Action:{
        type:String,
        required:true
    },
    dateTime: {
        type: Date,
        default: Date.now
    }
})

const LogsDB = mongoose.model('logs',schema);

module.exports = LogsDB;