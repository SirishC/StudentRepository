var express = require('express');
var router = express.Router();
var projDetails = require("../models/projDetails");


/* GET home page. */
router.get('/', function(req, res, next) {
    projId = req.query.projId;

    console.log("Requing for Proj : " + projId);
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