import express from "express";
import {
  getPublishedArticles,
  getArticleById,
  getArticleBySlug,
  getFeaturedArticles,
} from "../controllers/publicArticle.controller.js";

const router = express.Router();

// Public routes - specific routes first
router.get("/featured", getFeaturedArticles);
router.get("/slug/:slug", getArticleBySlug);
router.get("/:id", getArticleById);
router.get("/", getPublishedArticles);

export default router;
