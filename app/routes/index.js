"use strict";

const express = require('express');
const router = express.Router();
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io').listen(server);
const passport = require('passport');


io.on('connection', (socket) => {

    io.emit('thing', { data: 'thisisathing' });

    socket.on('message', data => {
        console.log(`distribute:channel-${data.id}: ` + data.textContent);


        io.emit(`distribute:channel-${data.id}`, { username: '@username', textContent: data.textContent });
    });
});

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'Express' });
});


/* Handle Login POST */
router.post('/login', (req, res, next) => {

    passport.authenticate('login', {
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash : true
    });

    res.send({
        flashMessage: 'Logged in successfully',
        formType: 'hidden'
    });
});

/* GET Registration Page */
router.get('/signup', function(req, res){
    res.send({
        flashMessage: 'Create an account',
        formType: 'register'
    });
});

/* Handle Registration POST */
router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash : true
}));

//router.post('/login', (req, res) => {
//
//

module.exports = {
    express: express,
    router: router,
    app: app,
    server: server,
    passport: passport
  };
