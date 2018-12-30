/*
 * Primary file for the API
 *
 */

// Dependencies
const http = require('http');
const url = require('url');

// The server should response to all requests with a string
const server = http.createServer(function(req, res) {

  // Get the URL and parse it
  const parseUrl = url.parse(req.url, true);

  // Get the path from URL
  const path = parseUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Send the response
  res.end("heeloo world\n");

  // Log the request path
  console.log(`request received on path: ${trimmedPath}`)
});

// Start the server, and have it listen on port 3000
server.listen(3000, function() {
  console.log("the server is listening on port 3000");
});
