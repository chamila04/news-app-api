const Article = require("../models/Article");
const User = require("../models/User");

const createArticle = async (req, res, next) => {
  try {
    const { username, title, tags, img, article } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newArticle = new Article({
      username,
      title,
      tags,
      img,
      article,
      status: "pending",
    });

    const savedArticle = await newArticle.save();

    res.status(201).json({
      message: "Article created successfully",
      article: savedArticle,
    });
  } catch (error) {
    next(error);
  }
};

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

// Get all articles with status info (editor only)
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

    // Keep status validation
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

module.exports = {
  createArticle,
  getArticles,
  getArticlesByTag,
  getArticlesForEditor,
  updateArticleStatus,
};
