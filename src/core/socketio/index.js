/* eslint-disable no-console */
const socketIo = require('socket.io');
const registerTemplateHandler = require('./Template');

const runSocketIo = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3001'],
    },
  });

  const onConnection = (socket) => {
    console.log(
      `${io.engine.clientsCount} users connected with id = ${socket.id}`
    );
    console.log('ROOM BEGIN ---> ', io.sockets.adapter.rooms);
    // console.log('rooms size con ==>', socket.rooms.size);
    // console.log('rooms con ==>', socket.rooms);
    socket.on('room:create', (iduser) => {
      // console.log('new room --> ', iduser);
      socket.join(iduser);
      console.log('ROOM JOIN ---> ', io.sockets.adapter.rooms);
      // console.log('rooms in join ==>', socket.rooms);
      // console.log('rooms size in join ==>', socket.rooms.size);
      // console.log('rooms in ==>', socket.rooms);
    });

    socket.on('room:delete', (iduser) => {
      // console.log('leave room --> ', iduser);
      socket.leave(iduser);
      console.log('ROOM LEAVE ---> ', io.sockets.adapter.rooms);
      // console.log('rooms size in leave ==>', socket.rooms.size);
      // console.log('rooms in ==>', socket.rooms);
    });

    // register socket here
    registerTemplateHandler(io, socket);

    socket.on('disconnect', (reason) => {
      console.log('rooms size dis ==>', socket.rooms.size);
      console.log(`socket ${socket.id} disconnected ${reason}`);
      // console.log(`${io.engine.clientsCount} users connected`);
    });
  };

  io.on('connection', onConnection);

  return io;
};

module.exports = runSocketIo;
