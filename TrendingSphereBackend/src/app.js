import express from "express";
import cors from "cors";
import articleRoutes from "./routes/article.routes.js";
import publicArticleRoutes from "./routes/publicArticle.routes.js";
import adminAuthRoutes from "./routes/adminAuth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "TrendingSphere backend running" });
});

app.use("/api/admin/articles", articleRoutes);


// Public article routes
app.use("/api/articles", publicArticleRoutes);



app.use("/api/admin/auth", adminAuthRoutes);


export default app;
