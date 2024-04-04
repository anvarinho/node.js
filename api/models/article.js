const mongoose = require('mongoose')

const translationSchema = mongoose.Schema({
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
}, { _id: false });

const articleSchema = new mongoose.Schema({
  title: { type: translationSchema, required: true },
  subtitle: { type: translationSchema, required: true },
  image: { type: String },
  paragraphs: [
    {
      title: { type: translationSchema, required: true },
      text: { type: translationSchema, required: true },
      image: {
        type: String
      },
      link: {
        type: String
      }
    }
  ],
  keywords: { type: translationSchema, required: true },
  author: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  url: {
    type: String,
    required: true
  },
  viewCount: { type: Number, default: 0 },
});

// Add index for title field
articleSchema.index({ title: 1 });

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;