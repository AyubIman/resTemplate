const express = require('express');
const app = express();

//routes
const productRoute = require('./api/routes/products');

app.use('/products', productRoute);
app.use('/', (req, res) => {
  res.status(200).json({
    message: 'handling all landing page'
  });
});

module.exports = app;
