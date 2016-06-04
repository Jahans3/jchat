/**
 * Created by jahansj on 31/05/2016.
 */
"use strict";

const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
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

    passport.use( new GoogleStrategy({

        clientID: Auth.google.clientID,
        clientSecret: Auth.google.clientSecret,
        callbackURL: Auth.google.callbackURL,
        passReqToCallback: true

    },
    (request, accessToken, refreshToken, profile, done) => {

        process.nextTick(() => {

            User.findOne({ 'google.id': profile.id }, (err, user) => {

                if (err) {
                    return done(err);
                }

                // if user already exists log them in
                if (user) {
                    return done(null, user);
                }

                if (!user) {

                    let newUser = new User();

                    console.log(profile.id);
                    console.log(accessToken);
                    console.log(profile.name);
                    console.log(profile.emails[0].value);

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
    }));

    passport.use( new TwitterStrategy({

        consumerKey: Auth.twitter.consumerKey,
        consumerSecret: Auth.twitter.consumerSecret,
        callbackURL: Auth.twitter.callbackURL

    },
    (token, tokenSecret, profile, done) => {

        process.nextTick(() => {

            User.findOne({ 'twitter.id': profile.id }, (err, user) => {

                if (err) {
                    return done(err);
                }

                // if user exists login
                if (user) {
                    return done(null, user);
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

    }));

    // facebook signup
    passport.use( new FacebookStrategy({

        clientID: Auth.facebook.clientID,
        clientSecret: Auth.facebook.clientSecret,
        callbackURL: Auth.facebook.callbackURL,
        profileFields: [ 'email' , 'name' ]

    },
    (token, refreshToken, profile, done) => {

        process.nextTick(() => {

            User.findOne({ 'facebook.id': profile.id }, (err, user) => {

                if (err) {
                    return done(err);
                }

                // if user is found log them in
                if (user) {
                    return done(null, user);
                }
                else {
                    let newUser = new User();

                    newUser.facebook.id = profile.id;
                    newUser.facebook.token = token;
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
        });
    }));

    // local signup
    passport.use('local-signup', new LocalStrategy({

        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true

    },
    (req, email, password, done) => {

        // async process
        process.nextTick(() => {

            User.findOne({ 'local.email': email }, (err, user) => {

                if (err) {
                    return done(err);
                }

                // check to see if email is already in use
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already in use.'));
                }
                else {

                    let newUser = new User();

                    // set the user's local credentials
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);

                    newUser.save(function(err) {

                        if (err) {
                            throw err;
                        }

                        return done(null, newUser);
                    });
                }
            });
        });
    }));

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    (req, email, password, done) => {

        // find user entry matching forms email
        User.findOne({ 'local.email': email }, (err, user) => {

            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, req.flash('loginMessage', 'User not found'));
            }

            if (!user.validPassword(password)){
                return done(null, false, req.flash('loginMessage', 'Invalid password'));
            }

            return done(null, user);
        })
    }))
};