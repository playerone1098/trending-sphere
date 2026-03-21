import express from "express";
import {
  createArticle,
    getAllArticlesAdmin,
    updateArticle,
    getOneArticleAdmin
} from "../controllers/article.controller.js";
import adminAuth from "../middleware/adminAuth.middleware.js";
import { deleteArticle } from "../controllers/article.controller.js";

const router = express.Router();

// Admin routes (protected)
router.post("/", adminAuth, createArticle);
router.get("/", adminAuth, getAllArticlesAdmin);
router.put("/:id", adminAuth, updateArticle);
router.get("/:id", adminAuth, getOneArticleAdmin);
router.delete("/:id", adminAuth, deleteArticle);



export default router;
