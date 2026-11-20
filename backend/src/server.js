import dotenv from "dotenv";
import app from "./app.js";
import { initDB } from "./config/db.js";

dotenv.config();

// Connect and initialize database
await initDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`TrendingSphere Backend running offline/local on port ${PORT}`);
});
