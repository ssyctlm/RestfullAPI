const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); //to encrypt user password

const User = require('../models/user');
// const user = require('../models/user');

const jwt = require('jsonwebtoken');


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

router.post('/login',(req,res,next)=>{
  User.find({email:req.body.email}).exec()
      .then(users=>{
        if(users.length<1){
          return res.status(401).json({
            msg: 'Auth failed- not exist'
          })
        };
        bcrypt.compare(req.body.password, users[0].password,(err,result)=>{
          if(err){
            return res.status(401).json({
              msg: 'Auth failed-err'
            })
          };
          const token = jwt.sign({
            email:users[0].email,
            userId:users[0]._id
          },
          'secret',
          {
            expiresIn: '1h'
          }
          )
          if(result){
            return res.status(200).json({
              msg:'Auth successful',
              token
            })
          };
          res.status(401).json({
            msg: 'Auth failed-psw-err'
          });
        })
      })
      .catch(err=>{
        console.log(err);
        res.status(500).json({        error:err      })
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