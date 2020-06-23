const express = require('express');
const router = express.Router();

router.get('/',(req,res,next)=>{
  res.status(200).json({
    message:'Orders were fetched'
  });
});


router.post('/',(req,res,next)=>{
  const order = {
    productId:req.body.pro.productId,
    quantity:req.body.quantity
  }
  res.status(201).json({
    message:'Order was created',
    order
  });
});


router.get('/:orderId',(req,res,next)=>{
  const id = req.params.orderId;
  res.status(200).json({
    message:"order details",
    id
  });
});


router.delete('/:orderId',(req,res,next)=>{
  const id = req.params.orderId;
  res.status(200).json({
    message:"order deleted",
    id
  });
});


module.exports = router;
