const mongoose = require('mongoose')
const Tour = require('../models/tour')

exports.get_tours = (req, res, next) => {
    Tour.find()
    .select('name url title level keywords image description _id')
    // .populate('place', 'name')
    .exec()
    .then(docs => {
        res.status(200).json(docs)
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err 
        })
    })
}

exports.getTourByUrl = async (req, res) => {
    try {
      const url = req.params.tourId; // Assuming the URL parameter is named 'placeId'

      const doc = await Tour.findOneAndUpdate(
        { url }, // Filter by URL
        { $inc: { viewCount: 1 } }, // Increment the viewCount field by 1
        { new: true } // Return the updated document
      )
        .select('name url keywords title image created description viewCount')
        .exec();
  
      if (doc) {
        res.status(200).json({
          tour: doc,
          request: {
            type: 'GET',
            url: `http://127.0.0.1:3000/tours/${url}`,
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