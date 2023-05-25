/* eslint-disable no-console */
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const { appPort } = require('./configs');
const runTerminus = require('./core/terminus');
const runSocketIo = require('./core/socketio');
const { resError } = require('./middleware');

const app = express();
const PORT = appPort || 3001;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../public')));

const server = http.createServer(app);

app.set('socketio', runSocketIo(server));

routes(app);

app.use(resError);

runTerminus(server);

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
