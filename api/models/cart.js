const mongoose = require('mongoose');
const Order = require('./order');
//const Product = require('./Product');

const cartSchema = new mongoose.Schema({
    cart : [{ type : mongoose.Schema.Types.ObjectId ,ref:'Order'}],
    placedBy :{     type : String   }
});

module.exports = mongoose.model('Cart',cartSchema);