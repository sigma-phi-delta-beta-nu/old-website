var express = require("express");
var router = express.Router();

var DBGet = require("../models/get");

/* GET home page */
router.get("/", function(request, response) {
  DBGet.authenticate(request.cookies, function(authenticatedUser) {
    response.render("template", {
      title: "Home",
      user: authenticatedUser
    });
  });
});

/* GET about us page */
router.get("/about_us", function(request, response) {
  DBGet.authenticate(request.cookies, function(authenticatedUser) {
    DBGet.queryPledgeClasses(function(membership) {
      response.render("template", {
        title: "About Us",
        user: authenticatedUser,
        members: membership
      });
    });
  });
});

/* GET recruitment page */
router.get("/recruitment", function(request, response) {
  DBGet.authenticate(request.cookies, function(authenticatedUser) {
    response.render("template", {
      title: "Recruitment",
      user: authenticatedUser
    });
  });
});

/* GET philanthropy page */
router.get("/events", function(request, response) {
  DBGet.authenticate(request.cookies, function(authenticatedUser) {
    response.render("template", {
      title: "Events",
      user: authenticatedUser
    });
  });
});

/* GET philanthropy page */
router.get("/gallery", function(request, response) {
  DBGet.authenticate(request.cookies, function(authenticatedUser) {
    response.render("template", {
      title: "Gallery",
      user: authenticatedUser
    });
  });
});

/* GET contact us page */
router.get("/contact_us", function(request, response) {
  DBGet.authenticate(request.cookies, function(authenticatedUser) {
    DBGet.queryPositions(function(officers) {
      response.render("template", {
        title: "Contact Us",
        user: authenticatedUser,
        positions: officers
      });
    });
  });
});

/* GET profile page */
router.get("/dashboard", function(request, response) {
  DBGet.authenticate(request.cookies, function(authenticatedUser) {
    response.render("template", {
      title: "Dashboard",
      user: authenticatedUser
    });
  });
});

module.exports = router;
