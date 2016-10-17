/**
 * Created by jahansj on 31/05/2016.
 */
"use strict";

const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const ObjectID = require('mongodb').ObjectID;
const User = require('../schema/users.model');
const Auth = require('./auth.config.js');

module.exports = function (passport) {

  // serialise user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // deserialise the user
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use(new GoogleStrategy({

        clientID: Auth.google.clientID,
        clientSecret: Auth.google.clientSecret,
        callbackURL: Auth.google.callbackURL,
        passReqToCallback: true

      },
      (req, accessToken, refreshToken, profile, done) => {

        // if no user is logged in
        if (!req.user) {

          process.nextTick(() => {

            User.findOne({'google.id': profile.id}, (err, user) => {

              if (err) {
                return done(err);
              }

              // if user already exists log them in
              if (user) {

                if (!user.google.token) {

                  user.google.id = profile.id;
                  user.google.token = accessToken;
                  user.google.name = profile.name;
                  user.google.email = profile.emails[0].value;

                  user.save((err) => {

                    if (err) {
                      throw err;
                    }
                    else {
                      return done(null, user);
                    }
                  })

                }

                return done(null, user);
              }

              if (!user) {

                let newUser = new User();

                newUser.google.id = profile.id;
                newUser.google.token = accessToken;
                newUser.google.name = profile.name;
                newUser.google.email = profile.emails[0].value;

                newUser.save((err) => {

                  if (err) {
                    throw err;
                  }

                  return done(null, newUser);
                })
              }
            });
          });
        }
        else {
          let user = req.user;

          user.google.id = profile.id;
          user.google.token = accessToken;
          user.google.name = profile.name;
          user.google.email = profile.emails[0].value;

          user.save((err) => {

            if (err) {
              throw err;
            }
            else {
              return done(null, user);
            }
          })
        }

      }));

  passport.use(new TwitterStrategy({

        consumerKey: Auth.twitter.consumerKey,
        consumerSecret: Auth.twitter.consumerSecret,
        callbackURL: Auth.twitter.callbackURL,
        passReqToCallback: true

      },
      (req, token, tokenSecret, profile, done) => {

        // if no user is logged in
        if (!req.user) {
          process.nextTick(() => {

            User.findOne({'twitter.id': profile.id}, (err, user) => {

              if (err) {
                return done(err);
              }

              // if user exists login
              if (user) {

                // if user is in our database but has unlinked their account
                if (!user.twitter.token) {

                  user.twitter.id = profile.id;
                  user.twitter.token = token;
                  user.twitter.username = profile.username;
                  user.twitter.displayName = profile.displayName;

                  user.save((err) => {

                    if (err) {
                      throw err;
                    }
                    else {
                      return done(null, user);
                    }
                  })

                }
                else {
                  return done(null, user);
                }
              }
              else {

                let newUser = new User();

                newUser.twitter.id = profile.id;
                newUser.twitter.token = token;
                newUser.twitter.username = profile.username;
                newUser.twitter.displayName = profile.displayName;

                newUser.save((err) => {

                  if (err) {
                    throw err;
                  }

                  return done(null, newUser);
                });
              }
            });
          });
        }
        else {
          let newUser = req.user;

          newUser.twitter.id = profile.id;
          newUser.twitter.token = token;
          newUser.twitter.username = profile.username;
          newUser.twitter.displayName = profile.displayName;

          newUser.save((err) => {

            if (err) {
              throw err;
            }

            return done(null, newUser);
          });
        }


      }));

  // facebook signup
  passport.use(new FacebookStrategy({

        clientID: Auth.facebook.clientID,
        clientSecret: Auth.facebook.clientSecret,
        callbackURL: Auth.facebook.callbackURL,
        profileFields: ['email', 'name'],
        passReqToCallback: true
      },
      (req, accessToken, refreshToken, profile, done) => {

        process.nextTick(() => {

          // if no user is logged in
          if (!req.user) {

            User.findOne({'facebook.id': profile.id}, (err, user) => {

              if (err) {
                return done(err);
              }

              // if user is found log them in
              if (user) {

                // if a user is in our database but have unlinked their account
                if (!user.facebook.token) {

                  user.facebook.token = accessToken;
                  user.facebook.name = `${profile.name.givenName} ${profile.name.familyName}`;
                  user.facebook.email = profile.emails[0].value;

                  user.save((err) => {

                    if (err) {
                      throw err;
                    }
                    else {
                      return done(null, user);
                    }
                  });
                }
                else {
                  return done(null, user);
                }
              }
              else {

                let newUser = new User();

                newUser.facebook.id = profile.id;
                newUser.facebook.token = accessToken;
                newUser.facebook.name = `${profile.name.givenName} ${profile.name.familyName}`;
                newUser.facebook.email = profile.emails[0].value;

                newUser.save((err) => {

                  if (err) {
                    throw err;
                  }
                  else {
                    return done(null, newUser);
                  }
                });
              }
            });
          }
          else {

            let newUser = req.user;

            newUser.facebook.id = profile.id;
            newUser.facebook.token = accessToken;
            newUser.facebook.name = `${profile.name.givenName} ${profile.name.familyName}`;
            newUser.facebook.email = profile.emails[0].value;

            newUser.save((err) => {

              if (err) {
                throw err;
              }

              return done(null, newUser);
            });
          }


        });
      }));

  // local signup
  passport.use('local-signup', new LocalStrategy({

        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true

      },
      (req, email, password, done) => {

        // if no user is logged in
        if (!req.user) {

          // async process
          process.nextTick(() => {

            User.findOne({'local.email': email}, (err, user) => {

              if (err) {
                return done(err);
              }

              // check to see if email is already in use
              if (user) {

                // if user exists but has unlinked their account
                if (!user.local.email) {

                  user.local.email = email;
                  user.local.password = user.generateHash(password);

                  user.save((err) => {

                    if (err) {
                      throw err;
                    }
                    else {
                      return done(null, user);
                    }
                  })
                }

                return done(null, false, req.flash('signupMessage', 'That email is already in use.'));
              }
              else {

                let newUser = new User();

                // set the user's local credentials
                newUser.local.email = email;
                newUser.local.password = newUser.generateHash(password);

                newUser.save((err) => {

                  if (err) {
                    throw err;
                  }
                  else {
                    return done(null, newUser);
                  }
                });
              }
            });
          });
        }
        else {

          let user = req.user;

          user.local.email = email;
          user.local.password = user.generateHash(password);

          user.save((err) => {

            if (err) {
              throw err;
            }
            else {
              return done(null, user);
            }
          })
        }


      }));

  passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
      },
      (req, email, password, done) => {

        // find user entry matching forms email
        User.findOne({'local.email': email}, (err, user) => {

          if (err) {
            return done(err);
          }

          if (!user) {
            return done(null, false, req.flash('loginMessage', 'User not found'));
          }

          if (!user.validPassword(password)) {
            return done(null, false, req.flash('loginMessage', 'Invalid password'));
          }

          return done(null, user);
        })
      }))
};