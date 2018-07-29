const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) =>{
  res.status(200).json({
    message: 'handling get requests for products'
  });
});

router.post('/', (req, res, next) =>{
  const product = {
    name: req.body.name,
    price: req.body.price
  };
  res.status(200).json({
    message: 'saving a product',
    product: product
  });
});

router.get('/:productId', (req, res, next) =>{
  const id = req.params.productId;
  if(id === 'special'){
    res.status(200).json({
      message: 'you found the daily special',
      name: 'Taco',
      price: 12.10
    });
  }else{
    res.status(200).json({
      message: 'getting item with id = '+id,
      name: 'item name',
      price: 1.00
    });
  }
});

router.delete('/:produId', (req, res) =>{
  const id = req.params.productId;
  res.status(200).json({
    message: 'productId{'+id+'} is deleted',
    orderId: id
  });
});

module.exports = router;
