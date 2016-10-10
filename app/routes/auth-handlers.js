/**
 * Created by jahansj on 16/06/2016.
 */


module.exports = function (router, passport) {

    /*
     * Twitter
     */

    /* authenticate twitter */
    router.get('/auth/twitter', passport.authenticate('twitter'));

    /* handle the callback after twitter has authenticated the user */
    router.get('/auth/twitter/callback', passport.authenticate('twitter', {
        successRedirect : '/profile',
        failureRedirect : '/',
        failureFlash: true
    }));

    /* connect a twitter login to account */
    router.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

    /* handle twitter callback */
    router.get('/connect/twitter/callback', passport.authorize('twitter', {
        successRedirect : '/profile',
        failureRedirect : '/'
    }));

    /* unlink a twitter account */
    router.get('/unlink/twitter', function(req, res) {
        var user = req.user;

        user.twitter.token = undefined;

        user.save(function(err) {
            res.redirect('/profile');
        });
    });



    /*
     * Facebook
     */

    /* authenticate facebook user */
    router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

    /* handle the callback after facebook has authenticated the user */
    router.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect : '/profile',
        failureRedirect : '/',
        failureFlash: true
    }));

    /* connect a facebook login to account */
    router.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

    /* handle facebook callback */
    router.get('/connect/facebook/callback', passport.authorize('facebook', {
        successRedirect : '/profile',
        failureRedirect : '/'
    }));

    /* unlink a facebook account */
    router.get('/unlink/facebook', function(req, res) {
        var user = req.user;

        user.facebook.token = undefined;

        user.save(function(err) {
            res.redirect('/profile');
        });
    });




    /*
     * Google
     */

    /* authenticate google */
    router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    /* handle the callback after google has authenticated the user */
    router.get('/auth/google/callback', passport.authenticate('google', {
        successRedirect: '/profile',
        failureRedirect: '/',
        failureFlash: true
    }));

    /* connect a google login to account */
    router.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

    /* handle google callback */
    router.get('/connect/google/callback', passport.authorize('google', {
        successRedirect: '/profile',
        failureRedirect: '/'
    }));

    /* unlink a google account */
    router.get('/unlink/google', function(req, res) {
        var user = req.user;

        user.google.token = undefined;

        user.save(function(err) {
            res.redirect('/profile');
        });
    });




    /*
     * Local
     */

    /* handle local login being connected to account */
    router.get('/connect/local', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    /* connect a local login to account */
    router.get('/connect/local-connect', (req, res) => {
        res.render('connect-local', { message: req.flash('loginMessage') });
    });

    /* unlink a local account */
    router.get('/unlink/local', (req, res) => {

        var user = req.user;

        user.local.email = undefined;
        user.local.password = undefined;

        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};


