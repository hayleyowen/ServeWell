// import { Pool } from "pg";

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL, // Make sure this is in your .env file
//   ssl: {
//     rejectUnauthorized: false, // Needed for Neon
//   },
// });

// export default pool;

import mysql from "mysql2";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
