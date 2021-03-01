const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const User = require('../models/user');
const Cart = require('../models/cart');


//GET ALL USERS (done)
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

//CREATE NEW USER (done)
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

//GET SPECIFIC USER (done)
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

//MODIFY SPECIFIC USER (done)
router.patch('/:userId', async(req,res,next)=>{
    var userId = req.params.userId;
    var newName = req.body.name;
    
    try{
        var user = await User.updateOne({_id : userId},{$set :{username : newName}});
        res.json(user);
    }
    catch(err){
        res.status(500).json({Error:err});
    }
});

//DELETE SPECIFIC USER (done)
router.delete('/:userId', async(req,res,next)=>{
    var userId = req.params.userId;  
    try{
        var user = await User.deleteOne({_id : userId});
        res.json(user);
    }
    catch(err){
        res.status(500).json({Error:err});
    }
});

//GET SPECIFIC USER'S ORDERS (done)
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
                var obj = {order:populateOrdersinCart,
                        placedBy:currentCart.placedBy,
                        date:currentCart.date,
                        paymentStatus: currentCart.paymentStatus,
                        paymentMethod: currentCart.paymentMethod,
                        cartId : currentCart._id};
                arr.push(obj);
            }    
        }
        res.json(arr);
    }
    catch(err){
        res.status(500).json({Error:err});
    }
});

//CREATE SPECIFIC USER'S ORDERS (done)
router.post('/:userId/orders',async(req,res,next)=>{
    var userId = req.params.userId;
    try
    {
        var getUser = await User.findOne({ _id : userId});   
        var myProductArray =  req.body.productIdArray;
        var myQuantityArray = req.body.quantityArray;
        
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
            placedBy : req.body.placedBy,
            paymentMethod : req.body.paymentMethod,
            paymentStatus : req.body.paymentStatus
        });
        var response = await myCart.save();
        res.json(response);
    }
    catch{
        res.status(500).json({Error : 'failed'});
    }
});

//MODIFY CART STATUS BY PAYING 
router.patch('/:userId/orders/:cartId',async(req,res,next)=>{
    var cartId = req.params.cartId;
    var myPaymentStatus = req.body.paymentStatus;
    try
    {
        var myCart = await Cart.findOne({_id : cartId});
        
        
        if(myCart.paymentStatus == "Paid")
        {
            var response = await Cart.updateOne({_id : cartId},{$set :{paymentStatus : myPaymentStatus}});
            res.json(response); 
        }
        else if(myCart.paymentStatus != "Not Paid")
        {
            var response = await Cart.updateOne({_id : cartId},{$set :{paymentStatus : "Pending"}});
            res.json(response);
        }
    }
    catch
    {
        res.status(500).json('Unable to modify');
    }
});

//MODIFY SPECIFIC ORDER MADE BY USER (done)
router.patch('/:userId/orders/:orderId',async(req,res,next)=>{
    var orderId = req.params.orderId;
    var quantity = req.body.quantity;
    var productId = req.body.productId;
    try
    {
        var myOrder = await Order.findOne({_id : orderId});
        currentQuantity = myOrder.quantity;
        
        if(productId == myOrder.myProduct)
        {
            currentQuantity += quantity;
        }
        else
        {
            currentQuantity = quantity;
        }
        var response = await Order.updateOne({_id : orderId},{$set :{quantity : currentQuantity, myProduct : productId}});
        res.json(response);
    }
    catch
    {
        res.status(500).json('Unable to modify');
    }
});

//DELETE SPECIFIC ORDER MADE BY USER (done)
router.delete('/:userId/orders/:orderId',async(req,res,next)=>{
    var orderId = req.params.orderId;
    try
    {
        var response = await Order.deleteOne({_id : orderId});
        res.json({success:response});
    }
    catch{
        res.status(500).json('Unable to delete');
    }
});

//GET SPECIFIC ORDER MADE BY USER (done)
router.get('/:userId/orders/:orderId',async(req,res,next)=>{
    var orderId = req.params.orderId;
    try
    {
        var order = await Order.findOne({_id : orderId}).populate('myProduct');
        res.status(200).json({Found : order});
    }
    catch{
        res.status(500).json('Unable to find');
    }
});


//GET TOTAL BILL OF SPECIFIC USER (done)
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