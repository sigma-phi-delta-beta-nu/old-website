var app = require("../app")();
var https = require("https");
var fs = require("fs");

var ssl_options = {
  key: fs.readFileSync(__dirname + "/keys/spdcalpoly.key"),
  cert: fs.readFileSync(__dirname + "/keys/spdcalpoly.crt"),
  ca: fs.readFileSync(__dirname + "/keys/spdcalpoly.intermediate.key")
};

https.createServer(ssl_options, app).listen(9001 || process.argv[2]);
