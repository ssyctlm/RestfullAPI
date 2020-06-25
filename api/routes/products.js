const express = require('express');
const router = express.Router();
//inport db models
const mongoose = require('mongoose');
const Product = require('../models/product');
// const { deleteOne } = require('../models/product');
// const product = require('../models/product');




router.get('/',(req,res,next)=>{
  Product.find().exec()
  .then(
    docs=>{
      console.log(docs);
      if(docs.length>0){
        res.status(200).json(docs)
      }else{
        res.status(200).json({
          message: "No products found"
        })
      }
    }
  )
  .catch(err=>{
    console.log(err);
    res.status(500).json({
      error:err
    })
  })
  // res.status(200).json({
  //   message: `All products were listed - GET `,
    
  // });
});


router.post('/',(req,res,next)=>{
  // const product = {
  //   name:req.body.name,
  //   parce:req.body.price
  // }
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name:req.body.name,
    price:req.body.price
  });
  product.save()
        .then(result=>{
          res.status(201).json({
            message:"Handling POST requests to /products",
            createdProduct:result
          });
        })
        .catch(err=>{
          console.log(err);
          res.status(500).json({
            error:err
          })
        })

});



router.get('/:productId',(req,res,next)=>{
  const id = req.params.productId;
  // Product.findById({_id:id},(err,data)=>{
  //   if(err) return console.log(err);
  //   done(null,data=>{
  //     console.log(data);
  //     res.status(200).json(data)
  //   });
  // })
  Product.findById(id)
        .exec()
        .then(doc=>{
          console.log("from database:" ,doc);
          if(doc){
            res.status(200).json(doc);
          }else{
            res.status(404).json({
              message: 'no corresponding product with this id'
            })
          }
        })
        .catch(err=>{
          console.log(err);
          res.status(500).json({error:err});
        })
  // if(isNaN(id)){
  //   res.status(400).json({
  //     message: 'the product id is invalid'
  //   });
  // };
  // res.status(200).json({
  //   message: `GET product - ${id} `
  // });
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
  // if(isNaN(id)){
  //   res.status(400).json({
  //     message: 'the product id is invalid'
  //   });
  // };
  // res.status(200).json({
  //   message: `product - ${id} updated`
  // });
  const updateOps ={}; //*update Options to make it dynamicaly fit this data structure {name:req.body.newName,price:req.body.newPrice}
  for(const ops of req.body){
    updateOps[ops.propName] = ops.value;
  }
  Product.update({_id:id},{$set:updateOps})
  .exec()
  .then(result=>{
    console.log(result);
    res.status(200).json(result);
  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({
      error:err
    })
  })
});

router.delete('/:productId',(req,res,next)=>{
  const id = req.params.productId;
  Product.deleteOne({_id:id}).exec()
  .then(result=>{
    res.status(200).json(result)
  }).catch(
    err=>{
      console.log(err);
      res.status(500).json({
        error:err
      })
    }
  );
  // if(isNaN(id)){
  //   res.status(400).json({
  //     message: 'the product id is invalid'
  //   });
  // };
  // res.status(200).json({
  //   message: `product - ${id} deleted`
  // });
});



module.exports = router;