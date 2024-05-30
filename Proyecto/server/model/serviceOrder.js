const mongoose = require("mongoose");

var schema = new mongoose.Schema({
    CustomerName:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true
    },
    CustomerState:{
        type:String,
        required:true
    },
    CustomerCanton:{
        type:String,
        required:true
    },
    Service:{
        type:String,
        required:true
    },
    CustomerDescription:{
        type:String,
        required:true
    }
})

const ServiceOrderDB = mongoose.model('serviceorders',schema);

module.exports = ServiceOrderDB;