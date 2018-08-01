const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer'); //install it first
const storage = multer.diskStorage({
  destination: function(req, res, callback){

    callback(null,'./uploads');
  },
  filename: function(req, res, callback){
    callback(null, Date.toISOString()+file.originalname);
  }
});
const fileFilter = (req, res, callback) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    callback(null, false);
  }else{
    callback(new Error('message: can not save this file format'), true);
  }
}
const upload = multer({storage: storage, limits:{filesize: 1024 * 1024 * 5}, fileFilter: fileFilter});
const Product = require('../models/product');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

// get all products
router.get("/", (req, res, next) =>{
  Product.find()
    .select('name price _id productImage')
    .exec()
    .then(results =>{
      res.status(200).json({
        message: 'found all products successfully',
        count: result.length,
        products: results
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Error: Damn Server Broke... sorry ',
        error: error
      });
    });
});

// save a new product
router.post("/", checkAuth, upload.single('productImage'), (req, res, next) =>{
  const product = new Product({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });
// do validation
  product.save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'product saved successfully',
        newProduct: {
          _id: result._id,
          name: result.name,
          price: result.price,
          request: {
            type: 'GET',
            url: "http://localhost:3000/products/" + result._id
          }
        }
      });
    })
    .catch(error => {
      console.log(error)
    });
  res.status(200).json({
    message: 'saving a product',
    product: product
  });
});

//fetch a single product
router.get("/:productId", (req, res, next) =>{
  const id = req.params.productId;
  Product.findById(id)
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Product found',
        product: result
      });
    })
    .catch(error => {
      res.status(400).json({
        message: 'Cant find the product',
        error: error
      });
    });
});

// update an existing product
router.patch("/:productId", checkAuth, (req, res, next) => {
  const id = req.params.productId;
  const updateOptions = {};
  for(const ops of req.body){
    updateOptions[ops.propName] = ops.value;
  }
  Product.update({_id: id}, { $set: updateOptions})
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'updated product successfully',
        result: result
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'can \'t updat product ... sorry',
        error: error
      });
    });
});

// delete a product
router.delete("/:productId", checkAuth, (req, res) =>{
  const id = req.params.productId;
  Product.remove({_id: id})
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'removed product',
        result: result
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'cant delete product',
        error: error
      });
    });
});

module.exports = router;
