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
    IdItem:{
        type:String,
        required:true
    }
})

const OrderDB = mongoose.model('orders',schema);

module.exports = OrderDB;