const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const User = require('../models/user');
const Cart = require('../models/cart');

router.get('/',async(req,res,next)=>{
   try{
        const allUsers = await User.find();
        res.status(200).json(allUsers);
   }
   catch(err){
        res.status(404).json({
            message : 'not found'
        });
   }
});

router.post('/',async(req,res,next)=>{
    try{
        var newUser = new User({
            username: req.body.username
        });
        const userStatus = await newUser.save();
        res.status(201).json({
            success : 'created user',
            userDetails: userStatus
        });
    }
    catch(err){
        res.status(500).json({
            failed :'could not create user'
        });
    }
});


router.get('/:userId', async(req,res,next)=>{
    var userId = req.params.userId;
    try{
        var getUser = await User.find({_id : userId});
        res.status(200).json(getUser);
    }
    catch(err){
        res.status(500).json({Error:err});
    }
});

router.get('/:userId/orders',async(req,res,next)=>{
    
    var arr = new Array();
    var userId = req.params.userId;
    try{
        var getUser = await User.findOne({_id : userId});
        var allCarts = await Cart.find({placedBy : {$all :[getUser.username]}});
        
        for(let i=0;i<allCarts.length;i++)
        {
            var currentCart = allCarts[i];
            var populateCurrentCart = await Cart.findOne({_id : currentCart._id}).populate('cart');
            var myCartOrder = populateCurrentCart.cart;
            
            for(let j=0;j < myCartOrder.length; j++)
            {
                var myOrdersinCart = myCartOrder[j];
                var populateOrdersinCart = await Order.findOne({_id : myOrdersinCart._id}).populate('myProduct');
                arr.push(populateOrdersinCart);
            }    
        }
        res.json(arr);
    }
    catch(err){
        res.status(500).json({Error:err});
    }
});

router.post('/:userId/orders',async(req,res,next)=>{
    var userId = req.params.userId;
    try
    {
        var getUser = await User.findOne({ _id : userId});   
        var myProductArray =  req.body.productIdArray;
        var myQuantityArray = req.body.quantity;
        
        var array1 = new Array();    
        for(let k=0;k<myProductArray.length;k++)
        {
            var order = new Order({
                myProduct : myProductArray[k],
                quantity : myQuantityArray[k],
            });
            var status = await order.save();
            array1.push(order._id);
        }
        var myCart = new Cart({
            cart : array1,
            placedBy : req.body.placedBy
        });
        var response = await myCart.save();
        res.json(response);
    }
    catch{
        res.status(500).json({Error : 'failed'});
    }
});

router.delete('/:userId/orders/:orderId',async(req,res,next)=>{
    var userId = req.params.userId;
    var CartId = req.params.orderId;
    try
    {
        var response = await Cart.deleteOne({_id : CartId});
        res.json({success:response});
    }
    catch{
        res.status(500).json('Unable to delete');
    }
});

router.get('/:userId/orders/:orderId',async(req,res,next)=>{
    var userId = req.params.userId;
    var orderId = req.params.orderId;
    
    try
    {
        var getUser = await User.find({_id : userId});
        var cart = await Cart.find({_id : orderId});
        res.status(200).json({Found : cart});
    }
    catch{
        res.status(500).json('Unable to find');
    }
});



router.get('/:userId/checkout',async(req,res,next)=>{

    var userId = req.params.userId;
    try
    {
        var currentBill = 0;

        var getUser = await User.findOne({_id : userId});
        var allCarts = await Cart.find({placedBy : {$all :[getUser.username]}});

        for(let i=0;i<allCarts.length;i++)
        {
            var currentCart = allCarts[i];
            var populateCurrentCart = await Cart.findOne({_id : currentCart._id}).populate('cart');
            var myCartOrder = populateCurrentCart.cart;
            
            for(let j=0;j < myCartOrder.length; j++)
            {
                var myOrdersinCart = myCartOrder[j];
                var populateOrdersinCart = await Order.findOne({_id : myOrdersinCart._id}).populate('myProduct');
                currentBill += (populateOrdersinCart.myProduct.price*populateOrdersinCart.quantity/populateCurrentCart.placedBy.length);
            }    
        }
        res.json(currentBill);
    }
    catch(err)
    {
        res.status(500).json({Error : 'failed to checkout'});
    }   
});

module.exports= router;     