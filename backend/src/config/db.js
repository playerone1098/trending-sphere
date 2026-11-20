import pg from "pg";
import bcrypt from "bcryptjs";

const { Pool } = pg;

// Connection configuration for local PostgreSQL
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    `postgresql://${process.env.PGUSER || "postgres"}:${process.env.PGPASSWORD || "postgres"}@${process.env.PGHOST || "localhost"}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE || "trendingsphere"}`,
  connectionTimeoutMillis: 3000,
});

let isPostgresConnected = false;

// In-memory mock store for offline mode when PostgreSQL daemon is not running
class OfflineMockStore {
  constructor() {
    this.admins = [];
    this.articles = [];
    this.articleIdCounter = 1;
    this.adminIdCounter = 1;
  }

  async init(mockArticles, defaultPasswordHash) {
    this.admins = [
      {
        id: this.adminIdCounter++,
        username: "admin",
        password: defaultPasswordHash,
        created_at: new Date().toISOString(),
      },
    ];

    for (const art of mockArticles) {
      this.articles.push({
        id: this.articleIdCounter++,
        title: art.title,
        slug: art.slug,
        summary: art.summary,
        content: art.content,
        category: art.category,
        author: art.author,
        status: art.status || "published",
        featured: Boolean(art.featured),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  }

  formatArticle(row) {
    if (!row) return null;
    return {
      ...row,
      _id: String(row.id),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async findAdminByUsername(username) {
    const admin = this.admins.find((a) => a.username === username);
    if (!admin) return null;
    return { ...admin, _id: String(admin.id) };
  }

  async getArticles({ status, featured, limit } = {}) {
    let list = [...this.articles];
    if (status) {
      list = list.filter((a) => a.status === status);
    }
    if (typeof featured === "boolean") {
      list = list.filter((a) => a.featured === featured);
    }
    list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (limit) {
      list = list.slice(0, limit);
    }
    return list.map(this.formatArticle);
  }

  async getArticleById(id) {
    const row = this.articles.find((a) => String(a.id) === String(id));
    return this.formatArticle(row);
  }

  async getArticleBySlug(slug, status) {
    const row = this.articles.find((a) => {
      const matchSlug = a.slug.toLowerCase() === slug.toLowerCase();
      if (status) return matchSlug && a.status === status;
      return matchSlug;
    });
    return this.formatArticle(row);
  }

  async createArticle({ title, slug, summary, content, category, author, status, featured }) {
    const newArt = {
      id: this.articleIdCounter++,
      title,
      slug,
      summary,
      content,
      category,
      author,
      status: status || "draft",
      featured: Boolean(featured),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.articles.unshift(newArt);
    return this.formatArticle(newArt);
  }

  async updateArticle(id, { title, slug, summary, content, category, author, status, featured }) {
    const index = this.articles.findIndex((a) => String(a.id) === String(id));
    if (index === -1) return null;

    const existing = this.articles[index];
    const updated = {
      ...existing,
      title: title !== undefined ? title : existing.title,
      slug: slug !== undefined ? slug : existing.slug,
      summary: summary !== undefined ? summary : existing.summary,
      content: content !== undefined ? content : existing.content,
      category: category !== undefined ? category : existing.category,
      author: author !== undefined ? author : existing.author,
      status: status !== undefined ? status : existing.status,
      featured: featured !== undefined ? Boolean(featured) : existing.featured,
      updated_at: new Date().toISOString(),
    };
    this.articles[index] = updated;
    return this.formatArticle(updated);
  }

  async deleteArticle(id) {
    const index = this.articles.findIndex((a) => String(a.id) === String(id));
    if (index === -1) return false;
    this.articles.splice(index, 1);
    return true;
  }
}

const mockStore = new OfflineMockStore();

export const initialMockArticles = [
  {
    title: "Breakthrough in Artificial Intelligence: Next-Gen Autonomous Systems Announced",
    slug: "breakthrough-in-artificial-intelligence-next-gen-autonomous-systems",
    summary:
      "A new generation of multi-modal AI systems shows remarkable emergent capabilities in reasoning, multimodal interaction, and offline edge computing.",
    content:
      "Researchers and developers have introduced modern autonomous architectures that operate with high efficiency both online and offline. By distributing workload across local and distributed microservices, new applications achieve sub-millisecond latencies and enhanced data privacy.\n\nThe system emphasizes resilient offline-first design patterns, demonstrating how modern web stacks can smoothly operate without persistent cloud dependency.",
    category: "Technology",
    author: "Ashok Choudhary",
    status: "published",
    featured: true,
  },
  {
    title: "Global Clean Energy Transition Reaches Record Milestone",
    slug: "global-clean-energy-transition-reaches-record-milestone",
    summary:
      "Renewable sources supplied over 40% of grid electricity in leading global regions over the past quarter.",
    content:
      "Advances in grid-scale energy storage and decentralized solar and wind infrastructure have accelerated adoption worldwide. Experts highlight that modern power networks are increasingly dependable, scalable, and decentralized.",
    category: "Science",
    author: "Sarah Jenkins",
    status: "published",
    featured: true,
  },
  {
    title: "Modern Web Frameworks Embrace Lightweight Relational Architectures",
    slug: "modern-web-frameworks-embrace-lightweight-relational-architectures",
    summary:
      "Developers are transitioning from document stores to PostgreSQL for superior consistency, schema validation, and offline reliability.",
    content:
      "Relational databases like PostgreSQL continue to dominate mission-critical enterprise systems. With robust JSON support, strict ACID guarantees, and comprehensive tooling, engineering teams are simplifying their tech stacks while gaining speed and predictability.",
    category: "Engineering",
    author: "Alex Rivera",
    status: "published",
    featured: false,
  },
  {
    title: "Space Exploration: Next Lunar Rover Prepares for Polar Mission",
    slug: "space-exploration-next-lunar-rover-prepares-for-polar-mission",
    summary:
      "Autonomous rovers equipped with deep subterranean radar are scheduled to explore permanent shadow craters in search of water ice deposits.",
    content:
      "The mission marks an essential step towards sustainable scientific outposts. Equipped with real-time autonomous path planning and high-res imaging, the rover will transmit rich telemetry back to planetary research centers.",
    category: "Space",
    author: "Elena Rostova",
    status: "published",
    featured: false,
  },
  {
    title: "The Rise of Edge Computing in Everyday Consumer Devices",
    slug: "the-rise-of-edge-computing-in-everyday-consumer-devices",
    summary:
      "On-device inference and local databases are empowering privacy-conscious applications to work without constant internet connectivity.",
    content:
      "By processing sensitive operations locally, devices reduce bandwidth consumption and eliminate latency. The shift towards local-first software ensures continuous productivity regardless of network connectivity.",
    category: "Tech Trends",
    author: "Marcus Vance",
    status: "published",
    featured: false,
  },
];

// Helper to format PostgreSQL row to match expected frontend structure
export const formatArticleRow = (row) => {
  if (!row) return null;
  return {
    ...row,
    _id: String(row.id),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

// Initialize schema and mock data
export const initDB = async () => {
  const defaultPasswordHash = await bcrypt.hash("admin123", 10);

  // Initialize offline mock store as guaranteed fallback
  await mockStore.init(initialMockArticles, defaultPasswordHash);

  try {
    const client = await pool.connect();
    isPostgresConnected = true;
    console.log("Connected to PostgreSQL successfully");

    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        slug VARCHAR(500) UNIQUE NOT NULL,
        summary TEXT NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        author VARCHAR(100) NOT NULL,
        status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
        featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed default admin if missing
    const adminCheck = await client.query("SELECT id FROM admins WHERE username = $1", ["admin"]);
    if (adminCheck.rows.length === 0) {
      await client.query(
        "INSERT INTO admins (username, password) VALUES ($1, $2)",
        ["admin", defaultPasswordHash]
      );
      console.log("Default admin account created (username: admin, password: admin123)");
    }

    // Seed initial mock articles if table is empty
    const articleCheck = await client.query("SELECT COUNT(*) FROM articles");
    if (parseInt(articleCheck.rows[0].count, 10) === 0) {
      for (const art of initialMockArticles) {
        await client.query(
          `INSERT INTO articles (title, slug, summary, content, category, author, status, featured)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            art.title,
            art.slug,
            art.summary,
            art.content,
            art.category,
            art.author,
            art.status,
            art.featured,
          ]
        );
      }
      console.log(`Seeded ${initialMockArticles.length} mock articles into PostgreSQL.`);
    }

    client.release();
  } catch (err) {
    isPostgresConnected = false;
    console.warn(
      `PostgreSQL service connection notice: ${err.message}. Running in offline mock data mode.`
    );
  }
};

export const getDB = () => ({
  pool,
  isPostgresConnected,
  mockStore,
});

export default {
  pool,
  initDB,
  getDB,
  formatArticleRow,
};
