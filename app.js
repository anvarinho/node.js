const express = require("express");
// const session = require('express-session');
const app = express();
const morgan = require('morgan');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const placeRoutes = require('./api/routes/places');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');
const tourRoutes = require('./api/routes/tours');
const articleRoutes = require('./api/routes/articles')
const adminRoutes = require('./api/routes/admin')
const reviewRoutes = require('./api/routes/reviews')

// console.log(process.env.DB_PASSWORD)
mongoose.connect(`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=${process.env.DB_WITH_CREDENTIALS}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

mongoose.Promise = global.Promise;

app.use(morgan('dev'))
app.use('/uploads',express.static('uploads'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Session middleware setup
// app.use(session({
//   secret: 'your_secret_key_here',
//   resave: false,
//   saveUninitialized: false,
//   // Add more options as needed
// }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  if (req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    return res.status(200).json({});
  }
  next()
})

app.use('/api/places', placeRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/user', userRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/tours', tourRoutes)
app.use('/api/articles', articleRoutes)
app.use('/api/admin', adminRoutes)

app.use((req,res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
})

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  })
})

module.exports = app;