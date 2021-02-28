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
    
    var userId = req.params.userId;
    try{
        var getUser = await User.findOne({_id : userId});
        
    }
    catch(err){
        res.status(500).json({Error:err});
    }


    //res.json({message :'Order page of particular user'});
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
            placedBy : getUser.username
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
    var orderId = req.params.orderId;
    
    try
    {
        var getUser = await User.find({_id : userId});
        var response = await Order.remove({_id : orderId});
        res.status(200).json({deleted : 'response'});
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
        var response = await Order.find({_id : orderId});
        res.status(200).json({Found : response});
    }
    catch{
        res.status(500).json('Unable to find');
    }
});


var value = 0;

router.get('/:userId/checkout',async(req,res,next)=>{

    var userId = req.params.userId;
    try
    {
        var getUser = await User.findOne({_id : userId});
        Cart.findOne({placedBy : getUser.username}).populate('cart').exec(function(err,data){
            
            for(let k=0;k<data.cart.length;k++)
            {
                var order = data.cart[k];
                Order.findOne({_id : order._id}).populate('myProduct').exec(function(err,data2)
                {
                    value += data2.myProduct.price * data2.quantity;
                    //console.log(value);
                });
                return value;
            }
            console.log(value);            
        });
        
    }
    catch(err)
    {
        res.status(500).json({Error : 'failed to checkout'});
    }
});

module.exports= router;     