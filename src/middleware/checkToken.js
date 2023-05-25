const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('../exceptions');
const { jwtSecret } = require('../configs');

function checkToken(req, res, next) {
  try {
    const token = req.header('Authorization');
    if (!token) {
      throw new AuthenticationError('no token, authorization denied');
    }
    const removeBearer = token.slice(7, token.length);
    const decoded = jwt.verify(removeBearer, jwtSecret);
    req.user = decoded.user;
    return next();
  } catch (err) {
    throw new AuthenticationError(err.message);
  }
}

module.exports = checkToken;
