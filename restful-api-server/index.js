/*
 * Primary file for the API
 *
 */

// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');

console.log(config);

// The server should response to all requests with a string
const server = http.createServer(function(req, res) {

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

      console.log("returning the response: ", statusCode, payloadString);
    });
  });
});

// Start the server, and have it listen on port config.port
server.listen(config.port, function() {
  console.log("the server is listening on port : ", config.port);
});

// Define the handlers
const handler = {};

// Sample handler
handler.sample = function(data, callback) {
  // Callback a http status cod, and a payload object
  callback(406, { name: 'sample handler' });
};

// Not found handler
handler.notFound = function(data, callback){
  callback(404);
};

// Define a request router
const router = {
  sample: handler.sample
}
