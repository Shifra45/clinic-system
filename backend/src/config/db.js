const { Pool } = require('pg');
require('dotenv').config();

console.log('🔍 Cek ENV:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? 'ADA ✅' : 'KOSONG ❌');
console.log('DB_NAME:', process.env.DB_NAME);

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
});

module.exports = pool;