/*
 * Primary file for the API
 *
 */

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const handler = require('./router').handler;
const router = require('./router').router;

// Instantiating the HTTP server
const httpServer = http.createServer(function(req, res) {
  unifiedServer(req, res);
});

// Start the server, and have it listen on port config.port
httpServer.listen(config.httpPort, function() {
  console.log("the server is listening on port : ", config.httpPort);
});

// Read https file content
const httpsServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem')
};

// Instantiating the HTTP server
const httpsServer = https.createServer(httpsServerOptions, function(req, res) {
  unifiedServer(req, res);
});

// Start the server, and have it listen on port config.port
httpsServer.listen(config.httpsPort, function() {
  console.log("the server is listening on port : ", config.httpsPort);
});

// All the server logic for both the http and https server
const unifiedServer = function(req, res) {
  // Get the URL and parse it
  const parseUrl = url.parse(req.url, true);

  // Get the path from URL
  const path = parseUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  const queryStringObject = parseUrl.query;

  // Get the HTTP Method
  const method = req.method.toLowerCase();

  // Get the headers as an object
  const headers = req.headers;

  // Get the payload, if any
  const decoder = new StringDecoder('utf-8');
  var buffer = '';

  req.on('data', function(data){
    buffer += decoder.write(data);
  });

  req.on('end', function() {
    buffer += decoder.end();

    // Choose the handlers
    // If not found then return notFound
    const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handler.notFound;

    // Construct the data object to send to the handler
    const data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: buffer
    };

    // route the request to the handler specified in the router
    chosenHandler(data, function(statusCode, payload) {
      // Use the status code called back by the handler, or default to 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
      // User the payload called by the handler, or default to an empty object
      payload = typeof(payload) == 'object' ? payload : {};

      // Convert the payload to a String
      const payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);

      // Send the response
      res.end(payloadString);
      // Log the request path
      console.log(`request received on path: ${trimmedPath} with method : ${method}`)
      // Log the query string object
      console.log("query string params:", queryStringObject)
      // Log the headers
      console.log("headers:", headers);
      // Log the headers
      console.log("Payload:", buffer);
      // Log the response code & payload
      console.log("returning the response: ", statusCode, payloadString);
    });
  });
};
