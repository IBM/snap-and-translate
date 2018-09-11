"use strict";

const express = require("express");
const application = express();
const fs = require("fs");
const formidable = require("formidable");
const tesseract = require("node-tesseract");
const LanguageTranslatorV3 = require("watson-developer-cloud/language-translator/v3");
require('dotenv').config();

let languageTranslator = new LanguageTranslatorV3({
    version: "2018-05-01"
});

if (fs.existsSync("/opt/lt-service-bind/binding")) {
    const binding = JSON.parse(fs.readFileSync("/opt/lt-service-bind/binding", "utf8"));
    languageTranslator = new LanguageTranslatorV3({
        iam_apikey: binding.apikey,
        url: binding.url,
        version: "2018-05-01"
    });
};

application.get("/", function (req, response) {    
    response.json({
        'message': 'Welcome to Snap and Translate app.'
    })
});

application.post("/uploadpic", function (req, result) {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log(err);
        } else {
            const fieldValue = JSON.parse(JSON.stringify(fields));
            const options = {
                l: fieldValue.source,
                psm: 1
            };
            const filePath = JSON.parse(JSON.stringify(files));
            const imgPath = filePath.myPhoto.path;
            tesseract.process(imgPath, options, function (err, ocrtext) {
                if (err) {
                    console.log(err);
                } else {
                    const parameters = {
                        text: ocrtext.toLowerCase(),
                        model_id: fieldValue.modelid
                    };
                    languageTranslator.translate(parameters, function (error, response) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log(JSON.stringify(response, null, 4));
                            const labelsvr = response.translations[0].translation;
                            console.log(labelsvr);
                            let cleanString = labelsvr.replace(/\n/g, '');                            
                            console.log(cleanString);                                                      
                            result.json({
                                data: cleanString,
                                ocropt: ocrtext
                            });
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