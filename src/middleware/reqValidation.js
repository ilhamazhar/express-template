const { validationResult } = require('express-validator');
const { InvariantError } = require('../exceptions');

function reqValidation(req, res, next) {
  const errors = validationResult(req);
  const objErrors = errors.array().reduce((obj, item) => {
    // eslint-disable-next-line no-param-reassign, no-unused-expressions
    obj[item.param]
      ? obj[item.param].push(item.msg)
      : // eslint-disable-next-line no-param-reassign
        (obj[item.param] = [item.msg]);
    return obj;
  }, {});
  if (!errors.isEmpty()) {
    throw new InvariantError(JSON.stringify(objErrors));
  }
  return next();
}

module.exports = reqValidation;
