/* eslint-disable no-console */
// const { pool } = require('.');
require('dotenv').config();
const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const client = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASS,
  port: process.env.PG_PORT,
});

async function createTable(pg) {
  await pg.query(`
    CREATE TABLE IF NOT EXISTS users ( 
      id SERIAL PRIMARY KEY, 
      username VARCHAR UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role VARCHAR NOT NULL,
      status INTEGER NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )`);
  console.log('create table success');
}

async function insertTable(pg) {
  const salt = await bcrypt.genSalt(10);
  const username = process.env.USER_INIT;
  const hashPassword = await bcrypt.hash(process.env.PASS_INIT, salt);
  await pg.query(`
    INSERT INTO users
      (username, password, role, status)
    VALUES
      ('${username}', '${hashPassword}', 'admin', 1)
  `);
  console.log('insert table success');
}

// MAIN FUNC
const migration = async (pg) => {
  try {
    await pg.connect();
    await createTable(pg);
    await insertTable(pg);
    await pg.end();
  } catch (err) {
    console.error(`migration() ${err.message}`);
  }
};

// RUN FUNC
migration(client);
