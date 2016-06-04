"use strict";

const express = require('express');
const router = express.Router();
const app = express();
const passport = require('passport');
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io').listen(server);
const flash = require('connect-flash');
const session = require('express-session');


app.use(session({
    secret: 'supersecretsecret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

io.on('connection', (socket) => {

    io.emit('thing', { data: 'thisisathing' });

    socket.on('message', data => {
        console.log(`distribute:channel-${data.id}: ` + data.textContent);


        io.emit(`distribute:channel-${data.id}`, { username: '@username', textContent: data.textContent });
    });
});

/* GET home page. */
router.get('/', (req, res) => {
    res.render('index', { title: 'My App' });
});

/* GET login page */
router.get('/login', (req, res) => {
    res.render('login', { message: req.flash('loginMessage') });
});

/* process a login form */
router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

/* GET signup page */
router.get('/signup', (req, res) => {
    res.render('signup', { message: req.flash('signupMessage') });
});

/* process a signup form */
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

/* authenticate facebook user */
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

/* handle the callback after facebook has authenticated the user */
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect : '/profile',
        failureRedirect : '/',
        failureFlash: true
}));

/* authenticate twitter */
app.get('/auth/twitter', passport.authenticate('twitter'));

/* handle the callback after twitter has authenticated the user */
app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        successRedirect : '/profile',
        failureRedirect : '/',
        failureFlash: true
}));

/* authenticate google */
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/* handle the callback after google has authenticated the user */
app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/',
    failureFlash: true
}));

/* GET profile page */
router.get('/profile', isLoggedIn, (req, res) => {

    // pass user from session
    res.render('profile', { user: req.user });
});

/* GET logout page */
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

/* check if user is logged in */
function isLoggedIn (req, res, next) {

    if (req.isAuthenticated()){
        return next();
    }

    res.redirect('/');
}

module.exports = {
    express: express,
    router: router,
    app: app,
    server: server,
    passport: passport
};
