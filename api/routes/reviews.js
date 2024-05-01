const express = require('express');
const router = express.Router();

const ReviewsController = require('../controllers/reviews');

router.get('/', ReviewsController.get_reviews)

module.exports = router