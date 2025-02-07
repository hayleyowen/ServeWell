
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Make sure this is in your .env file
  ssl: {
    rejectUnauthorized: false, // Needed for Neon
  },
});

export default pool;
