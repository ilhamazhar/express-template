const users = require('./modules/users');

const routes = (app) => {
  app.use('/api/users', users);
};

module.exports = routes;
