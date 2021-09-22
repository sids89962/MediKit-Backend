const mongoose = require('mongoose')

const productSchema =  new mongoose.Schema({
        name:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        requied:true
    },
    rating:{
        type:Number,
        required:true
    },
    countInStock:{
        type:Number,
        required:true
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Product',productSchema)