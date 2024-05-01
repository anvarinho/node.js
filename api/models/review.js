const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    avatar: { type: String },
    review: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 }
});

module.exports = mongoose.model('Review', reviewSchema);