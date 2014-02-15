var express = require('express');
var async = require('async');
var glob = require('glob');
var fs = require('fs');

var config = {
  SPEECH_DATA: 'speeches.json'
};

function getSpeeches(callback) {
  fs.readFile(config.SPEECH_DATA, function(err, fileData) {
    if (err) {
      callback(err);
      return;
    }
    callback(null, JSON.parse(fileData));
  });
}

var app = express();

app.get('/', function(req, res) {
  res.send({PennApps: 'Hello, Philly!'});
});

app.get('/speeches', function(req, res) {
  getSpeeches(function() {
    if (err) {
      callback(err);
      return;
    }
    res.send(JSON.parse(fileData));
  });
});

app.get('/speeches/:speechNum', function(req, res) {
  getSpeeches(function(err, speeches) {
    if (err) {
      callback(err);
      return;
    }
    var speechNum = req.params.speechNum;
    var speech = speeches[speechNum];
    console.log(speech);
    res.send(speech);
  });
});

app.listen(3000);
