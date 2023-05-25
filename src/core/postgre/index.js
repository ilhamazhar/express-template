/* eslint-disable no-console */
const { Pool } = require('pg');
const { postgre } = require('../../configs');

const pool = new Pool(postgre);

// HEROKU
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

pool
  .query('SELECT NOW()')
  .then(() => {
    console.log('db postgres connected');
  })
  .catch((err) => {
    console.error(err.message);
  });

const endPool = () => {
  pool.end(() => {
    console.log('db postgres has ended');
  });
};

module.exports = {
  pool,
  endPool,
};
