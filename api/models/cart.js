const mongoose = require('mongoose');
const Order = require('./order');
//const Product = require('./Product');

const cartSchema = new mongoose.Schema({
    cart : [{ type : mongoose.Schema.Types.ObjectId ,ref:'Order'}],
    placedBy :{type : Array, items: String},
    paymentMethod :{type:String},
    paymentStatus: {type : Array, items : {
        type : String,
        enum : ["Paid","Not Paid", "Failed"]
    }},
    date : {type : Date, default : new Date}
});

module.exports = mongoose.model('Cart',cartSchema);