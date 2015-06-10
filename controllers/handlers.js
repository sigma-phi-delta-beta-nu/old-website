var express = require("express");
var router = express.Router();

var login = require("../models/auth").login;
var addLink = require("../models/dashboard").addLink;
var removeLink = require("../models/dashboard").removeLink;

router.post("/login", function(request, response) {
  
  var username = request.body.username;
  var password = request.body.password;
  
  login(username, password, function(user) {
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

router.post("/addLink", function(request, response) {
  
  var username = request.cookies["logged_in"];
  var label = request.body.label;
  var url = request.body.url;
  
  addLink(username, label, url, function() {
    response.end();
  });
  
});

router.post("/removeLink", function(request, response) {
  
  var username = request.cookies["logged_in"];
  var label = request.body.label;
  var url = request.body.url;
  
  removeLink(username, label, function() {
    response.end();
  });
  
});

module.exports = router;
