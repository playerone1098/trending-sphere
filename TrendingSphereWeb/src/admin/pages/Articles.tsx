import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Article {
  _id: string;
  title: string;
  status: string;
  category: string;
  createdAt: string;
}

const AdminArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        const res = await fetch(
          "http://localhost:5000/api/admin/articles",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

          const data = await res.json();
          console.log("Admin articles API response:", data);

        setArticles(data.data || []);
      } catch {
        // silently fail for now
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <p className="p-10">Loading articles...</p>;
  }

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Manage Articles
        </h1>

        <Link
          to="/admin/articles/create"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          + New Article
        </Link>
      </div>

      {articles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3 border">Title</th>
              <th className="text-left p-3 border">Category</th>
              <th className="text-left p-3 border">Status</th>
              <th className="text-left p-3 border">Created</th>
              <th className="text-left p-3 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {articles.map((article) => (
              <tr key={article._id} className="border-t">
                <td className="p-3 border">
                  {article.title}
                </td>
                <td className="p-3 border">
                  {article.category}
                </td>
                <td className="p-3 border capitalize">
                  {article.status}
                </td>
                <td className="p-3 border text-sm text-gray-500">
                  {new Date(article.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3 border space-x-3">
                 <Link
  to={`/admin/articles/edit/${article._id}`}
  className="text-blue-600"
>
  Edit
</Link>
                 <span
  className="text-red-600 cursor-pointer"
  onClick={async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this article?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(
        `http://localhost:5000/api/admin/articles/${article._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Delete failed");
        return;
      }

      // Remove from UI without reload
      setArticles((prev) =>
        prev.filter((a) => a._id !== article._id)
      );
    } catch {
      alert("Server error while deleting");
    }
  }}
>
  Delete
</span>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminArticles;
