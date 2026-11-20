import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// Public
import ArticleList from "./pages/ArticleList";

// Admin
import AdminLogin from "./admin/pages/Login";
import AdminDashboard from "./admin/pages/Dashboard";
import CreateArticle from "./admin/pages/CreateArticle";

import AdminRoute from "./admin/components/AdminRoute";
import AdminArticles from "./admin/pages/Articles";
import EditArticle from "./admin/pages/EditArticle";
import { lazy, Suspense } from "react";

const ArticleDetail = lazy(() => import("./pages/ArticleDetail"));

const App = () => {
    return (
      <Suspense fallback={<p>Loading...</p>}>
    <Routes>
      {/* Public */}
      <Route element={<Layout />}>
        <Route path="/" element={<ArticleList />} />
        <Route path="/news/:slug" element={<ArticleDetail />} />
      </Route>

      {/* Admin */}
     <Route path="/admin/login" element={<AdminLogin />} />

<Route
  path="/admin/dashboard"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>
<Route
  path="/admin/articles"
  element={
    <AdminRoute>
      <AdminArticles />
    </AdminRoute>
  }
/>

<Route
  path="/admin/articles/create"
  element={
    <AdminRoute>
      <CreateArticle />
    </AdminRoute>
  }
/>
          
          <Route
  path="/admin/articles/edit/:id"
  element={
    <AdminRoute>
      <EditArticle />
    </AdminRoute>
  }
/>
            </Routes>
            </Suspense>
  );
};

export default App;
