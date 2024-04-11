const mongoose = require('mongoose')
const Tour = require('../models/tour')
const writeStats = require('../middleware/stats');

//     Tour.find()
//     .select('url title level price images days description _id')
//     // .populate('place', 'name')
//     .exec()

exports.get_tours = (req, res, next) => {
  let { lang = "en" } = req.query;
  
  writeStats(req, res);
  
  Tour.aggregate([
    {
      $project: {
        _id: 1,
        url: 1,
        title: `$title.${lang}`,
        images: 1,
        description: `$description.${lang}`,
        lastPrice: { $arrayElemAt: ["$price", -1] },
        daysCount: { $size: "$days" }  // Calculate the size of the "days" array
      }
    }
  ]).exec()
    .then(docs => {
      res.status(200).json(docs);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.getTourByUrl = async (req, res) => {
    try {
      writeStats(req, res)
      const url = req.params.tourId; // Assuming the URL parameter is named 'placeId'
      let { lang = "en" } = req.query;
      const doc = await Tour.findOneAndUpdate(
        { url }, // Filter by URL
        { $inc: { viewCount: 1 } }, // Increment the viewCount field by 1
        { new: true } // Return the updated document
      )
        // .select(`url keywords description level price images created days description viewCount includings excludings`)
        .exec();
  
      if (doc) {

        const days = doc.days.map(day => ({
          activities: day.activities[lang],
          images: day.images,
          places: day.places
        }));

        res.status(200).json({
          _id: doc._id,
          url: doc.url,
          level: doc.level,
          price: doc.price,
          viewCount: doc.viewCount,
          title: doc.title[lang],
          description: doc.description[lang],
          images: doc.images,
          created: doc.created,
          days: days,
          includings: doc.includings[lang],
          excludings: doc.excludings[lang]
        });
        
      } else {
        res.status(404).json({ message: "No valid entry found for provided URL" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
};