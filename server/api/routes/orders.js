const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();


// get all the orders
router.get("/", checkAuth, (req, res, next) =>{
  Order.find()
    .select('product quantity _id')
    .populate('product', 'name price quantity')
    .exec()
    .then(orders => {
      console.log("orders: ", orders);
      res.status(200).json({
        count: orders.length,
        orders: orders.map(order => {
          return {
            _id: order._id,
            product: order.product,
            quantity: order.quantity,
            request: {
              type: 'GET',
              url: "http://localhost:3000/orders/" + order._id
            }
          }
        })
        });
    })
    .catch(error => {
      console.log("error: ", error);
      res.status(500).json(error);
    });
});

// save a single order
router.post("/", checkAuth, (req, res, next) =>{
  Product.findById(req.body.productId)
    .then(product => {
      if(!product){
        return res.status(401).json({
          message: 'Product not found'
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: product._id
      });
      return order.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'order saved successfully',
        createdOrder: {
            _id: result._id,
            quantity: result.quantity,
            product: result.product,
            request: {
              type: 'GET',
              url: "http://localhost:3000/orders/" + result._id
            }
          }
        });
      })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Can\'t save anything sorry',
        error: error
      });
    });
});

// get a single order
router.get("/:orderId", checkAuth, (req, res, next) =>{
  const id = req.params.orderId;
  Order.findById(id)
    .populate('product')
    .exec()
    .then(order => {
      if(!order){
        return res.status(404).json({
          message: 'order not found'
        });
      }
      res.status(200).json({
        _id: order._id,
        product: order.product,
        quantity: order.quantity,
        request: {
          type: 'GET',
          url: "http://localhost:3000/orders/" + order._id
        }
      });
    })
    .catch(error =>{
      res.status(401).json({
        message: 'can\'t find order',
        error: error
      });
    });
});

router.delete("/:orderId", checkAuth, (req, res, next) =>{
  const id = req.params.orderId;
  Order.remove({_id: id})
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'order deleted successfully'
      });
    })
    .catch(error => {
      res.status(500).json({
        error: error
      });
    });
  res.status(200).json({
    message: 'orderId{'+id+'} is deleted',
    orderId: id
  });
});


module.exports = router;
