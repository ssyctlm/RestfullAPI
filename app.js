// Express application handling request and response for us
const express = require('express');
const app = express();
//Morgan is a HTTP request logger middleware for node.js
const morgan = require('morgan');  // tell Express to funnel all requests through this middleware in the end

//import Products api handlers
const productsRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');



// app.use to pass in middle-ware;
//* quick start
// app.use((req,res,next)=>{
//   res.status(200).json({
//     message:"Express app active"
//   });
// });

app.use(morgan('dev'))

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