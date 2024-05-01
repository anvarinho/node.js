const express = require('express');
const router = express.Router();

const TourController = require('../controllers/tour');

router.get('/', TourController.get_tours)

router.get('/:tourId', TourController.getTourByUrl)

module.exports = router;