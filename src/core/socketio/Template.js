const moment = require('moment');

module.exports = (io, socket) => {
  const fromServer = `from server ${moment().format('YYYY-MM-DD HH:mm:ss')}`;

  const readTemplate = (orderId, callback) => {
    // ...
    socket.emit('template:create', fromServer);
    callback({
      status: 'ok',
      time: moment().format('YYYY-MM-DD HH:mm:ss'),
    });
  };

  socket.on('template:read', readTemplate);
};
