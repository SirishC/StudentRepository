var express = require('express');
var router = express.Router();
var projDetails = require("../models/projDetails");


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
router.get('/', function (req, res, next) {
    res.render('searchproj', {title: 'Search Projects', data: []});
});


router.post('/', function (req, res, next) {


    console.log("Query : " + req.body.searchQuery);

    if (req.body.searchQuery.toString().trim().length === 0) {
        projDetails.find()
            .then(projDetails => {
                res.render('searchproj', {data: projDetails});
            }).catch(err => {
            console.log(err);
            res.render('searchproj', {data: []});

        })
    } else {

        projDetails.find(
            {$text: {$search: req.body.searchQuery}},
            {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}}
        ).then(projDetails => {
            console.log(projDetails);
            res.render('searchproj', {data: projDetails});
        }).catch(err => {
            console.log(err);
            res.render('searchproj', {data: []});
        })
    }

});
module.exports = router;