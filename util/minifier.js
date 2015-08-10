module.exports = function() {
  
  var minify = require("minify");
  var fs = require("fs");
  
  var parseMinName = function(path) {
    var periodLocation = -1;
    for (var i = path.length - 1; i >= 0; i--) {
      periodLocation = i;
      if (path[i] == ".") {
        break;
      }
    }
    var minName = path.substring(0, periodLocation) + ".min" + path.substring(periodLocation, path.length);
    return minName;
  };
  
  var saveMinified = function(path) {
    minify(path, function(error, data) {
      if (error) console.log(error);
      else {
        var stream = fs.createWriteStream(parseMinName(path));
        stream.write(data);
      }
    });
  };
  
  saveMinified(__dirname + "/../public/css/flexslider.css");
  saveMinified(__dirname + "/../public/css/main.css");
  saveMinified(__dirname + "/../public/css/responsive_large.css");
  saveMinified(__dirname + "/../public/css/responsive_small.css");
  saveMinified(__dirname + "/../public/js/jquery.cookie.js");
  saveMinified(__dirname + "/../public/js/main.js");
  saveMinified(__dirname + "/../public/js/sha256.js");
  saveMinified(__dirname + "/../public/js/jquery.flexslider.js");
  saveMinified(__dirname + "/../public/js/jquery.flexslider.start.js");
  
};
