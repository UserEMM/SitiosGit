const mongoose = require("mongoose");

var schema = new mongoose.Schema({
    Email:{
        type:String,
        required:true
    },
    Token:{
        type:String,
        required:true
    }
})

const TokenDB = mongoose.model('sendtokens',schema);

module.exports = TokenDB;