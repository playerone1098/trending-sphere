import { getDB, formatArticleRow } from "../config/db.js";

const Article = {
  async find(filter = {}) {
    const { pool, isPostgresConnected, mockStore } = getDB();

    if (!isPostgresConnected) {
      return mockStore.getArticles({
        status: filter.status,
        featured: filter.featured,
      });
    }

    const conditions = [];
    const values = [];

    if (filter.status) {
      values.push(filter.status);
      conditions.push(`status = $${values.length}`);
    }

    if (typeof filter.featured === "boolean") {
      values.push(filter.featured);
      conditions.push(`featured = $${values.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const sql = `SELECT * FROM articles ${whereClause} ORDER BY created_at DESC`;

    const res = await pool.query(sql, values);
    return res.rows.map(formatArticleRow);
  },

  async findById(id) {
    const { pool, isPostgresConnected, mockStore } = getDB();

    if (!isPostgresConnected) {
      return mockStore.getArticleById(id);
    }

    const res = await pool.query("SELECT * FROM articles WHERE id = $1 LIMIT 1", [id]);
    if (res.rows.length === 0) return null;
    return formatArticleRow(res.rows[0]);
  },

  async findOne(filter = {}) {
    const { pool, isPostgresConnected, mockStore } = getDB();

    if (!isPostgresConnected) {
      if (filter.slug) {
        return mockStore.getArticleBySlug(filter.slug, filter.status);
      }
      if (filter._id || filter.id) {
        const id = filter._id || filter.id;
        const art = await mockStore.getArticleById(id);
        if (filter.status && art?.status !== filter.status) return null;
        return art;
      }
      const list = await mockStore.getArticles(filter);
      return list[0] || null;
    }

    const conditions = [];
    const values = [];

    if (filter.slug) {
      values.push(filter.slug);
      conditions.push(`slug = $${values.length}`);
    }

    if (filter._id || filter.id) {
      values.push(filter._id || filter.id);
      conditions.push(`id = $${values.length}`);
    }

    if (filter.status) {
      values.push(filter.status);
      conditions.push(`status = $${values.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const sql = `SELECT * FROM articles ${whereClause} LIMIT 1`;

    const res = await pool.query(sql, values);
    if (res.rows.length === 0) return null;
    return formatArticleRow(res.rows[0]);
  },

  async create({ title, slug, summary, content, category, author, status, featured }) {
    const { pool, isPostgresConnected, mockStore } = getDB();

    if (!isPostgresConnected) {
      return mockStore.createArticle({
        title,
        slug,
        summary,
        content,
        category,
        author,
        status: status || "draft",
        featured: Boolean(featured),
      });
    }

    const sql = `
      INSERT INTO articles (title, slug, summary, content, category, author, status, featured)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      title,
      slug,
      summary,
      content,
      category,
      author,
      status || "draft",
      Boolean(featured),
    ];

    const res = await pool.query(sql, values);
    return formatArticleRow(res.rows[0]);
  },

  async updateById(id, { title, slug, summary, content, category, author, status, featured }) {
    const { pool, isPostgresConnected, mockStore } = getDB();

    if (!isPostgresConnected) {
      return mockStore.updateArticle(id, {
        title,
        slug,
        summary,
        content,
        category,
        author,
        status,
        featured,
      });
    }

    const sql = `
      UPDATE articles
      SET title = COALESCE($1, title),
          slug = COALESCE($2, slug),
          summary = COALESCE($3, summary),
          content = COALESCE($4, content),
          category = COALESCE($5, category),
          author = COALESCE($6, author),
          status = COALESCE($7, status),
          featured = COALESCE($8, featured),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *
    `;

    const values = [
      title !== undefined ? title : null,
      slug !== undefined ? slug : null,
      summary !== undefined ? summary : null,
      content !== undefined ? content : null,
      category !== undefined ? category : null,
      author !== undefined ? author : null,
      status !== undefined ? status : null,
      featured !== undefined ? Boolean(featured) : null,
      id,
    ];

    const res = await pool.query(sql, values);
    if (res.rows.length === 0) return null;
    return formatArticleRow(res.rows[0]);
  },

  async findByIdAndDelete(id) {
    const { pool, isPostgresConnected, mockStore } = getDB();

    if (!isPostgresConnected) {
      return mockStore.deleteArticle(id);
    }

    const res = await pool.query("DELETE FROM articles WHERE id = $1 RETURNING id", [id]);
    return res.rowCount > 0;
  },
};

export default Article;
