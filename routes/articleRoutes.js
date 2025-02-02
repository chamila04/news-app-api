const express = require('express');
const router = express.Router();
const { 
    createArticle, 
    getArticles, 
    getArticlesByTag,
    getArticlesForEditor,
    updateArticleStatus
  } = require('../controllers/articleController');
const { isEditor } = require('../middleware/authMiddleware');

//routes
router.post('/create', createArticle);
router.get('/all', getArticles);
router.get('/tag/:tag', getArticlesByTag);
router.get('/editor/all',  getArticlesForEditor);
router.patch('/:id/status', updateArticleStatus);

module.exports = router;