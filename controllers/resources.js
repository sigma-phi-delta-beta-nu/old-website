var resourceRouter = function(router) {
  
  var fs = require("fs");
  
  router.get("favicon.ico", function(request, response) {
    var stream = fs.createReadStream(__dirname + "/../public/images/favicon.ico");
    stream.pipe(response);
  });
  
  router.get("/css/*", function(request, response) {
    var filename = request.url.substring(5, request.url.length);
    var stream = fs.createReadStream(__dirname + "/../public/css/" + filename);
    stream.pipe(response);
  });
  
  router.get("/js/*", function(request, response) {
    var filename = request.url.substring(4, request.url.length);
    var stream = fs.createReadStream(__dirname + "/../public/js/" + filename);
    stream.pipe(response);
  });
  
  router.get("/images/*", function(request, response) {
    var filename = request.url.substring(8, request.url.length);
    var stream = fs.createReadStream(__dirname + "/../public/images/" + filename);
    stream.pipe(response);
  });
  
  return router;
  
};

module.exports = resourceRouter;
