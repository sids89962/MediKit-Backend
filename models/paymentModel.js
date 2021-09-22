  
const mongoose = require('mongoose')


const paymentSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
   
    cart:{
        type: Array,
        default: []
    },
    status:{
        type: String,
        default: "Pending"
    }
}, {
    timestamps: true
})


module.exports = mongoose.model("Payments", paymentSchema)