const mongoose = require('mongoose');
const product = require('./product');

const orderSchema = new mongoose.Schema({
        myProduct : {    type: mongoose.Schema.Types.ObjectId, ref:'Product'},
        quantity :{    type : Number, default: 1 },
        placedBy :{     type : String   },
});

module.exports = mongoose.model('Order',orderSchema);