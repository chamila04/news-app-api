const Article = require("../models/Article");
const User = require("../models/User");

// Create a new article with improved error handling
const createArticle = async (req, res, next) => {
  try {
    const { username, title, tags, img, article } = req.body;

    console.log("Received username:", username);

    // Validate required fields
    if (!username || !title || !img || !article) {
      return res.status(400).json({ 
        error: "Username, title, img, and article content are required." 
      });
    }

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create the new article. Ensure tags is an array.
    const newArticle = new Article({
      username,
      title,
      tags: Array.isArray(tags) ? tags : [],
      img,
      article,
      status: "pending", // New articles start as pending
    });

    const savedArticle = await newArticle.save();

    res.status(201).json({
      message: "Article created successfully",
      article: savedArticle,
    });
  } catch (error) {
    console.error("Error creating article:", error);

    // If it's a Mongoose validation error, respond with 400 and the error message
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }

    // Pass any other errors to the global error handler
    next(error);
  }
};

// 1. Get all accepted articles
const getArticles = async (req, res, next) => {
  try {
    const articles = await Article.find({ status: "accept" }).select("-__v");
    res.json({
      count: articles.length,
      articles,
    });
  } catch (error) {
    next(error);
  }
};

// 2. Get accepted articles by tag
const getArticlesByTag = async (req, res, next) => {
  try {
    const tag = req.params.tag;
    const articles = await Article.find({
      tags: tag,
      status: "accept",
    }).select("title username tags img article createdAt -_id");

    if (articles.length === 0) {
      return res.status(404).json({
        message: "No accepted articles found with this tag",
      });
    }

    res.json({
      count: articles.length,
      articles,
    });
  } catch (error) {
    next(error);
  }
};

// 3. Get all pending articles
const getPendingArticles = async (req, res, next) => {
  try {
    const articles = await Article.find({ status: "pending" }).select("-__v");
    res.json({
      count: articles.length,
      articles,
    });
  } catch (error) {
    next(error);
  }
};

// 4. Get all articles by username (any status)
const getAllArticlesByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const articles = await Article.find({ username }).select("-__v");
    if (articles.length === 0) {
      return res.status(404).json({ message: "No articles found for this user" });
    }
    res.json({
      count: articles.length,
      articles,
    });
  } catch (error) {
    next(error);
  }
};

// 5. Get accepted articles by username
const getAcceptedArticlesByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const articles = await Article.find({ username, status: "accept" }).select("-__v");
    if (articles.length === 0) {
      return res.status(404).json({ message: "No accepted articles found for this user" });
    }
    res.json({
      count: articles.length,
      articles,
    });
  } catch (error) {
    next(error);
  }
};

// 6. Get pending articles by username
const getPendingArticlesByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const articles = await Article.find({ username, status: "pending" }).select("-__v");
    if (articles.length === 0) {
      return res.status(404).json({ message: "No pending articles found for this user" });
    }
    res.json({
      count: articles.length,
      articles,
    });
  } catch (error) {
    next(error);
  }
};

// 7. Get rejected articles by username
const getRejectedArticlesByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const articles = await Article.find({ username, status: "reject" }).select("-__v");
    if (articles.length === 0) {
      return res.status(404).json({ message: "No rejected articles found for this user" });
    }
    res.json({
      count: articles.length,
      articles,
    });
  } catch (error) {
    next(error);
  }
};

// This function already existed to get accepted articles for reporters
const getArticlesByReporter = async (req, res, next) => {
  try {
    const { username } = req.params;
    const articles = await Article.find({ username, status: "accept" }).select("title username tags img article createdAt -_id");
    if (articles.length === 0) {
      return res.status(404).json({
        message: "No accepted articles found for this reporter",
      });
    }
    res.json({
      count: articles.length,
      articles,
    });
  } catch (error) {
    next(error);
  }
};

// Editor-only: Get all articles with full status information
const getArticlesForEditor = async (req, res, next) => {
  try {
    const articles = await Article.find()
      .select("title username tags img article status feedback createdAt")
      .sort({ createdAt: -1 });
    res.json({
      count: articles.length,
      articles,
    });
  } catch (error) {
    next(error);
  }
};

// Update article status and feedback
const updateArticleStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, feedback } = req.body;

    // Validate status
    if (!["accept", "reject", "pending"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { status, feedback: feedback || "" },
      { new: true, runValidators: true }
    ).select("title status feedback");

    if (!updatedArticle) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.json({
      message: "Article status updated successfully",
      article: updatedArticle,
    });
  } catch (error) {
    next(error);
  }
};

// Delete an article by ID
const deleteArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedArticle = await Article.findByIdAndDelete(id);
    if (!deletedArticle) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.json({
      message: "Article deleted successfully",
      article: deletedArticle
    });
  } catch (error) {
    next(error);
  }
};

// Update an article by ID
const updateArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    // The updateData can include title, tags, img, article content, etc.
    const updateData = req.body;

    const updatedArticle = await Article.findByIdAndUpdate(id, updateData, {
      new: true,          // Return the updated document
      runValidators: true // Ensure the update respects schema validation
    });
    if (!updatedArticle) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.json({
      message: "Article updated successfully",
      article: updatedArticle
    });
  } catch (error) {
    next(error);
  }
};


// search accepted articles
const searchArticles = async (req, res, next) => {
  try {
    const query = req.params.query;

    // Search for articles with status "accept" that match the query in title, article content, or tags.
    const articles = await Article.find({
      status: "accept",
      $or: [
        { title: { $regex: query, $options: "i" } },
        { article: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } }
      ]
    }).select("title username tags img article createdAt -_id");

    if (!articles || articles.length === 0) {
      return res.status(404).json({
        message: "No accepted articles found for the given search query."
      });
    }

    res.json({
      count: articles.length,
      articles
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createArticle,
  getArticles,                     // (1) All accepted articles
  getArticlesByTag,                // (2) Accepted articles by tag
  getPendingArticles,              // (3) All pending articles
  getAllArticlesByUsername,        // (4) All articles by username
  getAcceptedArticlesByUsername,   // (5) Accepted articles by username
  getPendingArticlesByUsername,    // (6) Pending articles by username
  getRejectedArticlesByUsername,   // (7) Rejected articles by username
  getArticlesByReporter,           // Already exists: accepted articles by reporter
  getArticlesForEditor,
  updateArticleStatus,
  deleteArticle,
  updateArticle,
  searchArticles
};
