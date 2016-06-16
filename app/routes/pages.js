/**
 * Created by jahansj on 16/06/2016.
 */


/* check if user is logged in */
function isLoggedIn (req, res, next) {

    if (req.isAuthenticated()){
        return next();
    }

    res.redirect('/');
}

module.exports = function (router) {

    /* GET home page. */
    router.get('/', (req, res) => {
        res.render('index', { title: 'My App' });
    });

    /* GET login page */
    router.get('/login', (req, res) => {
        res.render('login', { message: req.flash('loginMessage') });
    });

    /* GET signup page */
    router.get('/signup', (req, res) => {
        res.render('signup', { message: req.flash('signupMessage') });
    });

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
};