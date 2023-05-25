const { pool } = require('../../core/postgre');
const { NotFoundError } = require('../../exceptions');

const selectUsers = async (query) => {
  const { limit, page, order, orderBy, filter, rangeTime } = query;
  const offset = (page - 1) * limit;

  let queryData = 'SELECT * FROM users';
  let queryCount = 'SELECT COUNT(id) AS total FROM users';

  if (rangeTime || filter) {
    queryData += ' WHERE';
    queryCount += ' WHERE';
  }

  if (rangeTime) {
    const arrRangeTime = rangeTime.split(',');
    const rangeTimeQuery = ` created_at >= '${arrRangeTime[0]}' AND created_at <= '${arrRangeTime[1]}'`;
    queryData += rangeTimeQuery;
    queryCount += rangeTimeQuery;
  }

  if (filter) {
    const filterQuery = ` ${filter
      .replace(/=/g, '::TEXT ILIKE ')
      .replace(/,/g, '::TEXT AND ')}`;
    queryData += filterQuery;
    queryCount += filterQuery;
  }

  queryData += ` ORDER BY ${
    orderBy || 'created_at'
  } ${order} LIMIT $1 OFFSET $2`;
  console.log(order, orderBy);

  const valuesQueryData = [limit, offset];
  const data = await pool.query(queryData, valuesQueryData);
  const total = await pool.query(queryCount);

  return {
    page: Number(page),
    total: Number(total.rows[0].total),
    rows: data.rows,
  };
};

const checkUser = async (username) => {
  const query = `
    SELECT * FROM users WHERE username=$1 AND status=$2
  `;
  const value = [username, 1];
  const data = await pool.query(query, value);
  if (!data.rows[0]) {
    throw new NotFoundError('User not found or not active');
  }
  return data.rows[0];
};

const getUser = async (id) => {
  const text = `
    SELECT id, username, role, status, updated_at, created_at
      FROM users
      WHERE id=$1
    `;
  const value = [id];
  const data = await pool.query(text, value);
  if (!data.rows[0]) {
    throw new NotFoundError('User not found');
  }
  return data.rows[0];
};

module.exports = {
  checkUser,
  getUser,
  selectUsers,
};
