const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t mt-10">
      <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} TrendingSphere. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
