var PearsonApis = require("./lib/pearson-sdk.js");
var request = require ('request');


// Example request with no apikey (sandbox) and no proxy

var travelApi = PearsonApis.travel();
var topten = travelApi.topten;

var requestUrl = topten.getSearchUrl(); // This sets up the parameters and search terms described 

// The request librry performs the get request

request(requestUrl, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) // Here's the results from the api.
} else {
  	console.log(error);
  }
});

// Example request with proxy running on local:8080 - passing byProxy in as an argument to reference the key in the ppProxy file.

var proxApi = PearsonApis.travel("byProxy", "http://localhost:8080");
var proxTopten = proxApi.topten

var proxRequest = proxTopten.getSearchUrl();

request(proxRequest, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) //Here's the results from the api.
  } else {
  	console.log(error);
  }
});




module.exports = require("./lib/pearson-sdk.js"); //to export if you like.


