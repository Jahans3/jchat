"use strict";

const express = require('express');
const router = express.Router();
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io').listen(server);



io.on('connection', (socket) => {

    io.emit('thing', { data: 'thisisathing' });

    socket.on('message', data => {
        console.log(`distribute:channel-${data.id} ` + data.textContent);


        io.emit(`distribute:channel-${data.id}`, { username: '@username', textContent: data.textContent });
    });
});

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'Express' });
});

module.exports = {
    express: express,
    router: router,
    app: app,
    server: server
  };
