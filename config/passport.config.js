/**
 * Created by jahansj on 31/05/2016.
 */
"use strict";

const LocalStrategy = require('passport-local').Strategy;
const User = require('../schema/users.model');

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

    // local signup
    passport.use('local-signup', new LocalStrategy({

        usernameField: 'email',
        passwordField: 'password',
        _passReqToCallback: true
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
};