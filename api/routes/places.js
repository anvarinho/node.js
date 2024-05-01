const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth')

const PlacesController = require('../controllers/places');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/')
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true)
    }else{
        cb(null, false)
    }
}

const upload = multer({
    storage: storage, 
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: fileFilter
});

// const Place = require('../models/place');
// const Location = require('../models/location');

router.get('/', PlacesController.get_places)
router.get('/more', PlacesController.get_more_places)
router.get('/home', PlacesController.get_places_by_urls)
router.get('/ios', PlacesController.get_places_ios)
router.get('/region', PlacesController.get_places_by_region)

router.post('/', checkAuth, upload.single('placeImage'), PlacesController.create_place)

// router.get('/:placeId', PlacesController.get_place_by_id)

router.get('/:placeId', PlacesController.getPlaceByUrl)

router.patch('/:placeId', checkAuth, PlacesController.edit_place)

router.delete('/:placeId', checkAuth, PlacesController.delete_place)

module.exports = router;