const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) =>{
  res.status(200).json({
    message: 'handling get requests for products'
  });
});

router.post('/', (req, res, next) =>{
  res.status(200).json({
    message: 'handling post requests for products'
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


module.exports = router;
