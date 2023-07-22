const mongoose = require('mongoose');

const placeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true},
    title: { type: String, required: true},
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    created: { type: Date, default: Date.now },
    keywords: { type: [String] },
    image: { type: String, required: true}
});

module.exports = mongoose.model('Place', placeSchema)
