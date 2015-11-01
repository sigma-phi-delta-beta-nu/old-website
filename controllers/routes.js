var express = require("express");
var router = express.Router();

var authenticate = require("../models/auth").authenticate;
var queryMembershipByNames = require("../models/membership").queryNames;
var queryMembershipByClasses = require("../models/membership").queryClasses;
var queryMembershipByPositions = require("../models/membership").queryPositions;
var queryEventsByCategories = require("../models/events").queryCategories;
var queryEvent = require("../models/events").queryEvent;
var queryPhotoAlbums = require("../models/gallery").queryAlbums;
var queryPhotoAlbum = require("../models/gallery").queryAlbum;
var queryPhoto = require("../models/gallery").queryPhoto;

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

/* GET new event form page */
router.get("/new_event", function(request, response) {
  authenticate(request.cookies, function(user) {
    response.render("template", {
      "title": "New Event",
      "user": user
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

/* GET new photo page */
router.get("/new_photo", function(request, response) {
  authenticate(request.cookies, function(user) {
    response.render("template", {
      "title": "New Photo",
      "user": user
    });
  });
});

/* GET single gallery album or image page */
router.get("/gallery/*", function(request, response) {
  authenticate(request.cookies, function(user) {
    var path = request.path.substring(9, request.path.length);
    var imageIndex = path.indexOf("/");
    if (imageIndex === -1) {
      // Query a photo album
      queryPhotoAlbum(user, path, function(albumFound) {
        response.render("template", {
          "title": "Album",
          "user": user,
          "album": albumFound,
          "albumUrl": path
        });
      });
    } else {
      // Query a single photo
      var imagePath = path.substring(imageIndex + 1, path.length);
      queryPhoto(user, imagePath, function(photoFound) {
        response.render("template", {
          "title": "Photo",
          "user": user,
          "photo": photoFound
        });
      });
    }
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
    if (user === null) {
      response.render("template", {
        "title": "Home",
        "user": user
      });
    } else {
      response.render("template", {
        "title": "Dashboard",
        "user": user
      });
    }
  });
});

/* GET roster */
router.get("/roster", function(request, response) {
  authenticate(request.cookies, function(user) {
    if (user === null) {
      response.render("template", {
        "title": "Home",
        "user": user
      });
    } else {
      queryMembershipByNames(function(roster) {
        response.render("template", {
          "title": "Roster",
          "user": user,
          "roster": roster
        });
      });
    }
  });
});

/* GET hackathon page */
router.get("/jquery_hackathon", function(request, response) {
  authenticate(request.cookies, function(user) {
    response.render("template", {
      "title": "Hackathon",
      "user": user
    });
  });
});

module.exports = router;
