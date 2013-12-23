Pearson-Api-Sdk-Node
====================

A node version of the Pearson API SDK, the javascript version of which can be found here:  

[Pearson API SDK](http://github.com/PearsonAPI/Pearson-Api-Sdk)  

The documentation there explains how the Apis and SDK work, all of the methods described for the that sdk are available here in index.js.  

There are also examples of an api call using the request library in the index.js file.

```Javascript
var api = PearsonApis.travel(); // Sets up travel api object, no apikey/sandbox access.
var topten = travel.topten; // gets the topten endpoint to query
var searchTerms = { search: "restaurant" }

var searchTopten = topten.getSearchUrl(searchTerms); // This constructs the url with all supplied search parameters and limitations.

request(searchTopten, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) // Here's the results from the api.
  }
});
// This uses the request library to do the fetch from index.js

var getSearchNow = topten.search(searchTerms);
// This uses the restler library in the pearson-sdk.js file, if you're inclined to.
```

This is a starter for ten, please feel free to hack and mod as you see fit.

###### The proxy:

There is a generic proxy included (in ppProxy) to aid keeping the API key separate from client side code, and to use this to route the calls simply specify your proxy when setting up the PearsonApi object:  
NB: You must pass in "byProxy" in as an argument to specify that you are getting the apikey from the ppProxy file.
Also you must add your client IP address to the ipWhitelist file. More info in the ppProxy readme.

```Javascript
	var proxiedApi = PearsonApis.travel("byProxy", "http://myproxy.com");
	// This will change the base url from api.pearson.com tp myproxy.com and append the apikey to any request.
	// There is an example in index.js
```


