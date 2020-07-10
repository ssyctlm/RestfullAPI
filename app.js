// Express application handling request and response for us
const express = require('express');
const app = express();
//Morgan is a HTTP request logger middleware for node.js
const morgan = require('morgan');  // tell Express to funnel all requests through this middleware in the end
//mongoose - a easly used tool to manipulate mongodb
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://productAPI:productAPI@cluster0-v5nje.mongodb.net/Cluster0?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true });
// "mongodb+srv://glitch:abc123456@cluster0-v5nje.mongodb.net/Cluster0?retryWrites=true&w=majority";


//import Products api handlers
const productsRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');

// middleware [body-parser] which is for parse incoming request which it's not eassily be formated and read by nodeJS
// body-parser support urlencoded, body and json-data.
const bodyParser = require('body-parser');



// app.use to pass in middle-ware;
//* quick start
// app.use((req,res,next)=>{
//   res.status(200).json({
//     message:"Express app active"
//   });
// });

app.use(morgan('dev'));
// decide what to be parsed by bodyparser
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false})); 
app.use(bodyParser.json());

// To prevent cors (Cors is a securtiy mechanism and force by browser )
app.use((req,res,next)=>{
  res.header('Access-Control-Allow-Origin','*'); //if we want specific url to access this api, we can change the * to that url
  res.header('Access-Control-Allow-Header','Origin,X-Requested-With,Content-Type,Accept,Authorization');
  if(req.method==="OPTIONS"){
    res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
    return res.status(200).json({});
  }
  next();
});


//Routes which should handle request
app.use('/products',productsRoutes);
app.use('/orders',ordersRoutes);

//Handle err messages, convert them to Json.
app.use((req,res,next)=>{
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error,req,res,next)=>{
  res.status(error.status || 500);
  res.json({
    error:{
      message:error.message
    }
  });
});

module.exports = app;