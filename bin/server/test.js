var app = require('../../app');
var http = require('http');
var minifier = require("../../util/minifier.js");

minifier();

http.createServer(app).listen(8080);

console.log("Test server started.");
