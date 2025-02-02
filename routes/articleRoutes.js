const express = require('express');
const router = express.Router();
const { 
    createArticle, 
    getArticles, 
    getArticlesByTag // Add this import
  } = require('../controllers/articleController');

router.post('/create', createArticle);
router.get('/all', getArticles);
router.get('/tag/:tag', getArticlesByTag);

module.exports = router;