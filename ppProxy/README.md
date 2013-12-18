Request-Proxy
=============

A simple proxy service for Pearson's Plug & Play APIs, so you can avoid having your API key on every client.


Introduction
------------

Simply routes requests through to Pearson's Plug & Play APIs, with the addition of your API key. This means you can keep your key out of your client-side code and therefore keep it away from any prying eyes.

Built with Node.js and ready to run on Heroku.


How to use
----------

 - Add your API key to the API_KEY variable (near the top of app.js).

 - Add your client's IP addresses to the ipWhitelist file (new line delimited). (Note that this is just a simple example of filtering. For mobile applications it will not be possible for you to filter users of your proxy based on IP addresses. In this case you will probably have something more sophisticated like a login process that the end-users go through. We'll blog more about this...)

 - Run it up locally with 'node app.js' or deploy.

 - If you would like to deploy it to Heroku, see http://devcenter.heroku.com/articles/node-js for details.

 - Then simply take the request that you would have been making to api.pearson.com, and change the host to this proxy server's. You can omit the API key from the request to the proxy.



Disclaimer
----------
This is only intended to be a sample, please modify it according to your requirements :)