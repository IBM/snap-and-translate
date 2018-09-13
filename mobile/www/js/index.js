/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

document.addEventListener("deviceready",onDevice, false);
function onDevice(){
    
    document.getElementById("captureImage").addEventListener("click",captureImages);
    document.getElementById("photoalbumImage").addEventListener("click",photoalbumImages);
    
    $.getJSON("config.json",function(data){
           format: "json"
        }).done(function(data){
            apiURL = data.SERVER_URL;
        });
    
    
    var win = function (r) {
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
    var Response =  JSON.parse(r.response);
    document.getElementById("tesseractresponse").innerHTML = "&nbsp;OCR Response";
    var ocroutput = Response.ocropt;
    document.getElementById("ocrtext").innerHTML = ocroutput;
    document.getElementById("languagetranslator").innerHTML = "&nbsp;Translation";
    var output = Response.data;
    document.getElementById("translatorresult").innerHTML = output;
    var sentimentop = Response.sentiment;
    sentimentop = sentimentop.replace(/"/g,"");
    document.getElementById("sentiment").innerHTML = "&nbsp;Overall Sentiment:&nbsp;" + sentimentop.toUpperCase();
    document.getElementById("emotion").innerHTML = "&nbsp;Emotion";
    var emotionop = Response.emotion;
    emotionop = emotionop.replace(/{|"|}/g,"");
    emotionop = emotionop.replace(/,/g,"<br>");
    document.getElementById("emotionoutput").innerHTML = emotionop.toUpperCase();
    }
    var fail = function (error) {
    alert("An error has occurred: Code = " + error.code);
    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
    }
//Camera Image Capture
    function captureImages(){
        navigator.camera.getPicture(onSuccess,onFail,{
            quality:100,
            targetWidth: 900,
            targetHeight: 600,
            destinationType: Camera.DestinationType.FILE_URI,
            encodingType: Camera.EncodingType.JPEG,
            correctOrientation: true
   });   
   }
    
 //Photo album image picker
    function photoalbumImages(){
        navigator.camera.getPicture(onSuccess,onFail,{
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: Camera.DestinationType.FILE_URI,
            encodingType: Camera.EncodingType.JPEG,
            correctOrientation: true
   });
}
   function onSuccess(imageData) {
       console.log(imageData);
        var image = document.getElementById("myPhoto");
        image.src = imageData;
        var options = new FileUploadOptions();
        options.fileKey = "myPhoto";
        options.fileName = imageData.substr(imageData.lastIndexOf("/") + 1);
        options.mimeType="image/jpeg";
        options.chunkedMode = false;
       
       var sel = document.getElementById('source');
       var selected = sel.options[sel.selectedIndex];
       var modeid = selected.getAttribute('data-modelid');
       
       options.params = {
            source: document.getElementById("source").value,
            modelid: modeid,
            target: document.getElementById("target").value
        }
       
       console.log(options.params);
        var ft = new FileTransfer();
        ft.upload(imageData,encodeURI(apiURL), win, fail, options);
        }
        function onFail(message) {
        alert("Failed because: " + message);
        }
    

}