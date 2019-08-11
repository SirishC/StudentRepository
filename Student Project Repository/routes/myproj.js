var express = require('express');
var router = express.Router();
var projDetails = require("../models/projDetails");

/* GET home page. */
router.get('/', function(req, res, next) {

    var query = {author: req.session.userId};
    console.log(query);
    projDetails.find(query)
        .then(projDetails => {
            console.log(projDetails);
            res.render('myproj', {title: 'My Projects', data: projDetails});
        }).catch(err => {
        console.log(err);
        res.render('myproj', {title: 'My Projects', data: []});
    })

});

module.exports = router;