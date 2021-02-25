const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');

router.get('/',(req,res,next)=>{
    res.status(200).json({
        message : 'first get request'
    });
});

router.post('/',async(req,res,next)=>{

    var product = new Product({
        name: req.body.name,
        price : req.body.price
    });
    try{
        const createdPost = await product.save();
        res.status(200).json({
            message : 'first post',
            createdProduct: createdPost 
        });
    }
    catch(err)
    {
        res.json({message : err});
    }
});

router.get('/:postId', async(req,res,next)=>{
    var postId = req.params.postId;
    try{
        var getPost = await Product.find({_id : postId});
        res.status(200).json({message:getPost});
    }
    catch(err){
        res.json({message:err});
    }
});

router.patch('/:postId', (req,res,next)=>{
    var postId = req.params.postId;
    res.status(200).json({
        message: 'updated post'
    });
});

router.delete('/:postId', (req,res,next)=>{
    var postId = req.params.postId;
    res.status(200).json({
        message : 'deleted post'
    });
});


module.exports = router;