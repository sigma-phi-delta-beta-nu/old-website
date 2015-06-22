var express = require("express");
var router = express.Router();

var authenticate = require("../models/auth").authenticate;
var queryMembershipByClasses = require("../models/membership").queryClasses;
var queryMembershipByPositions = require("../models/membership").queryPositions;
var queryEventsByCategories = require("../models/events").queryCategories;
var queryEvent = require("../models/events").queryEvent;
var queryPhotoAlbums = require("../models/gallery").queryAlbums;

/* GET home page */
router.get("/", function(request, response) {
  authenticate(request.cookies, function(user) {
    response.render("template", {
      "title": "Home",
      "user": user
    });
  });
});

/* GET about us page */
router.get("/about_us", function(request, response) {
  authenticate(request.cookies, function(user) {
    queryMembershipByClasses(function(membership) {
      response.render("template", {
        "title": "About Us",
        "user": user,
        "membership": membership
      });
    });
  });
});

/* GET recruitment page */
router.get("/recruitment", function(request, response) {
  authenticate(request.cookies, function(user) {
    response.render("template", {
      "title": "Recruitment",
      "user": user
    });
  });
});

/* GET events page */
router.get("/events", function(request, response) {
  authenticate(request.cookies, function(user) {
    queryEventsByCategories(user, function(events) {
      response.render("template", {
        "title": "Events",
        "user": user,
        "events": events
      });
    });
  });
});

/* GET single event page */
router.get("/events/*", function(request, response) {
  authenticate(request.cookies, function(user) {
    var eventPath = request.path.substring(8, request.path.length);
    queryEvent(user, eventPath, function(eventFound) {
      response.render("template", {
        "title": "Event",
        "user": user,
        "event": eventFound
      });
    });
  });
});

/* GET gallery page */
router.get("/gallery", function(request, response) {
  authenticate(request.cookies, function(user) {
    queryPhotoAlbums(user, function(gallery) {
      response.render("template", {
        "title": "Gallery",
        "user": user,
        "gallery": gallery
      });
    });
  });
});

/* GET contact us page */
router.get("/contact_us", function(request, response) {
  authenticate(request.cookies, function(user) {
    queryMembershipByPositions(function(positions) {
      response.render("template", {
        "title": "Contact Us",
        "user": user,
        "positions": positions
      });
    });
  });
});

/* GET profile page */
router.get("/dashboard", function(request, response) {
  authenticate(request.cookies, function(user) {
    response.render("template", {
      "title": "Dashboard",
      "user": user
    });
  });
});

module.exports = router;
