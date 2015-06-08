var express = require("express");
var router = express.Router();

var DBGet = require("../models/get");
var DBUpdate = require("../models/update");

router.post("/login", function(request, response) {
  
  var username = request.body.username;
  var password = request.body.password;
  
  DBGet.login(username, password, function(user) {
    if (user !== null) {
      response.cookie("logged_in", user, { maxAge: 100 * 60 * 60 * 24 });
      response.send(true);
    } else {
      response.send(false);
    }
    response.end();
  });
  
});

router.get("/logout", function(request, response) {
  
  response.clearCookie("logged_in");
  response.send(true);
  response.end();

});

router.get("/addLink", function(request, response) {
  
  var username = request.cookies["logged_in"];
  var label = request.body.label;
  var url = request.body.url;
  
  DBUpdate.addLink(username, label, url, function(result) {
    response.send(result);
    response.end();
  });
  
});

module.exports = router;
