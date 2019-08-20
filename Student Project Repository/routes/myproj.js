var express = require('express');
var router = express.Router();
// connection to the schema.
var projDetails = require("../models/projDetails");
var userDetails = require("../models/user");

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

/* GET home page. */
router.get('/', function(req, res, next) {

    var query = {author: req.session.userId};
    console.log(query);
    projDetails.find(query)
        .then(projDetails => {
            userDetails.find({_id: req.session.userId}).then(userinfo => {
                console.log(projDetails);
                res.render('myproj', {title: 'My Projects', data: projDetails, user: userinfo});
            }).catch(err => {
                console.log(err);
                res.render('myproj', {title: 'My Projects', data: []});
            })
        }).catch(err => {
        console.log(err);
        res.render('myproj', {title: 'My Projects', data: []});
    })

});

module.exports = router;