// eslint-disable-next-line no-unused-vars
const resError = (err, req, res, next) => {
  const errStatus = err.statusCode || 500;
  const errMsg = err.message || 'Something went wrong';
  res.status(errStatus).json({
    message: errMsg,
  });
};

module.exports = resError;
