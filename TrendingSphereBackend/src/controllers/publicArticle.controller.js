import Article from "../models/Article.js";

// GET all published articles
export const getPublishedArticles = async (req, res) => {
  try {
    const articles = await Article.find({ status: "published" })
      .sort({ createdAt: -1 });

    res.json({
      count: articles.length,
      data: articles,
    });
  } catch (error) {
    console.error("Get Articles Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// GET single published article by ID
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findOne({
      _id: req.params.id,
      status: "published",
    });

    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    res.json(article);
  } catch (error) {
    console.error("Get Article Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({
      slug: req.params.slug,
      status: "published",
    });

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json(article);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getFeaturedArticles = async (req, res) => {
  try {
    const articles = await Article.find({
      status: "published",
      featured: true,
    }).sort({ createdAt: -1 });

    res.json({ count: articles.length, data: articles });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

