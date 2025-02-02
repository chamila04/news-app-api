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

module.exports = { createArticle, getArticles, getArticlesByTag };
