import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet-async";

const Layout = () => {
  return (
      <div className="min-h-screen flex flex-col">
          
          <Helmet>
  <title>TrendingSphere – Latest News</title>
  <meta
    name="description"
    content="TrendingSphere brings you breaking news, trending stories, and in-depth articles."
  />
  <meta property="og:title" content="TrendingSphere – Latest News" />
  <meta
    property="og:description"
    content="TrendingSphere brings you breaking news, trending stories, and in-depth articles."
  />
  <meta property="og:type" content="website" />
</Helmet>

          
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
