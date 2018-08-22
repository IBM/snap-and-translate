"use strict";

const express = require("express");
const application = express();
const fs = require("fs");
const formidable = require("formidable");
const tesseract = require("node-tesseract");
const LanguageTranslatorV3 = require("watson-developer-cloud/language-translator/v3");

if (fs.existsSync("/opt/lt-service-bind/binding")) {
    const binding = JSON.parse(fs.readFileSync("/opt/lt-service-bind/binding", "utf8"));

    if (binding.username) {
        const languageTranslator = new LanguageTranslatorV3({
        username: binding.username,
        password: binding.password,
        url: binding.url,
        version: "2018-05-01"
      });
    }
    else {
        const languageTranslator = new LanguageTranslatorV3({
        iam_apikey: binding.apikey,
        url: binding.url,
        version: "2018-05-01"
      });
    }
};

application.post("/uploadpic", function (req, result) {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log(err);
        } else {
            const fieldValue =JSON.parse(JSON.stringify(fields));
            const options = {
            l: fieldValue.source,
            psm: 6
            };
            const filePath = JSON.parse(JSON.stringify(files));
            const imgPath = filePath.myPhoto.path;
            tesseract.process(imgPath,options,function(err, ocrtext) {
            if(err) {
                console.log(err);
            } else {
            const parameters = {
            text: ocrtext,
            model_id: fieldValue.modelid
            };
            languageTranslator.translate(parameters,function(error, response) {
            if (error){
            console.log(error);
            }else{
            const labelsvr = JSON.stringify(response.translations[0].translation);
            result.json({data: labelsvr,
                        ocropt: ocrtext});
            }
        });
        }
        });
    }
    });
});
const port = process.env.PORT || process.env.VCAP_APP_PORT || 3000;
application.listen(port, function () {
    console.log("Server running on port: %d", port);
});