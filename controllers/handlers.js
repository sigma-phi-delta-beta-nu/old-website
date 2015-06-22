var express = require("express");
var router = express.Router();

var login = require("../models/auth").login;
var addLink = require("../models/dashboard").addLink;
var removeLink = require("../models/dashboard").removeLink;
var addEvent = require("../models/events").addEvent;
var removeEvent = require("../models/events").removeEvent;
var addAttendee = require("../models/events").addAttendee;
var removeAttendee = require("../models/events").removeAttendee;

router.post("/login", function(request, response) {
  
  var username = request.body.username;
  var password = request.body.password;
  
  login(username, password, function(user) {
    if (user !== null) {
      response.cookie("logged_in", user.username, { maxAge: 100 * 60 * 60 * 24 });
      response.cookie("name", user.name, { maxAge: 100 * 60 * 60 * 24 });
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

router.post("/addEvent", function(request, response) {
  
  var user = {
    "username": request.cookies["logged_in"],
    "name": request.cookies["name"]
  };
  var category = request.body.category.toLowerCase();
  var cost = request.body.cost;
  var date = request.body.date;
  var description = request.body.description;
  var location = request.body.location;
  var name = request.body.name;
  var picture = "/images/event_default.jpg";
  var time = request.body.time;
  var type = request.body.type.toLowerCase();
  var url = name.toLowerCase().replace(/ /g, "_").replace(/'/g, "%27").replace(/\//g, "%2f").replace(/\"/, "%22");
  var newEvent = {
    "category": category,
    "cost": cost,
    "date": date,
    "description": description,
    "location": location,
    "name": name,
    "picture": picture,
    "time": time,
    "type": type,
    "url": url
  }
  
  addEvent(user, newEvent, function() {
    response.end();
  });
  
});

router.post("/removeEvent", function(request, response) {
  
  var url = request.body.url;
  
  removeEvent(url, function() {
    response.end();
  });
  
});

router.post("/addAttendee", function(request, response) {
  
  var url = request.body.url;
  var attendee = {
    "name": request.cookies["name"].replace("_", " "),
    "username": request.cookies["logged_in"]
  };
  
  addAttendee(url, attendee, function() {
    response.end();
  });
  
});

router.post("/removeAttendee", function(request, response) {
  
  var url = request.body.url;
  var attendee = {
    "name": request.cookies["name"].replace("_", " "),
    "username": request.cookies["logged_in"]
  };
  
  removeAttendee(url, attendee, function() {
    response.end();
  });
  
});

module.exports = router;
