// Define the handlers
const handler = {};

// Ping handler
handler.ping = function(data, callback) {
  callback(200);
};

// Welcome handler
handler.welcome = function(data, callback) {
  callback(200, { message: 'Hello there, welcome to my learning API server' })
};

// Not found handler
handler.notFound = function(data, callback){
  callback(404);
};

// Define a request router
const router = {
  ping: handler.ping,
  hello: handler.welcome
}

module.exports = {
  handler,
  router
};
