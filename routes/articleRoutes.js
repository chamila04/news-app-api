const express = require('express');
const router = express.Router();
const {
  createArticle,
  getArticles,                     // Accepted articles (status "accept")
  getArticlesByTag,                // Accepted articles by tag
  getPendingArticles,              // All pending articles
  getAllArticlesByUsername,        // All articles by username (any status)
  getAcceptedArticlesByUsername,   // Accepted articles by username
  getPendingArticlesByUsername,    // Pending articles by username
  getRejectedArticlesByUsername,   // Rejected articles by username
  getArticlesByReporter,           // Accepted articles by reporter (username)
  getArticlesForEditor,
  updateArticleStatus,
  deleteArticle,
  updateArticle,
  searchArticles
} = require('../controllers/articleController');
const { isEditor } = require('../middleware/authMiddleware');

// Create a new article
router.post('/create', createArticle);

// (1) Get all accepted articles
router.get('/all', getArticles);

// (2) Get accepted articles by tag
router.get('/tag/:tag', getArticlesByTag);

// (3) Get all pending articles
router.get('/pending', getPendingArticles);

// (4) Get all articles by username (any status)
router.get('/user/:username', getAllArticlesByUsername);

// (5) Get accepted articles by username
router.get('/accepted/user/:username', getAcceptedArticlesByUsername);

// (6) Get pending articles by username
router.get('/pending/user/:username', getPendingArticlesByUsername);

// (7) Get rejected articles by username
router.get('/rejected/user/:username', getRejectedArticlesByUsername);

// This route already exists for reporters (accepted articles)
router.get('/reporter/:username', getArticlesByReporter);

// Editor route: Get all articles (with full status info)
router.get('/editor/all', getArticlesForEditor);

// Update article status and feedback
router.patch('/:id/status', updateArticleStatus);

// Delete an article by ID
router.delete('/:id', deleteArticle);

// Update an article by ID
router.put('/:id', updateArticle);

// Search accepted articles by query
router.get('/search/:query', searchArticles);

module.exports = router;
