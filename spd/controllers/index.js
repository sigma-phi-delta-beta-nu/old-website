var express = require("express");
var router = express.Router();

var FullQuerys = require("../models/membership");

/* GET home page */
router.get("/", function(req, res, next) {
  res.render("home", {
    title: "Home",
    error: null
  });
});

/* GET about us page */
router.get("/about_us", function(request, response) {
  FullQuerys.queryPledgeClasses(function(data) {
    response.render("about_us", {
      title: "About Us",
      error: "null",
      members: data,
    });
  });
});

/* GET recruitment page */
router.get("/recruitment", function(request, response) {
  response.render("recruitment", {
    title: "Recruitment",
    error: null
  });
});

/* GET contact us page */
router.get("/contact_us", function(request, response) {
  response.render("contact_us", {
    title: "About Us",
    error: null
  });
});

/* GET profile page */
router.get("/internal", function(request, response) {
  response.render("external", {
    title: "External",
    error: null
  });
});

module.exports = router;
