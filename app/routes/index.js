"use strict";

const express = require('express');
const router = express.Router();
const app = express();
const passport = require('passport');
const http = require('http');
const server = http.createServer(app);
const flash = require('connect-flash');
const session = require('express-session');
const User = require('../../schema/users.model');
const io = require('socket.io').listen(server);

app.use(session({
    secret: 'supersecretsecret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/* routes */
require('./data-requests')(router);
require('./pages')(router);
require('./auth-handlers')(router, passport);
require('./form-handlers')(router, passport);

/* socket */
require('./socket')(io);

module.exports = {
    express: express,
    router: router,
    app: app,
    server: server,
    passport: passport
};
