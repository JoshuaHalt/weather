// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/currentConditions", function (request, response) {
  var url = require('url');
  var url_parts = url.parse(request.url, true);
  var latLng = url_parts.query;
  var query = latLng.lat + "," + latLng.lng;
  
  var wuUrl = 'http://api.wunderground.com/api/448092a36655be00/conditions/q/' + query + '.json';

  httpRequest(wuUrl, function(retval) {
    response.send(retval);
  });
});

app.get("/hourly", function (request, response) {
  var url = require('url');
  var url_parts = url.parse(request.url, true);
  var latLng = url_parts.query;
  var query = latLng.lat + "," + latLng.lng;
  
  var wuUrl = 'http://api.wunderground.com/api/448092a36655be00/hourly/q/' + query + '.json';

  httpRequest(wuUrl, function(retval) {
    response.send(retval);
  });
});

app.get("/forecast", function (request, response) {
  var url = require('url');
  var url_parts = url.parse(request.url, true);
  var latLng = url_parts.query;
  var query = latLng.lat + "," + latLng.lng;
  
  var wuUrl = 'http://api.wunderground.com/api/448092a36655be00/forecast10day/q/' + query + '.json';

  httpRequest(wuUrl, function(retval) {
    response.send(retval);
  });
});

app.get("/searchForLoc", function (request, response) {
  var url = require('url');
  var url_parts = url.parse(request.url, true);
  var query = url_parts.query;
  var locationText = query.loc;
  
  httpRequest("http://autocomplete.wunderground.com/aq?query=" + locationText, function(retval) {
    response.send(retval);
  });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

function httpRequest(url, callBackFunction) {
  var http = require("http");

  http.get(url, function(res){
    var body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
      callBackFunction(JSON.parse(body));
    });
  }).on('error', function(e){
      console.log("Got an error: ", e);
  });
}