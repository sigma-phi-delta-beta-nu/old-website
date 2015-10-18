var app = require('../../app');
var config = require("../../config");
var http = require('http');
var minifier = require("../../util/minifier.js");

minifier();

http.createServer(app).listen(config.dev_port);

console.log("Test server started.");
