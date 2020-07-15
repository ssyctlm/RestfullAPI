const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); //to encrypt user password

const User = require('../models/user')


router.get('/',(req,res,next)=>{
  User.find().select('_id email').exec()
    .then(
      docs=>{
      const response = {
        userCount:docs.length,
        users: docs.map(user=>{return user})
      };
      console.log(docs);
      res.status(200).json(response);
    }
    )  
    .catch(err=>{
      console.log(err);
      res.status(500).json(
        {error:err}
      )
    })
})

router.post('/singup',(req,res,netx)=>{
  User.find({email:req.body.email}).exec()
  .then(userDoc=>{
    if(userDoc.length === 0){
      bcrypt.hash(req.body.password, 10, (err,hash)=>{
        if(err){
          return res.status(500).json({
            error:err
          })
        }else{
          const user = new User({
            _id:  new mongoose.Types.ObjectId(),
            email: req.body.email,
            password:hash
        });
        user.save()
        .then(result=>{
          console.log(result)
          res.status(201).json({
            message:'User created',
            user
          });
        })
        .catch(err=>{
          console.log(err);
          res.status(500).json({        error:err      })
        });
        };
      })
    }else{
      return res.status(409).json({
        message:'email was used'
      })
    }
  })


});

router.delete('/:userId',(req,res,net)=>{
  const id= req.params.userId;
  User.findByIdAndRemove(id).exec()
  .then(result=>{
    res.status(200).json({
      message:"user deleted"
    })
  })
  .catch(
    err=>{
      console.log(err);
      res.status(500).json({
        error:err
      });
    }
  );
});


module.exports = router;