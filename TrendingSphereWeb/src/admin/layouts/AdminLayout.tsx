import type { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "220px",
          backgroundColor: "#0f172a",
          color: "#ffffff",
          padding: "16px",
        }}
      >
        <h2>TrendingSphere</h2>
        <p style={{ marginTop: "12px" }}>Create Article</p>
      </aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          backgroundColor: "#f8fafc",
          padding: "24px",
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
