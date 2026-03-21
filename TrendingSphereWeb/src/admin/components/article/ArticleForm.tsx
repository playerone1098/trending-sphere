import { useEffect, useState } from "react";
import ArticlePreview from "./ArticlePreview";

interface Article {
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
}

const DRAFT_KEY = "trendingsphere_article_draft";

const ArticleForm = () => {
  const [article, setArticle] = useState<Article>({
    title: "",
    summary: "",
    content: "",
    category: "",
    author: "",
  });

  // Load draft on first render
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      setArticle(JSON.parse(savedDraft));
    }
  }, []);

  // Save draft on every change
  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(article));
  }, [article]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setArticle((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setArticle({
      title: "",
      summary: "",
      content: "",
      category: "",
      author: "",
    });
  };
    
    const publishArticle = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/admin/articles",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...article,
          status: "published",
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to publish article");
    }

    const result = await response.json();
    console.log("Published:", result);

    alert("Article published successfully");

    // Clear draft after publish
    localStorage.removeItem(DRAFT_KEY);
    clearDraft();
  } catch (error) {
    console.error(error);
    alert("Error publishing article");
  }
};


  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "24px",
        marginTop: "16px",
      }}
    >
      {/* Form */}
      <div>
        <div>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={article.title}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Summary</label>
          <textarea
            name="summary"
            value={article.summary}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Content</label>
          <textarea
            name="content"
            rows={6}
            value={article.content}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Category</label>
          <input
            type="text"
            name="category"
            value={article.category}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Author</label>
          <input
            type="text"
            name="author"
            value={article.author}
            onChange={handleChange}
          />
        </div>

        <button
          onClick={clearDraft}
          style={{ marginTop: "12px", padding: "6px 12px" }}
        >
          Clear Draft
              </button>
              
              <button
  onClick={publishArticle}
  style={{
    marginTop: "12px",
    marginLeft: "8px",
    padding: "6px 12px",
    backgroundColor: "#0f172a",
    color: "#fff",
  }}
>
  Publish Article
</button>

              
      </div>

          
      {/* Live Preview */}
      <ArticlePreview article={article} />
    </div>
  );
};

export default ArticleForm;
