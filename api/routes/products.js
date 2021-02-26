const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');

router.get('/',async(req,res,next)=>{
    try{
        const allposts = await Product.find();
        res.status(200).json(allposts);
    }
    catch(err){
        res.status(500).json({
            message : err
        });
    }

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
        res.status(500).json({Error : err});
    }
});

router.get('/:postId', async(req,res,next)=>{
    var postId = req.params.postId;
    try{
        var getPost = await Product.find({_id : postId});
        res.status(200).json({message:getPost});
    }
    catch(err){
        res.status(500).json({Error:err});
    }
});

router.patch('/:postId', async(req,res,next)=>{
    var postId = req.params.postId;
    const updateOps = {};

    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    try {
        var updatePost  = await Product.updateOne({_id : postId},{$set : updateOps});
        res.status(200).json(updatePost);
    }
    catch(err) {
        res.status(500).json({message:err});
    }
});

router.delete('/:postId', async(req,res,next)=>{
    var postId = req.params.postId;
    try {
        var status = await Product.remove({ _id : postId});
        res.status(200).json(status);
    }
    catch(err)
    {
        res.status(500).json({message : err});      
    }
});


module.exports = router;