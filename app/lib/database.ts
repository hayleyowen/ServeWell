import mysql from 'mysql2/promise';


const pool = mysql.createPool({
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  port: 3307,
  // authPlugins: {
  //   mysql_native_password: () => () => require('mysql2/lib/auth_plugins/').mysql_native_password, 
  // },
  
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
