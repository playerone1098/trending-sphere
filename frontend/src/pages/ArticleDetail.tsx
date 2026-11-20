import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

interface Article {
  _id?: string;
  id?: number | string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  createdAt: string;
}

const ArticleDetail = () => {

    
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  fetch(`http://localhost:5000/api/articles/slug/${slug}`)
    .then((res) => res.json())
    .then((data) => {
      setArticle(data);
      setLoading(false);
    })
    .catch(() => setLoading(false));
}, [slug]);

  if (loading) return <p>Loading article...</p>;
  if (!article) return <p>Article not found</p>;

    return (
      <>
        <Helmet>
  <title>{article.title} | TrendingSphere News</title>

  <meta name="description" content={article.summary} />

  {/* Open Graph */}
  <meta property="og:title" content={article.title} />
  <meta property="og:description" content={article.summary} />
  <meta property="og:type" content="article" />
  <meta
    property="og:url"
    content={`http://localhost:5174/news/${article.slug}`}
  />

  {/* Twitter */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={article.title} />
  <meta name="twitter:description" content={article.summary} />
</Helmet>

        
<div className="max-w-3xl mx-auto px-4 py-10">
      <Link to="/">← Back to news</Link>

    <h1 className="text-4xl font-bold mt-4 mb-4">{article.title}</h1>
<p className="text-sm text-gray-500 mb-4">
  {article.category} • By {article.author}
</p>
<p className="italic text-gray-700 mb-6">{article.summary}</p>
<div className="border-t pt-6 text-gray-800 leading-relaxed whitespace-pre-wrap">
  {article.content}
</div>
            </div>
            </>
  );
};

export default ArticleDetail;
