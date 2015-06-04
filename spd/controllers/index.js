var express = require("express");
var router = express.Router();

var FullQuerys = require("../models/membership");

/* GET home page */
router.get("/", function(req, res, next) {
  res.render("home", {
    title: "Home",
    error: null,
    user: null
  });
});

/* GET about us page */
router.get("/about_us", function(request, response) {
  FullQuerys.queryPledgeClasses(function(data) {
    response.render("about_us", {
      title: "About Us",
      error: "null",
      user: null,
      members: data
    });
  });
});

/* GET recruitment page */
router.get("/recruitment", function(request, response) {
  response.render("recruitment", {
    title: "Recruitment",
    error: null,
    user: null
  });
});

/* GET contact us page */
router.get("/contact_us", function(request, response) {
  FullQuerys.queryPositions(function(data) {
    response.render("contact_us", {
      title: "Contact Us",
      error: null,
      user: null,
      positions: data
    });
  });
});

/* GET profile page */
router.get("/internal", function(request, response) {
  response.render("external", {
    title: "External",
    user: null,
    error: null
  });
});

module.exports = router;
