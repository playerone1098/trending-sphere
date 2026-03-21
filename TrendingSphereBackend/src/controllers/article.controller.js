import Article from "../models/Article.js";

const generateSlug = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");


    
export const createArticle = async (req, res) => {
  try {
    const { title, summary, content, category, author, status } = req.body;

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
    });

    res.status(201).json({ message: "Article created", data: article });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllArticlesAdmin = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });

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
    const { title, summary, content, category, author, status } = req.body;

    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // If title changes, update slug
    if (title && title !== article.title) {
      const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

      const exists = await Article.findOne({ slug });
      if (exists && exists._id.toString() !== id) {
        return res.status(409).json({
          message: "Another article with similar title exists",
        });
      }

      article.slug = slug;
    }

    article.title = title;
    article.summary = summary;
    article.content = content;
    article.category = category;
    article.author = author;
    article.status = status;

    await article.save();

    res.json({
      message: "Article updated successfully",
      data: article,
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
  } catch {
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

