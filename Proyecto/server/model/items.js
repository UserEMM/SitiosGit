const mongoose = require("mongoose");

var schema = new mongoose.Schema({
    Manufacturer:{
        type:String,
        required:true
    },
    Model:{
        type:String,
        required:true
    },
    ColorInstrumentText:{
        type:String,
        required:true
    },
    DescriptionInstrument:{
        type:String,
        required:true
    },
    Price:{
        type:String,
        required:true
    },
    Currency:{
        type:String,
        required:true
    },
    ColorInstrumentHex:{
        type:String,
        required:true
    },
    Category:{
        type:String,
        required:true
    },
    Thumbnail:{
        type:String,
        required:true
    }
})

const ItemsDB = mongoose.model('items',schema);

module.exports = ItemsDB;