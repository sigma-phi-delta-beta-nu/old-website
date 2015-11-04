var http = require("http");

http.createServer(function(request, response) {
  
  response.writeHead(301, {
    "Location": "https://" + request.headers.host + request.url
  });
  response.end();

}).listen(9000 || process.argv[2]);
