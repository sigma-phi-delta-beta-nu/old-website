var app = require("../../app");
var https = require("https");
var fs = require("fs");
var minifier = require("../../util/minifier.js");

minifier();

var ssl_options = {
  key: fs.readFileSync(__dirname + "/../keys/ssl.key"),
  cert: fs.readFileSync(__dirname + "/../keys/ssl.crt"),
  ca: fs.readFileSync(__dirname + "/../keys/sub.class1.server.ca.pem")
};

https.createServer(ssl_options, app).listen(9001);

console.log("https server started.");
