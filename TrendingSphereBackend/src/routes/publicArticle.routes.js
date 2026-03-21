import express from "express";
import {
  getPublishedArticles,
  getArticleById,
    getArticleBySlug,
    getFeaturedArticles,
} from "../controllers/publicArticle.controller.js";

const router = express.Router();

// Public routes
router.get("/", getPublishedArticles);
router.get("/slug/:slug", getArticleBySlug);
router.get("/:id", getArticleById);
router.get("/featured", getFeaturedArticles);

export default router;

