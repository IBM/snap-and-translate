"use strict";

const express = require("express");
const application = express();
const fs = require("fs");
const formidable = require("formidable");
const tesseract = require("node-tesseract");
const LanguageTranslatorV3 = require("ibm-watson/language-translator/v3");
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1.js');
require('dotenv').config();

let languageTranslator = new LanguageTranslatorV3({
  version: "2018-05-01"
});

let natural_language_understanding = new NaturalLanguageUnderstandingV1({
  version: '2018-03-16'
});

if (fs.existsSync("/opt/lt-service-bind/binding")) {
  const binding = JSON.parse(fs.readFileSync("/opt/lt-service-bind/binding", "utf8"));
  languageTranslator = new LanguageTranslatorV3({
    iam_apikey: binding.apikey,
    url: binding.url,
    version: "2018-05-01"
  });
}

if (fs.existsSync('/opt/nlu-service-bind/binding')) {
  const nlubinding = JSON.parse(fs.readFileSync('/opt/nlu-service-bind/binding', 'utf8'));

  if (nlubinding.username) {
    natural_language_understanding = new NaturalLanguageUnderstandingV1({
      username: nlubinding.username,
      password: nlubinding.password,
      url: nlubinding.url,
      version: '2018-03-16'
    });
  } else {
    natural_language_understanding = new NaturalLanguageUnderstandingV1({
      iam_apikey: nlubinding.apikey,
      url: nlubinding.url,
      version: '2018-03-16'
    });
  }
}

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
              const params = {
                'text': labelsvr,
                'features': {
                  sentiment: {},
                  emotion: {}
                }
              };
              natural_language_understanding.analyze(params, function (err, nluresponse) {
                if (err) {
                  console.log('error:', err);
                } else {
                  const sentresp = JSON.stringify(nluresponse.sentiment.document.label);
                  console.log(sentresp);
                  const emotoutput = JSON.stringify(nluresponse.emotion.document.emotion);
                  console.log(emotoutput);
                  result.json({
                    data: cleanString,
                    ocropt: ocrtext,
                    sentiment: sentresp,
                    emotion: emotoutput
                  });
                }
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