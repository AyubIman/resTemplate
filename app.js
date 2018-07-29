const express = require('express');
const app = express();

//routes
const productsRoute = require('./api/routes/products');
const ordersRoute = require('./api/routes/orders')

app.use('/products', productsRoute);
app.use('/orders', ordersRoute);

app.use('/', (req, res) => {
  res.status(200).json({
    message: 'handling all landing page'
  });
});

module.exports = app;
