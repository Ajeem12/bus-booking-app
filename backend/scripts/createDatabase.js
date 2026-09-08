// Creates the database itself (knex migrations only create tables, not the DB).
// Run this once before `npm run migrate` — or just use `npm run setup` which does both.
require('dotenv').config();
const mysql = require('mysql2/promise');

async function createDatabase() {
  const dbName = process.env.DB_NAME || 'bus_booking';

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  console.log(`Database "${dbName}" is ready.`);
  await connection.end();
}

createDatabase().catch((err) => {
  console.error('Failed to create database:', err.message);
  process.exit(1);
});
