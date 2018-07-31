const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt'); // install it first
const jwt = require('jsonwebtoken'); // install it first
const router = express.Router();

router.post('/signup', (req, res, next) =>{
  User.find({email: req.body.email})
    .exec()
    .then(user => {
      if(user.length >=1){
        return res.status(409).json({
          message: 'email exist'
        })
      }else{
        bcrypt.hash(req.body.password, 10, (error, hash) => {
          if(error){
            return res.status(500).json({
              error: error
            });
          }else{
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user.save()
              .exec()
              .then(user => {
                res.status(201).json(user);
              })
              .catch(error => {
                res.status(500).json(error);
              });
          }
        });
      }
    })

});

router.post('/signin', (req, res, next) => {
  User.find({email: req.body.email})
    .exec()
    .then(user => {
      if(user.length < 1){
        return res.status(401).json({
          message:'Auth Failed'
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (error, result) => {
        if(error){
          return res.status(401).json({
            message:'Auth Failed'
          });
        }
        if(result){
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            "process.env.JWT_KEY",
            {
              expiresIn: "1h"
            });
          return res.status(200).json({
            message:'Auth Successful',
            token: token
          });
        }
        res.status(401).json({
          message:'Auth Failed'
        });
      });
    })
    .catch(error => {});
});

router.delete('/:userId', (req, res, next) =>{
  const id = req.params.userId;
  User.remove({_id: id})
    .exec()
    .then(result => {
      console.log("user deleted");
      result.status(200).json({
        message: 'user deleted successfully'
      })
    })
    .catch(error => {
      console.log("Error can't delete user");
      res.status(500).json({
        message: 'can \'t delete user',
        error: error
      });
    });
});

module.exports = router;
