const express = require('express');
const app = express();

//routes
const productRoute = require('./api/routes/products');

app.use('/products', productRoute);
app.use('/')

module.exports = app;
