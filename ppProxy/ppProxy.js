/**
 * A simple proxy example for Plug & Play APIs.
 * It's actually generic and could be used for any other service where you want to hide an API key from the clients.
 */



var fs = require('fs');
var http = require('http');
var https = require('https');
var qs = require('qs');
var url = require('url');

var API_HOST = 'api.pearson.com';

// ** THIS IS WHERE YOU NEED TO KEEP YOUR KEY, NICE AND SAFE - ASSUMING ONLY YOU CAN ACCESS THE SERVER :) **
var API_KEY = 'ApiKey'; // Your api key!

var ipWhitelist = [];

// This is just a very simple example to demonstrate that you can (and should) implement some filtering.
function isIpAddressWhitelisted(ipAddress) {
    for( i in ipWhitelist ) {
        if( ipWhitelist[i] == ipAddress ) {
            return true;
        }
    }

    console.log('IP address ' + ipAddress + ' is NOT in whitelist');
    return false;

};

function updateWhitelist() {

    var ipWhitelistString = fs.readFileSync('ipWhitelist');

    ipWhitelist = ipWhitelistString.toString().split('\n').filter(
        function(line) { 
            return line.length // Only accept lines that have content
        });
}

// Whitelist file can be updated on the fly (no need for a restart)
fs.watchFile('./ipWhitelist', function(curr, prev) {
    updateWhitelist();
});

var proxyServer = http.createServer(function(request, response) {
    
    // NB. Heroku has its own proxies/balancers which affect the remoteAddress, but they supply the original IP as a header
    var originIpAddress = request.headers['x-forwarded-for'] || request.connection.remoteAddress;

    if( isIpAddressWhitelisted(originIpAddress) ) {

        console.log(request.connection.remoteAddress + ': ' + request.method + ' ' + request.url);

        var parsedUrl = qs.parse(url.parse(request.url).query);
        var hasQueryParams = false;

        
        for( var i in parsedUrl ) {
            hasQueryParams = true;
            break;
        }
        
        var proxyOptions = {
            host: API_HOST,
            path: request.url + (hasQueryParams ? '&' : '?') + 'apikey='+API_KEY
        };

        console.log('Proxy path: ' + proxyOptions.path);

        // Pass on the origin IP address to the API
        response.setHeader("x-forwarded-for", originIpAddress);
        response.setHeader("Content-Type", "application/json; charset=UTF-8");
        
        https.get(proxyOptions, function(res) {
            
            res.on('data', function(chunk) {
                response.write(chunk);
            });

            // res.on('error', function(e){
            //     console.log(e);
            // });
            
            res.on('end', function() {
                response.end();
            });
            
        }); 
        
    } else {

        // IP address not in whitelist

        response.writeHead(403);
        response.end('Access Denied. (If you are the owner of this proxy, you may wish to check out the IP address whitelisting).');

    }
    
});

// The PORT environment variable is used by Heroku to tell which port it should run on.
// You can change the default port for developing locally.
var PORT = process.env.PORT || 8080;

proxyServer.listen(PORT);

console.log('Running on port ' + PORT);

updateWhitelist();
