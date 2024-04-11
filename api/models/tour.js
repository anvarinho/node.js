const mongoose = require('mongoose');

const translationSchema = mongoose.Schema(
  {
    en: { type: String },
    fr: { type: String },
    es: { type: String },
    de: { type: String },
    ru: { type: String },
    ae: { type: String },
    jp: { type: String },
    kr: { type: String },
    cn: { type: String },
    it: { type: String },
  },
  { _id: false }
);

const translationsSchema = mongoose.Schema(
  {
    en: { type: [String] },
    fr: { type: [String] },
    es: { type: [String] },
    de: { type: [String] },
    ru: { type: [String] },
    ae: { type: [String] },
    jp: { type: [String] },
    kr: { type: [String] },
    cn: { type: [String] },
    it: { type: [String] },
  },
  { _id: false }
);

const placeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    url: { type: String, required: true},
    title: { type: translationSchema, required: true },
    level: { type: String, required: true},
    description: { type: translationSchema, required: true },
    created: { type: Date, default: Date.now },
    keywords: { type: translationSchema },
    viewCount: { type: Number, default: 0 },
    images: { type: [String], required: true},
    price: { type: [Number], required: true},
    includings: { type: translationsSchema, required: true },
    excludings: { type: translationsSchema, required: true },
    days: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      activities: { type: translationsSchema, required: true },
      images: { type: [String] },
      places: { type: [String] }
    }
  ],
});

module.exports = mongoose.model('Tour', placeSchema)  