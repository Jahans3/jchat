/**
 * Created by jahansj on 16/06/2016.
 */
"use strict";
const Group = require('../../schema/groups.model');

//TODO - add to userSchema methods
function findUserIdByName (user, username) {

    return user.findOne({ 'local.email': username }, (err, user) => {

        if (err) {
            console.log(err);
        }

        return user._id;
    });
}

module.exports = function (router, passport) {

    /* process a login form */
    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    /* process a signup form */
    router.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    /* process a create group form */
    router.post('/createGroup', (req, res) => {

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
                let friendUser = new Promise((resolve, reject) => {

                    User.findOne({ 'local.email': req.body.friend_name}, (err, user) => {

                        if (err) {
                            reject(err);
                        }

                        resolve(user._id)
                    });
                });

                friendUser.then((userid) => {
                    console.log('promise lol: ' + userid);
                    newGroup.users[1] = {
                        name: req.body.friend_name,
                        userid: userid,//findUserIdByName(req.body.friend_name),
                        admin: req.body.friend_permissions > 4
                    };
                });

                friendUser.catch((err) => {
                    console.log(err);
                });

                newGroup.name = req.body.group_name;
                newGroup.founder = req.body.user_name;

                // group users
                // set creating user as admin
                newGroup.users[0] = {
                    name: req.body.user_name,
                    userid: req.body.user_id,
                    admin: true
                };

                // initial channel
                newGroup.channels[0] = {
                    name: req.body.channel_name,
                    users: []
                };
                newGroup.channels[0].users[0] = {
                    name: req.body.user_name,
                    userid: req.body.user_id,
                    accessLevel: 5
                };
                newGroup.channels[0].users[1] = {
                    name: req.body.friend_name,
                    accessLevel: req.body.friend_permissions,
                    userId: '' //findUserIdByName(req.body.friend_name)
                };

                newGroup.save((err) => {

                    if (err) {
                        throw err;
                    }

                    // query all of user's group and return
                    res.render('groups-manager', { groupData: newGroup });
                });
            }
        });

        //res.send({ groupMessage: 'Request Received' });
    });
};