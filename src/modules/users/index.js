const router = require('express').Router();
const { query, body } = require('express-validator');
const { getUsers, passwordIsMatch, getLoggedIn } = require('./services');
const { reqValidation, checkToken } = require('../../middleware');

router.get(
  '/',
  checkToken,
  query('page').trim().notEmpty(),
  query('limit').trim().notEmpty(),
  query('order').trim(),
  query('orderBy').trim(),
  query('filter').trim(),
  reqValidation,
  async (req, res, next) => {
    try {
      const result = await getUsers(req.query);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
);

router.get('/login', checkToken, async (req, res, next) => {
  try {
    const result = await getLoggedIn(req.user.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/login',
  body('username').trim().notEmpty(),
  body('password').trim().notEmpty(),
  reqValidation,
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const data = await passwordIsMatch(username, password);
      res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
