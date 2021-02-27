const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');

router.get('/',async(req,res,next)=>{
    try{
        const allposts = await Product.find().select('name price _id');
        res.status(200).json({
            length: allposts.length,
            contents : allposts.map(post=>{
                return {
                    name : post.name,
                    price : post.price,
                    _id : post._id,
                    request : {
                        type : 'GET',
                        url : 'http://localhost:3000/products/' + post._id   
                    }
                }
            })
        });
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
        res.status(201).json({
            message : 'Created product successfully',
            createdProduct: {
                name : createdPost.name,
                price : createdPost.price,
                _id : createdPost._id,
                request: {
                    type : 'GET',
                    url : "http://localhost:3000/products" + createdPost._id  
                }
            } 
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
        res.status(200).json({
            message : 'Product updated successfully',
            request: {
                type : 'GET',
                url : 'http://localhost:3000/products/' + postId
            }
        });
    }
    catch(err) {
        res.status(500).json({message:err});
    }
});

router.delete('/:postId', async(req,res,next)=>{
    var postId = req.params.postId;
    try {
        var status = await Product.remove({ _id : postId});
        res.status(200).json({
            message : 'Product deleted successfully',
            request : {
                type : 'POST',
                url : 'http://localhost:3000/products',
                body : {name : 'String',price : 'Number'}
            }
        });
    }
    catch(err)
    {
        res.status(500).json({message : err});      
    }
});


module.exports = router;