const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
        product : 
        {
           // type: mongoose.Schema.Types.ObjectId, ref:'Product',required:true
           type : String 
        },
        quantity :
        {
            type : Number, default: 1
        },
        placedBy :
        {
            type : String
        }
});

module.exports = mongoose.model('Order',orderSchema);