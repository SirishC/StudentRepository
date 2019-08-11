var express = require("express");
var router = express.Router();
var projDetails = require("../models/projDetails");
var fileUpload = require("express-fileupload");
var fs = require("fs");


var app = express();

app.use(fileUpload());

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


router.get("/", function (req, res) {
    res.render("addProj", {title: "express"});
    console.log("Displaying Addproj!")

});

router.post("/", function (req, res, next) {
    //get form details and process
    console.log("Proj Uploading");

    let guidenames = req.body["guidenames[]"];
    if (Array.isArray(guidenames)) guidenames.pop();
    let tmnames = req.body["tmnames[]"];
    if (Array.isArray(tmnames)) tmnames.pop();
    let tmemail = req.body["tmemails[]"];
    if (Array.isArray(tmemail)) tmemail.pop();
    let tmnum = req.body["tmnums[]"];
    if (Array.isArray(tmnum)) tmnum.pop();

    console.log(guidenames);
    var projInfo = {
        title: req.body.title,
        domain: req.body.domain,
        hwReq: req.body.hwreqtextarea,
        swReq: req.body.swreqtextarea,
        guideNames: guidenames,
        tmName: tmnames,
        tmEmail: tmemail,
        tmNum: tmnum,
        plagPercent: req.body.plagpercent,
        author: req.session.userId
    };

    console.log("Got All Files!");
    getEverythingandUpload(projInfo, req, res, next);

});


async function getEverythingandUpload(projInfo, req, res, next) {

    try {
        var projId;

        await projDetails.create(projInfo, function (err, proj) {
            if (err) {
                var err = new Error('Error not Uploaded!');
                err.status = 400;
                return next(err);
            }
            projId = proj._id;
        });


        //Getting Files
        if (Object.keys(req.files).length === 0) {
            var err = new Error('No files were uploaded.');
            err.status = 400;
            return next(err);
            //return res.status(400).send('No files were uploaded.');
        }

        console.log(req.files);

        let abstract = req.files.abstract;
        let teaminfo = req.files.teaminfo;
        let codeZip = req.files.code;
        let hwswspec = req.files.hwswspec;
        let reportdoc = req.files.reportdoc;
        let ppt = req.files.ppt;
        let plagreport = req.files.plagreport;
        let researchpaper = req.files.researchpaper;
        let proposal = req.files.proposal;


        //GCloud Connection Code
        // const bucketName = 'Name of a bucket, e.g. my-bucket';
        const bucketName = 'nodejs-d0343.appspot.com';
        // const filename = 'Local file to upload, e.g. ./local/path/to/file.txt';
        //const orgfilename = '/Users/ravibalajiaj/Sem-7/NCP/StudentRepository/Student Project Repository/public/temp/abstract';
        //filename embedded inside the upload function
        var startpath = "/Users/ravibalajiaj/Sem-7/NCP/StudentRepository/Student Project Repository/public/temp/";


        await Promise.all([
            abstract.mv(startpath + "abstract"),
            teaminfo.mv(startpath + "teaminfo"),
            codeZip.mv(startpath + "code"),
            hwswspec.mv(startpath + "hwswspec"),
            reportdoc.mv(startpath + "reportdoc"),
            ppt.mv(startpath + "ppt"),
            plagreport.mv(startpath + "plagreport"),
            researchpaper.mv(startpath + "researchpaper"),
            proposal.mv(startpath + "proposal")
        ]);

        console.log("All Files Moved!");

        await Promise.all([
            uploadFile(bucketName, "abstract", projId),
            uploadFile(bucketName, "teaminfo", projId),
            uploadFile(bucketName, "code", projId),
            uploadFile(bucketName, "hwswspec", projId),
            uploadFile(bucketName, "reportdoc", projId),
            uploadFile(bucketName, "ppt", projId),
            uploadFile(bucketName, "plagreport", projId),
            uploadFile(bucketName, "researchpaper", projId),
            uploadFile(bucketName, "proposal", projId)
        ]);

        console.log("All files uploaded!");

        await fs.readdir(startpath, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                //console.log("Name  : " + file);
                fs.unlink(startpath + "" + file, err => {
                    if (err) throw err;
                });
            }
        });

        console.log("Cleared the temp folder!");
        return res.redirect("/home");
    } catch (err) {
        console.log(err);
    }

}

async function uploadFile(bucketName, filetype, projId) {
    var orgfilename = "/Users/ravibalajiaj/Sem-7/NCP/StudentRepository/Student Project Repository/public/temp/" + filetype;
// [START storage_upload_file]
// Imports the Google Cloud client library
    const {Storage} = require('@google-cloud/storage');
    // Creates a client
    const storage = new Storage({
        projectId: 'nodejs-d0343',
        keyFilename: '/Users/ravibalajiaj/Sem-7/NCP/StudentRepository/Student Project Repository/API_KEYS/NodeJS-d8633436f70b.json',
    });
    /**
     * TODO(developer): Uncomment the following lines before running the sample.
     */
// const bucketName = 'Name of a bucket, e.g. my-bucket';
// const filename = 'Local file to upload, e.g. ./local/path/to/file.txt';
// Uploads a local file to the bucket
    try {
        await storage.bucket(bucketName).upload(orgfilename, {
// Support for HTTP requests made with `Accept-Encoding: gzip`
            gzip: true,
// By setting the option `destination`, you can change the name of the
// object you are uploading to a bucket.
            destination: filetype + "_" + projId,
            metadata: {
// Enable long-lived HTTP caching headers
// Use only if the contents of the file will never change
// (If the contents will change, use cacheControl: 'no-cache')
                cacheControl: 'public, max-age=31536000',
            },
        });
        console.log(`${filetype} uploaded to ${bucketName}.`);
    } catch (e) {
        console.log(e);
    }

// [END storage_upload_file]
}

module.exports = router;
