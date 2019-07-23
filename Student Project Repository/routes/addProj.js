var express = require("express");
var router = express.Router();
var projDetails = require("../models/projDetails");

router.get("/", function(req, res, next) {
  res.render("addProj", { title: "express" });
});

router.post("/process_addProj", function(req, res, next) {
  //get form details and process
  console.log("Proj Uploading");

  var projInfo = {
    title: req.body.title,
    domain: req.body.domain,
    hwReq: req.body.hwreqtextarea,
    swReq: req.body.swreqtextarea,
    guideNames: req.body["guidenames[]"],
    tmName: req.body["tmnames[]"],
    tmEmail: req.body["tmemails[]"],
    tmNum: req.body["tmnums[]"],
    plagPercent: req.body.plagpercent
  };

  projDetails.create(projInfo,function(err,proj){
    if(err){
    return next(err);
    }
    else{
        console.log("Successfully Added!");
        return res.redirect('/login/profile');
    }
  });
});

module.exports = router;
