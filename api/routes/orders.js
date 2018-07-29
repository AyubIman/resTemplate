const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) =>{
  res.status(200).json({
    message: 'handling get requests for orders'
  });
});

router.post('/', (req, res, next) =>{
  res.status(200).json({
    message: 'handling post requests for orders'
  });
});

router.get('/:orderId', (req, res, next) =>{
  const id = req.params.orderId;
  if(id === 'special'){
    res.status(200).json({
      message: 'you found the daily special order',
      name: '3 Tacos',
      price: 12.10
    });
  }else{
    res.status(200).json({
      message: 'getting order with id = '+id,
      orderId: 'order number'+id,
      price: 11.00
    });
  }
});

router.delete('/:orderId', (req, res) =>{
  const id = req.params.orderId;
  res.status(200).json({
    message: 'orderId{'+id+'} is deleted',
    orderId: id
  });
});


module.exports = router;
