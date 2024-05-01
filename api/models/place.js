const mongoose = require("mongoose");

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

const placeSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: translationSchema, required: true },
  title: { type: translationSchema, required: true },
  description: { type: translationSchema, required: true },
  region: { type: translationSchema, required: true },
  keywords: { type: translationSchema },
  url: { type: String, required: true },
  location: {
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
  },
  created: { type: Date, default: Date.now },
  images: { type: [String], required: true },
  sights: { type: [String], required: false },
  viewCount: { type: Number, default: 0 },
  weather: {
    temp: { type: String },
    main: { type: String },
    description: { type: String },
    icon: { type: String },
    updated: { type: Date, default: Date.now },
  },
});

module.exports = mongoose.model("Place", placeSchema);
