const express = require('express');
const router = express.Router();



router.get('/',(req,res,next)=>{
    res.status(200).json({
        message : 'first get request'
    });
});

router.post('/',(req,res,next)=>{
    res.status(200).json({
        message : 'first post request'
    });
});

router.get('/:postId', (req,res,next)=>{
    var postId = req.params.postId;
    if(postId == 'hey')
    {
        res.status(200).json({
            message :'hey to you too!'
        });   
    }
    else
    {
        res.status(200).json({
            message : '-_-'
        });
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