import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("draft");
  const [message, setMessage] = useState("");
const [featured, setFeatured] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
        try {
          

        const token = localStorage.getItem("adminToken");
        const res = await fetch(
          `http://localhost:5000/api/admin/articles/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        const a = data.data;
        setTitle(a.title);
        setSummary(a.summary);
        setContent(a.content);
        setCategory(a.category);
        setAuthor(a.author);
            setStatus(a.status);
            
                        setFeatured(a.featured);

      } catch {}
    };

    loadArticle();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(
        `http://localhost:5000/api/admin/articles/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
         body: JSON.stringify({
  title,
  summary,
  content,
  category,
  author,
  status,
  featured,
}),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Update failed");
        return;
      }

      setMessage("Article updated");
      setTimeout(() => navigate("/admin/articles"), 800);
    } catch {
      setMessage("Server error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Article</h1>

      {message && <p className="mb-4 text-sm text-blue-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full border p-3 rounded" value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea className="w-full border p-3 rounded" value={summary} onChange={e=>setSummary(e.target.value)} />
        <textarea className="w-full border p-3 rounded h-40" value={content} onChange={e=>setContent(e.target.value)} />
        <input className="w-full border p-3 rounded" value={category} onChange={e=>setCategory(e.target.value)} />
        <input className="w-full border p-3 rounded" value={author} onChange={e=>setAuthor(e.target.value)} />

              <label className="flex items-center gap-2">
  <input
    type="checkbox"
    checked={featured}
    onChange={(e) => setFeatured(e.target.checked)}
  />
  Featured on homepage
</label>

        <select
          className="w-full border p-3 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        <button className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800">
          Update
        </button>
      </form>
    </div>
  );
};

export default EditArticle;
