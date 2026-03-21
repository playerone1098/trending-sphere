import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

interface Article {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  author: string;
}

const ArticleList = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
const [featured, setFeatured] = useState<Article[]>([]);

    
    useEffect(() => {
  fetch("http://localhost:5000/api/articles/featured")
    .then((res) => res.json())
    .then((data) => setFeatured(data.data || []));
}, []);

    
 useEffect(() => {
  const cached = sessionStorage.getItem("articles");
  if (cached) {
    setArticles(JSON.parse(cached));
    setLoading(false);
    return;
  }

  fetch("http://localhost:5000/api/articles")
    .then((res) => res.json())
    .then((data) => {
      setArticles(data.data || []);
      sessionStorage.setItem("articles", JSON.stringify(data.data || []));
      setLoading(false);
    });
}, []);


  if (loading) return <p className="text-center mt-10">Loading news...</p>;

  return (
    <>
      <Helmet>
        <title>TrendingSphere – Latest News</title>
        <meta
          name="description"
          content="TrendingSphere brings you the latest breaking news, trending stories, and in-depth articles."
        />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-8">Trending News</h1>

              
              {featured.length > 0 && (
  <section className="mb-12">
    <h2 className="text-3xl font-bold mb-6">Featured</h2>
    <div className="grid gap-6 md:grid-cols-2">
      {featured.map((article) => (
        <div
          key={article._id}
          className="p-6 border rounded-xl bg-yellow-50"
        >
          <p className="text-sm text-orange-600 font-semibold mb-2">
            Featured • {article.category}
          </p>
          <h3 className="text-2xl font-bold mb-2">
            <Link to={`/news/${article.slug}`}>
              {article.title}
            </Link>
          </h3>
          <p className="text-gray-700">{article.summary}</p>
        </div>
      ))}
    </div>
  </section>
)}

              
              
        {articles.length === 0 ? (
          <p>No articles available.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <div
                key={article._id}
                className="border rounded-xl p-5 hover:shadow-lg transition bg-white"
              >
                <p className="text-sm text-blue-600 font-semibold mb-2">
                  {article.category}
                </p>

                <h2 className="text-xl font-bold mb-2 line-clamp-2">
                  <Link
                    to={`/news/${article.slug}`}
                    className="hover:underline"
                  >
                    {article.title}
                  </Link>
                </h2>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {article.summary}
                </p>

                <p className="text-xs text-gray-500">
                  By {article.author}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ArticleList;
