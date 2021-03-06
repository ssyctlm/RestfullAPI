const express = require('express');
const router = express.Router();
//inport db models
const mongoose = require('mongoose');
const Product = require('../models/product');
const { urlencoded } = require('body-parser');
// const { deleteOne } = require('../models/product');
// const product = require('../models/product');

//import checkAuth
const checkAuth = require('../middleWare/check-auth');

//* multer
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,'./uploads/')
  },
  filename:function(req,file,cb){
    cb(null,new Date().toISOString().substring(0,10) + file.originalname)
  }
})
const fileFilter = (req,file,cb)=>{
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    cb(null,true);
  }else{
    cb(new Error('not allowed format. only png and jpeg allowed'),false);
  }
};

// const upload = multer({dest:'uploads/'});
const upload = multer({
  storage,
  limits:{
  fileSize:1024*1024*5
  },
  fileFilter:fileFilter
});




router.get('/',(req,res,next)=>{
  Product.find().select('name price _id productImage').exec()
  .then(
    docs=>{
      const response = {
        productsCount: docs.length,
        products: docs.map(doc=>{
          return {
            id:doc._id,
            name:doc.name,
            price:doc.price,
            productImage:doc.productImage,
            request:{
              type:'GET',
              url: "http://localhost:5000/products/"+doc._id
            }
          }
        })
      }
      console.log(docs);
      if(docs.length>0){
        res.status(200).json(response)
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


router.post('/', checkAuth, upload.single('productImage'),(req,res,next)=>{
  // const product = {
  //   name:req.body.name,
  //   price:req.body.price
  // }
  console.log(req.file);
  console.log(req.body);

  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name:req.body.name,
    price:req.body.price,
    productImage: req.file.path
  });
  product.save()
        .then(result=>{
          console.log(result);
          res.status(201).json({
            message:"Created product successfully",
            createdProduct:{
              name:result.name,
              price:result.price,
              _id:result._id,
              request:{
                type:'GET',
                url:"http://localhost:5000/products/"+result._id
              }
            }
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
        .select('name price _id productImage')
        .exec()
        .then(doc=>{
          console.log("from database:" ,doc);
          if(doc){
            res.status(200).json({
              product:doc,
              request:{
                type:'GET',
                url:"http://localhost:5000/products/"+doc._id
              }
            });
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

router.patch('/:productId',checkAuth,(req,res,next)=>{
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
    res.status(200).json({
      message:"product infomation updated successfully",
      request:{
        type:'GET',
        url:"http://localhost:5000/products/"+result._id
      }
    });
  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({
      error:err
    })
  })
});

router.delete('/:productId',checkAuth,(req,res,next)=>{
  const id = req.params.productId;
  Product.deleteOne({_id:id}).exec()
  .then(result=>{
    res.status(200).json({
      message:"product deleted",
      request:{
        type:'POST',
        url:'http//localhost:5000/products',
        body:{ name: 'String', price:'Number'}
      }
  })
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