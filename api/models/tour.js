const mongoose = require('mongoose');

const placeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true},
    url: { type: String, required: true},
    level: { type: String, required: true},
    title: { type: String, required: true},
    description: { type: String, required: true},
    created: { type: Date, default: Date.now },
    keywords: { type: String },
    viewCount: { type: Number, default: 0 },
    image: { type: [String], required: true}
});

module.exports = mongoose.model('Tour', placeSchema)