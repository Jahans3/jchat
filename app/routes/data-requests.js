/**
 * Created by jahansj on 16/06/2016.
 */
"use strict";



module.exports = function (router) {

    /* check if user is logged in */
    function isLoggedInNoRedirect (req, res, next) {

        if (req.isAuthenticated()) {

            return next()
        }
        else {

            res.send('jChat');
        }
    }


    /* pass user data to the app */
    router.get('/username_request', isLoggedInNoRedirect, (req, res) => {


        if (!req.user.local.email) {
            res.send('Guest')
        }


        let response = req.user.local.email;
        let accounts = [req.user.facebook.name, req.user.google.email, req.user.twitter.name];

        let i = 0;

        while (response === undefined) {

            response = accounts[i];
            i++;

            if (i > 2) {
                response = 'Guest';
                break;
            }
        }

        res.send(response);
    });
};