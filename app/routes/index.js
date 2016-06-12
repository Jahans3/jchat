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
const Group = require('../../schema/groups.model');

app.use(session({
    secret: 'supersecretsecret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

io.on('connection', /* TODO isLoggedIn */ (socket) => {

    io.emit('thing', { data: 'thisisathing' });

    socket.on('message', data => {
        console.log(`distribute:channel-${data.id}: ${data.textContent}`);


        io.emit(`distribute:channel-${data.id}`, { username: data.username, textContent: data.textContent });
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

/* POST create channel */
router.post('/createGroup', (req, res) => {
    console.log(req.body);

    Group.findOne({ 'name': req.body.group_name }, (err, group) => {

        if (err) {
            return done(err);
        }

        if (group) {
            res.send(group);
            //return done(null, group); // return group info
        }

        if (!group) {

            let newGroup = new Group();
            //let userObj = req.name


            newGroup.name = req.body.group_name;
            //newGroup.founder = userObj.name;
            console.log(newGroup);

            // group users
            // set creating user as admin
            newGroup.users[0] = {};
            newGroup.users[0].name = req.body.user_name;
            newGroup.users[0].admin = true;

            newGroup.users[1] = {};
            newGroup.users[1].name = req.body.friend_name;
            //newGroup.users[1].name = findUserIdByName(req.body.friend_name); //TODO - findUserIdByName()
            newGroup.users[1].admin = req.body.friend_permissions > 4 ? true : false;

            // initial channel
            newGroup.channels[0] = {};
            newGroup.channels[0].name = req.body.channel_name;

            newGroup.channels[0].users = [];
            newGroup.channels[0].users[0] = {};
            newGroup.channels[0].users[0].name = req.body.user_name;
            newGroup.channels[0].users[0].userid = req.body.user_id;
            newGroup.channels[0].users[0].accessLevel = 5;

            newGroup.channels[0].users[1] = {};
            newGroup.channels[0].users[1].name = req.body.friend_name;
            //newGroup.channels[0].users[1].userid = findUserIdByName(req.body.friend_name); //TODO - findUserIdByName()
            newGroup.channels[0].users[1].accessLevel = req.body.friend_permissions;

            newGroup.save((err) => {

                if (err) {
                    throw err;
                }

                res.render('groupManager', { somedata: newGroup });
                //done(null, newGroup); // do
            });
        }
    });

    //res.send({ groupMessage: 'Request Received' });
});

/* pass user data to the app */
router.get('/username_request', isLoggedInNoRedirect, (req, res) => {

    this.response = req.user.local.email;
    this.accounts = [req.user.facebook.name, req.user.google.email, req.user.twitter.name];

    let i = 0;
    while (this.response === undefined) {
        this.response = this.accounts[i];
        i++;

        if (i > 2) {
            this.response = 'Guest';
            break;
        }
    }

    res.send(this.response);
});

function isLoggedInNoRedirect (req, res, next) {

    if (req.isAuthenticated()) {

        return next()
    }
    else {

        res.send('jChat');
    }
}


/*
 * Auth requests
 */


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



/* handle local login being connected to account */
app.get('/connect/local', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

/* connect a local login to account */
app.get('/connect/local-connect', (req, res) => {
    res.render('connect-local', { message: req.flash('loginMessage') });
});

/* connect a facebook login to account */
app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

/* handle facebook callback */
app.get('/connect/facebook/callback', passport.authorize('facebook', {
        successRedirect : '/profile',
        failureRedirect : '/'
}));

/* connect a twitter login to account */
app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

/* handle twitter callback */
app.get('/connect/twitter/callback', passport.authorize('twitter', {
        successRedirect : '/profile',
        failureRedirect : '/'
}));

/* connect a google login to account */
app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

/* handle google callback */
app.get('/connect/google/callback', passport.authorize('google', {
        successRedirect : '/profile',
        failureRedirect : '/'
}));

/* unlink a local account */
app.get('/unlink/local', (req, res) => {
    var user = req.user;

    user.local.email    = undefined;
    user.local.password = undefined;

    user.save(function(err) {
        res.redirect('/profile');
    });
});

/* unlink a facebook account */
app.get('/unlink/facebook', function(req, res) {
    var user = req.user;

    user.facebook.token = undefined;

    user.save(function(err) {
        res.redirect('/profile');
    });
});

/* unlink a twitter account */
app.get('/unlink/twitter', function(req, res) {
    var user = req.user;

    user.twitter.token = undefined;

    user.save(function(err) {
        res.redirect('/profile');
    });
});

/* unlink a google account */
app.get('/unlink/google', function(req, res) {
    var user = req.user;

    user.google.token = undefined;

    user.save(function(err) {
        res.redirect('/profile');
    });
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
