const express = require('express');
const router = express.Router();

const ArticleController = require('../controllers/articles');

router.get('/', ArticleController.get_articles)
router.get('/:articleUrl', ArticleController.get_article_by_url)

module.exports = router;