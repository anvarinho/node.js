const mongoose = require('mongoose')
const Article = require('../models/article')
const writeStats = require('../middleware/stats');

exports.get_articles = (req, res, next) => {
    let { lang = "en" } = req.query;
    writeStats(req, res)
    const formattedDate = {
      $dateToString: {
        format: "%Y.%m.%d %H:%M", // Customize this format as needed
        date: "$createdAt",
      }
    };
    Article.aggregate([
        {
            $project: {
                _id: 1,
                title: `$title.${lang}`,
                subtitle: `$subtitle.${lang}`,
                url: 1,
                image: {
                  $cond: { // Conditional expression for image
                    if: { $eq: ["$image", null] }, // Check if "image" field is null
                    then: { $ifNull: ["$paragraphs.0.image", null] }, // If null, use first paragraph image (or null if empty)
                    else: "$image" // Otherwise, use the original "image" field
                  }
                },
                createdAt: formattedDate,
                viewCount: 1,
                paragraphs: [{ image: { $arrayElemAt: ["$paragraphs.image", 0] }}]
            }
        },
        {
            $sort: { createdAt: -1 }
        }
    ])
    .exec()
    .then(docs => {
      const articles = docs.map((doc) => ({
        ...doc,
        image: doc.image ? doc.image : doc.paragraphs[0].image,
        paragraphs: undefined
      }));
    res.status(200).json(articles)

    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err 
        })
    })
}

exports.get_article_by_url = (req, res, next) => {
    let { lang = "en" } = req.query;
    writeStats(req, res)
    const url = req.params.articleUrl; // Assuming URL is passed as a parameter in the route
    
    Article.findOneAndUpdate(
      { url },
      { $inc: { viewCount: 1 } },
      { new: true } // To return the updated document
    )
      .exec()
      .then(article => {
        if (!article) {
          return res.status(404).json({
            message: "Article not found with the provided URL."
          });
        }
        let translatedParagraphs = article.paragraphs.map(paragraph => {
          return {
            id: paragraph._id,
            title: paragraph.title[lang],
            text: paragraph.text[lang],
            image: paragraph.image,
            link: paragraph.link
          };
        });
        res.status(200).json({
          title: article.title[lang],
          subtitle: article.subtitle[lang],
          paragraphs: translatedParagraphs,
          image: article.image,
          keywords: article.keywords[lang],
          url:article.url
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  };
  
