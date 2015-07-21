var http = require("http");

http.createServer(function(request, response) {
  
  response.writeHead(301, {
    "Location": "https://spdcalpoly.org" + request.url
  });
  response.end();

}).listen(9000);

console.log("Http server started.");
