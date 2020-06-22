const express = require('express');
const router = express.Router();

router.get('/',(req,res,next)=>{
  res.status(200).json({
    message:'Orders were fetched'
  });
});


router.post('/',(req,res,next)=>{
  res.status(201).json({
    message:'Order was created'
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
