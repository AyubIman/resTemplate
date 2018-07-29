const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

//import routes
const productsRoute = require('./api/routes/products');
const ordersRoute = require('./api/routes/orders')

//apply middleware to log api req/res
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// COURS
app.use((req, res, next) =>{
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
    return res.status(200).json({});
  }
  next();
});

// routes that handle rest requests
app.use('/products', productsRoute);
app.use('/orders', ordersRoute);

// app.use('/', (req, res, next) => {
//   res.status(200).json({
//     message: 'handling all landing page'
//   });
// });

app.use((req, res, next) =>{
  const error = new Error('Resource Not Found');
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) =>{
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
      code: error.status
    },
  });
});
module.exports = app;
