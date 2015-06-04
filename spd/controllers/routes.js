var express = require("express");
var router = express.Router();

var BatchQuerys = require("../models/batch");
var authenticate = require("../models/item").authenticate;

/* GET home page */
router.get("/", function(request, response) {
  authenticate(request.cookies, function(authenticatedUser) {
    response.render("home", {
      title: "Home",
      error: null,
      user: authenticatedUser
    });
  });
});

/* GET about us page */
router.get("/about_us", function(request, response) {
  authenticate(request.cookies, function(authenticatedUser) {
    BatchQuerys.queryPledgeClasses(function(membership) {
      response.render("about_us", {
        title: "About Us",
        error: null,
        user: authenticatedUser,
        members: membership
      });
    });
  });
});

/* GET recruitment page */
router.get("/recruitment", function(request, response) {
  authenticate(request.cookies, function(authenticatedUser) {
    response.render("recruitment", {
      title: "Recruitment",
      error: null,
      user: authenticatedUser
    });
  });
});

/* GET contact us page */
router.get("/contact_us", function(request, response) {
  authenticate(request.cookies, function(authenticatedUser) {
    BatchQuerys.queryPositions(function(officers) {
      response.render("contact_us", {
        title: "Contact Us",
        error: null,
        user: authenticatedUser,
        positions: officers
      });
    });
  });
});

/* GET profile page */
router.get("/dashboard", function(request, response) {
  authenticate(request.cookies, function(authenticatedUser) {
    response.render("dashboard", {
      title: "Dashboard",
      user: authenticatedUser,
      error: null
    });
  });
});

module.exports = router;
