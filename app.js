const express = require('express');
const app = express(); 
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv/config');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

mongoose.connect(process.env.DB_CONNECT_ALIAS,
    {useNewUrlParser:true,useUnifiedTopology:true},
    ()=>(console.log("Connected!")));

//CORS HANDLING
/*
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header("Access-Control-Allow-Headers","Origin,X-Requested-Width,Content-Type,Accept,Authorization");
    if(req.method == 'OPTIONS')
    {
        res.header('Access-Control-Allow-Methods','GET','PUT','POST','PATCH','DELETE');
        res.status(200).json({});
    }
});
*/

app.use('/products',productRoutes);
app.use('/orders',orderRoutes);

app.use((req,res,next)=>{
    const error = new Error('not found');
    error.status = 404;
    next(error);
});


app.use((error,req,res,next) =>{
    res.status(error.status || 500);
    res.json({
        error: {
            message : error.message 
        }
    });
});

module.exports  = app;