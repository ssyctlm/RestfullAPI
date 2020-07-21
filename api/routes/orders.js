const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Product = require('../models/product');
const Order = require('../models/order');

const checkAuth = require('../middleWare/check-auth');


router.get('/',checkAuth,(req,res,next)=>{
  // res.status(200).json({
  //   message:'Orders were fetched'
  // });
  Order.find()
       .select("product quantity _id")
       //.populate("Product") //! doesn't work, I will gigure out later
       .exec()
       .then(orders=>{
         console.log(orders);
         res.status(200).json({
           count: orders.length,
           orders:orders.map(order=>{
             return {
               _id: order._id,
               product:order.product,
               productName:order.productName,
               quantity:order.quantity,
              request:{
                type:"GET",
                url:"http://localhost:5000/orders/"+ order._id
              }
             };
           })
         });
       })
       .catch(err=>{
         res.status(500).json(
          {
             message:'something goes wrong',
             error:err
          }
         )
       })
});


router.post('/',checkAuth,(req,res,next)=>{
  //dummy code
  // const order = {
  //   productId:req.body.pro.productId,
  //   quantity:req.body.quantity
  // }
  Product.findById(req.body.productId)
    .then(productResult=>{
      if(!productResult){
        return res.status(404).json({
          message:"Product not found"
        })
      }
      // console.log("product",product);
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity:req.body.quantity,
        product: productResult._id,  
        productName: productResult.name 
      });
      return order.save();
    })
    .then(result=>{
    console.log(result);
    res.status(201).json({
      message:"Order saved",
      createOrder:{
        _id:result._id,
        product:result.product,
        productName:result.productName,
        quantity:result.quantity,
      },
      request:{
        type:"GET",
        url:"http://localhost:5000/orders/"+result._id
      }
    });
  })
  .catch(err=>{
      console.log(err);
      res.status(500).json({
        message:'terrible wrong',
        error:err
      })
    });
});


router.get('/:orderId',checkAuth,(req,res,next)=>{
  const id = req.params.orderId;
  Order.findById(id)
       .select("product _id productName")
       .exec()
       .then(
          doc=>{
            if(doc){
                console.log(doc);
                res.status(200).json({
                  order:doc,
                  response:{
                    method:"GET",
                    url: "http://localhost:5000/orders/"+doc._id
                  }
                });
            }else{
              console.log("404 not found");
              res.status(404).json({
                message: 'no relevant data available '
              })
            }

           }
         )
       .catch(err=>{
        res.status(500).json({
            message:'something goes wrong',
            error:err
         })
        })
})


router.delete('/:orderId',checkAuth,(req,res,next)=>{
  const id = req.params.orderId;
  if(id === 'all'){
    Order.deleteMany({quantity: 1}).then(
      result=>{
        res.status(200).json({messgae: 'All deleted'})
      }
    )
  }else{
    Order.deleteOne({_id:id}).then(result=>{
      console.log('deleted successfully');
      res.status(200).json({
        message:"deleted successfully",
        querryOther:{
          method:'GET',
          url:"http://localhost:5000/orders"
        },
        addRequest: {
          type: "POST",
          url: "http://localhost:5000/orders",
          body: { productId: "ID", quantity: "Number", productName:"String" }
         }
      })
    }
    ).catch(
      err=>{
        res.status(500).json({
          message:"something wrong ",
          error:err
        })
      }
    )
  }
})

// router.get('/:orderId',(req,res,next)=>{
//   const id = req.params.orderId;
//   Order.findById(id)
//        .exec()
//        .then(doc=>{
//          console.log(doc)
//          res.status(200).json({
//            order:doc,
//            response:{
//              method:"GET",
//              url: "http://localhost:5000/orders/"+doc._id
//            }

//          })
//        })
//        .catch(
//         err=>{
//           res.status(500).json(
//            {
//               message:'something goes wrong',
//               error:err
//            }
//        )

// });


// router.delete('/:orderId',(req,res,next)=>{
//   const id = req.params.orderId;
//   Order.deleteOne({_id:id})
//        .exec()
//        .then(result=>{
//         res.status(200).json({
//             message:"order deleted",
//             request: {
//               type: "POST",
//               url: "http://localhost:5000/orders",
//               body: { productId: "ID", quantity: "Number", productName:"String" }
//             }
//       })
//     })    
//     .catch(err => {
//       res.status(500).json({
//         error: err
//       });
//     })
// });





module.exports = router;
