"use strict";

const express = require('./routes/index').express;
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dbConfig = require('../schema/db.js');
const mongoose = require('mongoose');
const passport = require('./routes/index').passport;
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');

const app = require('./routes/index').app;

app.use(expressSession({
  secret: 'mySecretKey',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

const isValidPassword = (user, password) => {
  return bCrypt.compareSync(password, user.password);
};

// passport/login.js
passport.use('login', new LocalStrategy({
      passReqToCallback : true
    },
    function(req, username, password, done) {
      // check in mongo if a user with username exists or not
      User.findOne({ 'username' :  username },
          function(err, user) {
            // In case of any error, return using the done method
            if (err)
              return done(err);
            // Username does not exist, log error & redirect back
            if (!user){
              console.log('User Not Found with username '+username);
              return done(null, false,
                  req.flash('message', 'User Not found.'));
            }
            // User exists but wrong password, log the error
            if (!isValidPassword(user, password)){
              console.log('Invalid Password');
              return done(null, false,
                  req.flash('message', 'Invalid Password'));
            }
            // User and password both match, return user from
            // done method which will be treated like success
            return done(null, user);
          }
      );
  })
);

passport.use('signup', new LocalStrategy({
      passReqToCallback : true
    },
    function(req, username, password, done) {
      findOrCreateUser = function(){
        // find a user in Mongo with provided username
        User.findOne({'username':username},function(err, user) {
          // In case of any error return
          if (err){
            console.log('Error in SignUp: '+err);
            return done(err);
          }
          // already exists
          if (user) {
            console.log('User already exists');
            return done(null, false,
                req.flash('message','User Already Exists'));
          } else {
            // if there is no user with that email
            // create the user
            var newUser = new User();
            // set the user's local credentials
            newUser.username = username;
            newUser.password = createHash(password);
            newUser.email = req.param('email');
            newUser.firstName = req.param('firstName');
            newUser.lastName = req.param('lastName');

            // save the user
            newUser.save(function(err) {
              if (err){
                console.log('Error in Saving user: '+err);
                throw err;
              }
              console.log('User Registration succesful');
              return done(null, newUser);
            });
          }
        });
      };

      // Delay the execution of findOrCreateUser and execute
      // the method in the next tick of the event loop
      process.nextTick(findOrCreateUser);
    })
);

// Generates hash using bCrypt
const createHash = (password) => {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};


const routes = require('./routes/index').router;
const users = require('./routes/users');

mongoose.connect(dbConfig.url);

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../dist')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
