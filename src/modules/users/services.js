const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { selectUsers, checkUser, getUser } = require('./repo');
const { jwtSecret } = require('../../configs');
const { InvariantError } = require('../../exceptions');

const getUsers = async (query) => {
  const users = await selectUsers(query);
  return {
    data: users,
  };
};

const getLoggedIn = async (id) => {
  const user = await getUser(id);
  return {
    data: { user },
  };
};

const passwordIsMatch = async (username, password) => {
  const user = await checkUser(username);
  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    throw new InvariantError('password incorect');
  }
  const payload = {
    user: {
      id: user.id,
    },
  };
  const token = jwt.sign(payload, jwtSecret, {
    expiresIn: '7d',
  });
  return {
    data: {
      token: `Bearer ${token}`,
    },
  };
};

module.exports = {
  getUsers,
  getLoggedIn,
  passwordIsMatch,
};
