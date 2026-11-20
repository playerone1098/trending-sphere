import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          TrendingSphere
        </Link>

        <nav className="space-x-6 text-sm">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/admin/login" className="hover:underline">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
