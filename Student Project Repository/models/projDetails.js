var mongoose = require("mongoose");

var projSchema = new mongoose.Schema({
    title : String,
    domain : String,
    hwReq : String,
    swReq : String,
    guideNames : [String],
    tmName : [String],
    tmEmail : [String],
    tmNum : [String],
    plagPercent : Number,
    author: String,
});

var projDetails = mongoose.model('projDetails',projSchema);

module.exports = projDetails;

