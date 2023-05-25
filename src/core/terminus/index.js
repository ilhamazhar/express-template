/* eslint-disable no-console */
const { createTerminus } = require('@godaddy/terminus');
const { endPool } = require('../postgre');

function onSignal() {
  console.log('server is starting cleanup');
  endPool();
}

function onShutdown() {
  console.log('cleanup finished, server is shutting down');
}

function runTerminus(server) {
  createTerminus(server, {
    signal: 'SIGINT',
    onShutdown,
    onSignal,
  });
}

module.exports = runTerminus;
