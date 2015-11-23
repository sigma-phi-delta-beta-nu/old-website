var renderController = function(router, context) {
  
  var auth = context.sessionManager.authenticate;
  var User = context.models.User;
  var Event = context.models.Event;
  var Photo = context.models.Photo;
  
  /* GET home page */
  router.get("/", function(request, response) {
    auth(request.cookies, function(user) {
      response.render("template", {
        "title": "Home",
        "user": user
      });
    });
  });
  
  /* GET about us page */
  router.get("/about_us", function(request, response) {
    auth(request.cookies, function(user) {
      var username = (user) ? user.username : null;
      User.getClasses(username, function(classes) {
        response.render("template", {
          "title": "About Us",
          "user": user,
          "classes": classes
        });
      });
    });
  });
  
  /* GET recruitment page */
  router.get("/recruitment", function(request, response) {
    auth(request.cookies, function(user) {
      response.render("template", {
        "title": "Recruitment",
        "user": user
      });
    });
  });
  
  /* GET events page */
  router.get("/events", function(request, response) {
    auth(request.cookies, function(user) {
      var username = (user) ? user.username : null;
      Event.getCategories(username, function(events) {
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
    auth(request.cookies, function(user) {
      response.render("template", {
        "title": "New Event",
        "user": user
      });
    });
  });
  
  /* GET single event page */
  router.get("/events/*", function(request, response) {
    auth(request.cookies, function(user) {
      var eventPath = request.path.substring(7, request.path.length);
      var username = (user) ? user.username : null;
      Event.get(username, eventPath, function(eventFound) {
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
    auth(request.cookies, function(user) {
      var username = (user) ? user.username : null;
      Photo.getAlbums(username, function(albums) {
        response.render("template", {
          "title": "Gallery",
          "user": user,
          "gallery": albums
        });
      });
    });
  });
  
  /* GET new photo page */
  router.get("/new_photo", function(request, response) {
    auth(request.cookies, function(user) {
      response.render("template", {
        "title": "New Photo",
        "user": user
      });
    });
  });
  
  /* GET single gallery album or image page */
  router.get("/gallery/*", function(request, response) {
    auth(request.cookies, function(user) {
      var username = (user) ? user.username : null;
      var path = request.path.substring(8, request.path.length);
      var imageIndex = -1;
      for (var i = 0; i < path.length; i++) {
        if (path[i] === "/" && i !== 0) {
          imageIndex = i;
        }
      }
      if (imageIndex === -1) {
        // Query a photo album
        Photo.getAlbum(username, path, function(album) {
          response.render("template", {
            "title": "Album",
            "user": user,
            "album": album,
          });
        });
      } else {
        // Query a single photo
        var imagePath = path.substring(imageIndex, path.length);
        Photo.get(username, imagePath, function(photoFound) {
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
    auth(request.cookies, function(user) {
      User.getPositions(function(positions) {
        response.render("template", {
          "title": "Contact Us",
          "user": user,
          "positions": null
        });
      });
    });
  });
  
  /* GET profile page */
  router.get("/dashboard", function(request, response) {
    auth(request.cookies, function(user) {
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
    auth(request.cookies, function(user) {
      if (user === null) {
        response.render("template", {
          "title": "Home",
          "user": user
        });
      } else {
        User.getAllPrivate(function(roster) {
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
    auth(request.cookies, function(user) {
      response.render("template", {
        "title": "Hackathon",
        "user": user
      });
    });
  });
  
  return router;
  
};

module.exports = renderController;
