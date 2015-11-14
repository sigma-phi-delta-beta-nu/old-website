var http = require("http");
var app = require("../app");

http.createServer(app()).listen(process.argv[2] || 8080);
