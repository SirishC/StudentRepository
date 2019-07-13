var express = require("express");
var router = express.Router();
var User = require("../models/user");

//Check if user exists
function loginReq(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  } else {
    var err = new Error("You must be logged in to view this page.");
    err.status = 401;
    return next(err);
  }
}
router.use(loginReq);

/* GET home page. */
router.get("/", function(req, res, next) {
  User.findById(req.session.userId).exec(function(error, user) {
    if (error) {
      return next(error);
    } else {
      return res.render("home", { username: user.username });
      //return res.send('<h1>Name: </h1>' +  + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/login/logout">Logout</a>')
    }
  });
});

module.exports = router;
