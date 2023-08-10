const mongoose = require('mongoose')
const Order = require('../models/order')
const Place = require('../models/place')
const Location = require('../models/location');

exports.get_places = (req, res, next) => {    
    Place.find()
        .select('name url title created keywords region weather description location image created _id')
        .populate('location', 'longitude latitude')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                places: docs.map(doc => {
                    return {
                        // name: doc.name,
                        // title: doc.title,
                        // _id: doc._id,
                        // keywords: doc.keywords,
                        // location: doc.location,
                        // created: doc.created,
                        place: doc,
                        request:{
                            type: 'GET',
                            url: 'http://127.0.0.1:3000/places/' + doc.url
                        }
                    }
                })
            }
            // console.log(docs)
            res.status(200).json(response)
        }).catch(err => {
            console.log(err);
            res.status(500).json(err)
        })
}

exports.create_place = (req, res, next) => {
    // console.log(req.body)
    console.log(req.file)
    const location = new Location({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.location.name,
        longitude: req.body.location.longitude,
        latitude: req.body.location.latitude,
    })
    location.save()
    .then(result =>{
        console.log(result)
    }).catch(err => {
        console.log(err);
        res.status(500).json(err)
    })
    const place = new Place({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        title: req.body.title,
        keywords: req.body.keywords,
        image: req.file.path,
        // location: location
    })
    place
        .save()
        .then(result=>{
            console.log(result)
            res.status(201).json({
                message: "Place created successfully",
                createdPlace: {
                    name: result.name,
                    title: result.title,
                    _id: result._id,
                    location: result.location,
                    keywords: result.keywords,
                    response: {
                        type: 'POST',
                        url: 'http://127.0.0.1:3000/places/' + result._id
                    }
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err)
        })
    
}

exports.get_place_by_id = (req, res, next) => {
    const id = req.params.placeId;
    Place.findById(id)
        .select('name url location keywords region title image description _id')
        .populate('location', 'longitude latitude')
        .exec()
        .then(doc => { 
            console.log(doc);
            if (doc){
                res.status(200).json({
                    place: doc,
                    request:{
                        type: 'GET',
                        url: 'http://127.0.0.1:3000/places/'
                    }
                })
            }else{
                res.status(500).json({message: "No valid entry found for provided ID"})
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        }) 
}

exports.getPlaceByUrl = async (req, res) => {
    try {
      const url = req.params.placeId; // Assuming the URL parameter is named 'url'
    //   console.log(url)
      const doc = await Place.findOne({ url })
        .select('name url keywords location title image description _id')
        .populate('location', 'longitude latitude')
        .exec();
      if (doc) {
        res.status(200).json({
          place: doc,
          request: {
            type: 'GET',
            url: `http://127.0.0.1:3000/places/${url}`,
          },
        });
      } else {
        res.status(404).json({ message: "No valid entry found for provided URL" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
  
exports.edit_place = (req, res, next) => {
    const id = req.params.placeId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Place.updateOne({_id: id}, { $set: updateOps}).exec()
        .then(result => {
            console.log(result)
            res.status(200).json(result)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
}

exports.delete_place = (req, res, next) => {
    const id = req.params.placeId
    Place.deleteOne({ _id: id }) // Use deleteOne() to remove a single document
        .exec()
        .then(result => {
            if (result.deletedCount === 1) {
                res.status(200).json({ message: 'Place deleted successfully' });
            } else {
                res.status(404).json({ message: 'Place not found' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

}