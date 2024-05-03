const mongoose = require("mongoose");
// const Order = require("../models/order");
const Place = require("../models/place");
const Location = require("../models/location");
const writeStats = require('../middleware/stats');

exports.get_places = (req, res, next) => {
  let { lang = "en" } = req.query;
  writeStats(req, res)

  const { offset = 0, limit = 12 } = req.query;

  Place.find()
    .skip(Number(offset))
    .limit(Number(limit))
    // .select("url region weather image created title name _id")
    // .populate('location', 'longitude latitude')
    .exec()
    .then((docs) => {
      const places = docs.map((doc) => {
        console.log(doc.weather)
        const place = {
          url: doc.url,
          name: doc.name[lang],
          title: doc.title[lang],
          _id: doc._id,
          keywords: doc.keywords[lang],
          images: doc.images,
          region: doc.region[lang],
          location: doc.location,
          weather: doc.weather
        };
        if (doc.weather && !doc.weather.temp) {
          delete place.weather;
        }
        return place;
      });
      res.status(200).json(places);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};

exports.get_more_places = (req, res, next) => {
  let { lang = "en", offset = 0, limit = 12 } = req.query;
  lang = lang.toLowerCase();
  Place.find()
    .skip(Number(offset))
    .limit(Number(limit))
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        places: docs.map((doc) => {
          return {
            name: doc.name[lang],
            title: doc.title[lang],
            region: doc.region[lang],
            images: doc.images,
            created: doc.created,
            url: doc.url,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://127.0.0.1:3000/places/" + doc.url,
            },
          };
        }),
      };
      // console.log(response)
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};

exports.create_place = (req, res, next) => {
  // console.log(req.body)
  console.log(req.file);
  const location = new Location({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.location.name,
    longitude: req.body.location.longitude,
    latitude: req.body.location.latitude,
  });
  location
    .save()
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  const place = new Place({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    title: req.body.title,
    keywords: req.body.keywords,
    images: req.file.path,
    // location: location
  });
  place
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Place created successfully",
        createdPlace: {
          name: result.name,
          title: result.title,
          _id: result._id,
          location: result.location,
          keywords: result.keywords,
          response: {
            type: "POST",
            url: "http://127.0.0.1:3000/places/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};

exports.get_place_by_id = (req, res, next) => {
  const id = req.params.placeId;
  Place.findById(id)
    .select("name url location keywords region title image description _id")
    .populate("location", "longitude latitude")
    .exec()
    .then((doc) => {
      // console.log(doc);
      if (doc) {
        res.status(200).json({
          place: doc,
          request: {
            type: "GET",
            url: "http://127.0.0.1:3000/places/",
          },
        });
      } else {
        res
          .status(500)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};

exports.getPlaceByUrl = async (req, res) => {
  let { lang = "en" } = req.query;
  try {
    writeStats(req, res)
    const url = req.params.placeId; // Assuming the URL parameter is named 'placeId'
    const doc = await Place.findOneAndUpdate(
      { url }, // Filter by URL
      { $inc: { viewCount: 0.5 } }, // Increment the viewCount field by 1
      { new: true } // Return the updated document
      
    )
      // .select( "name url viewCount keywords location weather sights created title image description _id viewCount") // Include the viewCount field
      // .populate("location", "longitude latitude")
      .exec();
    // console.log(doc.viewCount)
    if (doc) {
      res.status(200).json({
        url: doc.url,
        name: doc.name[lang],
        title: doc.title[lang],
        description: doc.description[lang],
        _id: doc._id,
        keywords: doc.keywords[lang],
        sights: doc.sights,
        images: doc.images,
        region: doc.region[lang],
        viewCount: doc.viewCount,
        location: doc.location,
        created: doc.created,
        videoID:doc.videoID,
        // place: doc,
        request: {
          type: "GET",
          url: `http://127.0.0.1:3000/${lang}/places/${url}`,
        },
      });
    } else {
      res
        .status(404)
        .json({ message: "No valid entry found for provided URL" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.edit_place = (req, res, next) => {
  const id = req.params.placeId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Place.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};

exports.delete_place = (req, res, next) => {
  const id = req.params.placeId;
  Place.deleteOne({ _id: id }) // Use deleteOne() to remove a single document
    .exec()
    .then((result) => {
      if (result.deletedCount === 1) {
        res.status(200).json({ message: "Place deleted successfully" });
      } else {
        res.status(404).json({ message: "Place not found" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
exports.get_places_by_urls = (req, res, next) => {
  // Convert comma-separated string to an array of URLs
  let { lang = "en",
   urls = 'ala-kol-lake,ysyk-kol-lake,son-kol-lake,skazka-canyons,bishkek-city,sary-chelek-biosphere-reserve,ala-archa-national-park,jeti-oguz-canyons,altyn-arashan-valley,burana-tower,alay-valley,chunkurchak-gorge,tash-rabat-caravanserai,chon-ak-suu-gorge'
  } = req.query;

  writeStats(req, res)
  Place.find({ url: { $in: urls.split(",") } })
    .exec()
    .then((docs) => {
      const places = docs.map((doc) => ({
        url: doc.url,
        name: doc.name[lang],
        title: doc.title[lang],
        description: doc.description[lang].substring(0,300),
        _id: doc._id,
        images: doc.images,
        region: doc.region[lang],
      }));
      res.status(200).json(places);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};



exports.get_places_ios = (req, res, next) => {
  let { lang = "en" } = req.query;
  writeStats(req, res);
  Place.find()
    .exec()
    .then((docs) => {
      const places = docs.map((doc) => ({
        url: doc.url,
        name: doc.name[lang],
        title: doc.title[lang],
        description: doc.description[lang],
        id: doc._id,
        images: doc.images,
        region: doc.region[lang],
        location: doc.location
      }));
      res.status(200).json(places);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};

exports.get_places_by_region = (req, res, next) => {
  let { lang = "en", region = "Osh Region", url = "" } = req.query;
  writeStats(req, res);
  Place.aggregate([
    { $match: { 
      [`region.${lang}`]: region,
      url: { $ne: url }
    } }, // Filter by region and exclude documents with the specified URL
    { $sample: { size: 6 } } // Randomly select 6 documents
  ])
    .exec()
    .then((docs) => {
      const places = docs.map((doc) => ({
        url: doc.url,
        name: doc.name[lang],
        title: doc.title[lang],
        id: doc._id,
        images: doc.images,
        region: doc.region[lang],
        created: doc.created,
        location: doc.location
      }));
      res.status(200).json(places);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};