import Article from "../models/Article.js";

const generateSlug = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

export const createArticle = async (req, res) => {
  try {
    const { title, summary, content, category, author, status, featured } = req.body;

    if (!title || !summary || !content || !category || !author) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const slug = generateSlug(title);

    const existing = await Article.findOne({ slug });
    if (existing) {
      return res.status(409).json({ message: "Article with similar title already exists" });
    }

    const article = await Article.create({
      title,
      slug,
      summary,
      content,
      category,
      author,
      status: status || "draft",
      featured: Boolean(featured),
    });

    res.status(201).json({ message: "Article created", data: article });
  } catch (error) {
    console.error("Create article error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllArticlesAdmin = async (req, res) => {
  try {
    const articles = await Article.find();

    res.json({
      count: articles.length,
      data: articles,
    });
  } catch (error) {
    console.error("Admin get articles error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, summary, content, category, author, status, featured } = req.body;

    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    let nextSlug = article.slug;
    if (title && title !== article.title) {
      const slug = generateSlug(title);
      const exists = await Article.findOne({ slug });
      if (exists && String(exists._id || exists.id) !== String(id)) {
        return res.status(409).json({
          message: "Another article with similar title exists",
        });
      }
      nextSlug = slug;
    }

    const updatedArticle = await Article.updateById(id, {
      title,
      slug: nextSlug,
      summary,
      content,
      category,
      author,
      status,
      featured,
    });

    res.json({
      message: "Article updated successfully",
      data: updatedArticle,
    });
  } catch (error) {
    console.error("Update article error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOneArticleAdmin = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Not found" });
    res.json({ data: article });
  } catch (error) {
    console.error("Get one article admin error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    await Article.findByIdAndDelete(id);

    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Delete article error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
