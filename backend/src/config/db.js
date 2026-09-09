const { Pool } = require('pg'); // Ganti dengan mysql2 jika pakai MySQL
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432, // Ganti dengan 3306 jika MySQL
});

module.exports = pool;