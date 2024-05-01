// const Place = require("../models/place");
const Review = require("../models/review")


exports.get_reviews = (req, res, next) => {
    Review.find()
    .exec()
    .then(docs => {
        res.status(200).json(docs)
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err 
        })
    })
};