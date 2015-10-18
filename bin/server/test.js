var app = require('../../app');
var config = require("../../config");
var http = require('http');

http.createServer(app).listen(config.dev_port);

console.log("Test server started.");
