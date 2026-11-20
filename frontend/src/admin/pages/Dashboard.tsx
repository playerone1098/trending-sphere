import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="p-10 space-y-4">
      <h1 className="text-3xl font-bold">
        Admin Dashboard
      </h1>

      <div className="space-x-4">
        <Link
          to="/admin/articles"
          className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
        >
          Manage Articles
        </Link>

        <Link
          to="/admin/articles/create"
          className="inline-block bg-gray-700 text-white px-6 py-3 rounded hover:bg-gray-800"
        >
          Create Article
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
