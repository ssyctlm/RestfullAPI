const express = require('express');
const router = express.Router();



router.get('/',(req,res,next)=>{
  res.status(200).json({
    message: `All products were listed - GET `
  });
});
router.post('/',(req,res,next)=>{
  const product = {
    name:req.body.name,
    parce:req.body.price
  }
  res.status(201).json({
    message: `All products were listed - POST `,
    createdProduct:product
  });
});



router.get('/:productId',(req,res,next)=>{
  const id = req.params.productId;
  if(isNaN(id)){
    res.status(400).json({
      message: 'the product id is invalid'
    });
  };
  res.status(200).json({
    message: `GET product - ${id} `
  });
});

router.post('/:productId',(req,res,next)=>{
  const id = req.params.productId;
  if(isNaN(id)){
    res.status(400).json({
      message: 'the product id is invalid'
    });
  };
  res.status(201).json({
    message: `POST product - ${id} `
  });
});

router.patch('/:productId',(req,res,next)=>{
  const id = req.params.productId;
  if(isNaN(id)){
    res.status(400).json({
      message: 'the product id is invalid'
    });
  };
  res.status(200).json({
    message: `product - ${id} updated`
  });
});

router.delete('/:productId',(req,res,next)=>{
  const id = req.params.productId;
  if(isNaN(id)){
    res.status(400).json({
      message: 'the product id is invalid'
    });
  };
  res.status(200).json({
    message: `product - ${id} deleted`
  });
});



module.exports = router;