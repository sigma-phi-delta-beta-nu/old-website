var app = require("../app");
var https = require("https");
var fs = require("fs");

var ssl_options = {
  key: fs.readFileSync(__dirname + "/../keys/server.key"),
  cert: fs.readFileSync(__dirname + "/../keys/server.crt"),
  ca: fs.readFileSync(__dirname + "/../keys/server.ca")
};

https.createServer(ssl_options, app).listen(9001 || process.argv[2]);
