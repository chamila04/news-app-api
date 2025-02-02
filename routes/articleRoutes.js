const express = require('express');
const router = express.Router();
const { createArticle, getArticles } = require('../controllers/articleController');

router.post('/create', createArticle);
router.get('/all', getArticles);

module.exports = router;