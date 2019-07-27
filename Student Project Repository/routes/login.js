var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.post('/', function(req, res, next) {
    //Check Whether it is login or register
    if (req.body.email &&
        req.body.username &&
        req.body.password &&
        req.body.passwordConf) {

        User.findOne({
            username: req.body.username
        }, function (err, user) {
            if (err) return (err);
            else if (user) {
                return res.render('index', {signupmsg: 'Already User Exists!'});
            }
        });

        console.log("User is registering");
        //Registering is processing
        if (req.body.password !== req.body.passwordConf) {
            // var err = new Error("Passwords do not match!");
            // err.status = 404;
            // res.send("Passwords do not match");
            // return next(err);
            return res.render('index', {signupmsg: 'Passwords do not match!'});

        }

        var userData = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        };

        User.create(userData, function(err, user) {
            if (err) {
                return next(err);
            } else {
                req.session.userId = user._id;
                return res.redirect('/home');
            }
        });

    } else if (req.body.logemail && req.body.logpassword) {

        console.log("User is logging IN");
        User.authenticate(req.body.logemail, req.body.logpassword, function(err, user) {
            if (err || !user) {
                //var err = new Error("Credentials do not match");
                //err.status = 404;
                return res.render('index', {loginmsg: 'Credentials do not match!'});
            } else {
                req.session.userId = user._id;
                return res.redirect('/home');
            }
        })
    } else {
        // var err = new Error("Fill all fields!");
        // err.status = 404;
        // return next(err);
        return res.render('index', {loginmsg: 'Fill all fields!', signupmsg: 'Fill all fields!'});

    }
});

function loginReq(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        var err = new Error('You must be logged in to view this page.');
        err.status = 401;
        return next(err);
    }
}
router.use(loginReq);

// GET route after registering
router.get('/profile', function(req, res, next) {
    User.findById(req.session.userId)
        .exec(function(error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/login/logout">Logout</a>')
                }
            }
        });
});

// GET for logout logout
router.get('/logout', function(req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
            if (err) {
                return next(err);
            } else {
                console.log("User logged Out");
                return res.redirect('/');
            }
        });
    }
});

module.exports = router;