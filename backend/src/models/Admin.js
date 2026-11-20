import { getDB } from "../config/db.js";

const Admin = {
  async findOne({ username }) {
    const { pool, isPostgresConnected, mockStore } = getDB();

    if (!isPostgresConnected) {
      return mockStore.findAdminByUsername(username);
    }

    const res = await pool.query("SELECT * FROM admins WHERE username = $1 LIMIT 1", [
      username,
    ]);
    if (res.rows.length === 0) return null;

    const row = res.rows[0];
    return {
      ...row,
      _id: String(row.id),
    };
  },

  async findById(id) {
    const { pool, isPostgresConnected, mockStore } = getDB();

    if (!isPostgresConnected) {
      const admin = mockStore.admins.find((a) => String(a.id) === String(id));
      return admin ? { ...admin, _id: String(admin.id) } : null;
    }

    const res = await pool.query("SELECT * FROM admins WHERE id = $1 LIMIT 1", [id]);
    if (res.rows.length === 0) return null;

    const row = res.rows[0];
    return {
      ...row,
      _id: String(row.id),
    };
  },
};

export default Admin;
