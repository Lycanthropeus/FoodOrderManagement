const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

router.get('/',async(req,res,next)=>{
    var allOrders = await Order.find();

    try{
        res.send(allOrders);
    }
    catch(err){
        message : 'not found'
    }

});

// router.post('/',async(req,res,next)=>{

//     const order = new Order({
//         product : req.body.productId,
//         quantity : req.body.quantity,
//         placedBy : req.body.placedBy
//     });

//     const response = await order.save();
//     res.status(201).json({
//         response
//     });
// });

router.get('/:orderId',async(req,res,next)=>{
    var orderId = req.params.orderId;
    try{
        var getOrder = await Order.find({_id : orderId});
        res.status(200).json(getOrder);
    }
    catch(err){
        res.status(500).json({Error:err});
    }
});

// router.delete('/:orderId',async(req,res,next)=>{
//     var orderId = req.params.orderId;
//     try {
//         var status = await Order.remove({ _id : orderId});
//         res.status(200).json({
//             message : 'Order deleted successfully',
//             request : {
//                 type : 'POST',
//                 url : 'http://localhost:3000/products',
//                 body : {name : 'String',price : 'Number'}
//             }
//         });
//     }
//     catch(err)
//     {
//         res.status(500).json({message : err});      
//     }
// });

module.exports = router;