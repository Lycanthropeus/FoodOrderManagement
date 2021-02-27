const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const User = require('../models/user');

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
        var getUser = await User.find({ _id : userId });
        var ordersByUser = await Order.find({placedBy : getUser[0].username}); 
        res.json(ordersByUser);
        //res.send(getUser[0].username);
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
        //res.send(userId);
        var getUser = await User.find({_id : userId});
        var myOrder = new Order({
            myProduct : req.body.productId,
            quantity : req.body.quantity,
            placedBy : getUser[0].username
        });
        var response = await myOrder.save();
        res.json(response);
    }
    catch{
        // res.status(500).json({Error : 'failed'});
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


router.get('/:userId/checkout',(req,res,next)=>{
    Order.findOne({placedBy : "Lata"}).populate('myProduct').exec(function(err,data){
        res.json({price:data.myProduct.price});
    })
});

module.exports= router; 