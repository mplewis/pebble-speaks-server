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

function saveSpeeches(speeches, callback) {
  fs.writeFile(config.SPEECH_DATA, JSON.stringify(speeches), callback);
}

var app = express();
app.use(express.bodyParser());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  next();
});

app.get('/', function(req, res) {
  res.send({PennApps: 'Hello, Philly!'});
});

app.get('/speeches', function(req, res) {
  getSpeeches(function(err, data) {
    if (err) {
      callback(err);
      return;
    }
    res.send(data);
  });
});

app.get('/speeches/:speechNum', function(req, res) {
  getSpeeches(function(err, speeches) {
    if (err) {
      callback(err);
      return;
    }
    var speechNum = req.params.speechNum;
    if (speechNum >= speeches.length) {
      res.send(404, {error: 'Speech ' + speechNum + ' does not exist'});
      return;
    }
    var speech = speeches[speechNum];
    res.send(speech);
  });
});

app.post('/speeches', function(req, res) {
  getSpeeches(function(err, speeches) {
    if (err) {
      res.send(500, err);
      return;
    }
    var contentType = req.get('Content-Type');
    var newSpeechData;
    if (contentType === 'application/x-www-form-urlencoded') {
      if (!('speechData' in req.body)) {
        res.send(400, {error: 'No speechData found in form post'});
        return;
      }
      newSpeechData = JSON.parse(req.body.speechData);
      speeches.push(newSpeechData);
      saveSpeeches(speeches, function(err) {
        if (err) {
          res.send(500, err);
          return;
        }
        res.send({success: 'Speech created!'});
      });
    } else if (contentType === 'application/json') {
      newSpeechData = req.body;
      speeches.push(newSpeechData);
      saveSpeeches(speeches, function(err) {
        if (err) {
          res.send(500, err);
          return;
        }
        res.send({success: 'Speech created!'});
      });
    } else {
      res.send(403, {error: 'Content-Type not supported'});
    }
  });
});

app.put('/speeches/:speechNum', function(req, res) {
  getSpeeches(function(err, speeches) {
    if (err) {
      res.send(500, err);
      return;
    }
    var speechNum = req.params.speechNum;
    if (speechNum >= speeches.length) {
      res.send(404, {error: 'Speech ' + speechNum + ' does not exist'});
      return;
    }
    var contentType = req.get('Content-Type');
    var newSpeechData;
    if (contentType === 'application/x-www-form-urlencoded') {
      if (!('speechData' in req.body)) {
        res.send(400, {error: 'No speechData found in form post'});
        return;
      }
      newSpeechData = JSON.parse(req.body.speechData);
      speeches[speechNum] = newSpeechData;
      saveSpeeches(speeches, function(err) {
        if (err) {
          res.send(500, err);
          return;
        }
        res.send({success: 'Speech ' + speechNum + ' saved!'});
      });
    } else if (contentType === 'application/json') {
      newSpeechData = req.body;
      speeches[speechNum] = newSpeechData;
      saveSpeeches(speeches, function(err) {
        if (err) {
          res.send(500, err);
          return;
        }
        res.send({success: 'Speech ' + speechNum + ' saved!'});
      });
    } else {
      res.send(403, {error: 'Content-Type not supported'});
    }
  });
});

app.delete('/speeches/:speechNum', function(req, res) {
  getSpeeches(function(err, speeches) {
    if (err) {
      res.send(500, err);
      return;
    }
    var speechNum = req.params.speechNum;
    if (speechNum >= speeches.length) {
      res.send(404, {error: 'Speech ' + speechNum + ' does not exist'});
      return;
    }
    speeches.splice(speechNum, 1);
    saveSpeeches(speeches, function(err) {
      if (err) {
        res.send(500, err);
        return;
      }
      res.send({success: 'Speech ' + speechNum + ' deleted!'});
    });
  });
});

app.listen(3000);
