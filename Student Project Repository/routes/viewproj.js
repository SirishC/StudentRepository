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
router.get('/', function(req, res, next) {
    projId = req.query.projId;

    console.log("Requesting for Proj : " + projId);
    var query = {_id: projId};
    projDetails.find(query)
        .then(proj => {
            console.log(proj);
            res.render('viewproj', {title: 'View Projects', data: proj});
        }).catch(err => {
        res.render('viewproj', {title: 'View Projects', data: {}});
    })
});

module.exports = router;