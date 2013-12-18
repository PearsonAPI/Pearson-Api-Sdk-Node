Pearson-Api-Sdk-Node
====================

A node module for the Pearson API SDK, the raw js version of which can be found here:  

[Pearson API SDK](http://github.com/PearsonAPI/Pearson-Api-Sdk)  

The documentation there explains how the Apis and SDK work, all of the methods described are available in index.js ready to be passed into whichever functions or applications you wish.  



###### The proxy:

There is a generic proxy included (in ppProxy) to aid keeping the API key separate from client side code, and to use this to route the calls simply specify your proxy when setting up the PearsonApi object:  

```Javascript
	var proxiedApi = PearsonApis.travel("mySecretKey", "http://myproxy.com");
	// NB this must include both key and proxy address.
	// This will change the base url from api.pearson.com and append the apikey.  
```


