interface Article {
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
}

interface ArticlePreviewProps {
  article: Article;
}

const ArticlePreview = ({ article }: ArticlePreviewProps) => {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "16px",
        borderRadius: "8px",
        boxShadow: "0 0 4px rgba(0,0,0,0.1)",
      }}
    >
      <h2>{article.title || "Article Title"}</h2>

      <p style={{ color: "#475569", fontSize: "14px" }}>
        {article.category && <strong>{article.category}</strong>}{" "}
        {article.author && <>• By {article.author}</>}
      </p>

      <p style={{ marginTop: "12px", fontStyle: "italic" }}>
        {article.summary || "Article summary will appear here."}
      </p>

      <hr style={{ margin: "16px 0" }} />

      <p style={{ whiteSpace: "pre-wrap" }}>
        {article.content || "Article content will appear here."}
      </p>
    </div>
  );
};

export default ArticlePreview;
