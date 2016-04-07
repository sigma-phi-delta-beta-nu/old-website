var renderController = function(router, context) {

  var auth = context.sessionManager.authenticate;
  var User = context.models.User;
  var Event = context.models.Event;
  var Photo = context.models.Photo;

  /* GET home page */
  router.get("/", function(request, response) {
    auth(request.cookies, function(user) {
      response.render("home", {
        "page": "content/home",
        "user": user
      });
    });
  });
  
  /* GET login page */
  router.get("/login", function(request, response) {
    auth(request.cookies, function(user) {
      response.render("template", {
        "page": "content/login",
        "user": user,
        "styles": []
      });
    });
  });
  
  /* GET about us page */
  router.get("/about_us", function(request, response) {
    auth(request.cookies, function(user) {
      User.getClasses(function(classes) {
        response.render("template", {
          "page": "content/about_us",
          "user": user,
          "classes": classes,
          "styles": ["/assets/css/about.css"]
        });
      });
    });
  });

  /* GET recruitment page */
  router.get("/recruitment", function(request, response) {
    auth(request.cookies, function(user) {
      response.render("template", {
        "page": "content/recruitment",
        "user": user,
        "styles": ["/assets/css/recruitment.css"]
      });
    });
  });

  /* GET events page */
  router.get("/events", function(request, response) {
    auth(request.cookies, function(user) {
      var username = (user) ? user.username : null;
      Event.getCategories(username, function(events) {
        response.render("template", {
          "page": "content/events",
          "user": user,
          "events": events,
          "styles": ["/assets/css/events.css"]
        });
      });
    });
  });

  /* GET new event form page */
  router.get("/new_event", function(request, response) {
    auth(request.cookies, function(user) {
      if (user !== null) {
        response.render("template", {
          "page": "content/new_event",
          "user": user,
          "styles": []
        });
      } else {
        response.render("template", {
          "page": "content/home",
          "user": user
        });
      }
    });
  });

  /* GET single event page */
  router.get("/events/*", function(request, response) {
    auth(request.cookies, function(user) {
      var username = (user) ? user.username : null;
      var path = request.path.substring(7, request.path.length);
      Event.get(username, path, function(eventFound) {
        response.render("template", {
          "page": "content/event",
          "user": user,
          "event": eventFound,
          "styles": []
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
          "page": "content/gallery",
          "user": user,
          "gallery": albums,
          "styles": ["/assets/css/gallery.css"]
        });
      });
    });
  });

  /* GET new photo page */
  router.get("/new_photo", function(request, response) {
    auth(request.cookies, function(user) {
      response.render("template", {
        "page": "content/new_photo",
        "user": user,
        "styles": []
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
            "page": "content/album",
            "user": user,
            "album": album,
            "styles": ["/assets/css/gallery.css"]
          });
        });
      } else {
        // Query a single photo
        var imagePath = path.substring(imageIndex, path.length);
        Photo.get(username, imagePath, function(photoFound) {
          response.render("template", {
            "page": "content/photo",
            "user": user,
            "photo": photoFound,
            "styles": ["/assets/css/photo.css"]
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
          "page": "content/contact_us",
          "user": user,
          "positions": positions,
          "styles": []
        });
      });
    });
  });

  /* GET profile page */
  router.get("/dashboard", function(request, response) {
    auth(request.cookies, function(user) {
      if (user === null) {
        response.render("template", {
          "page": "content/home",
          "user": user
        });
      } else {
        response.render("template", {
          "page": "content/dashboard",
          "user": user,
          "styles": []
        });
      }
    });
  });

  /* GET roster */
  router.get("/roster", function(request, response) {
    auth(request.cookies, function(user) {
      if (user === null) {
        response.render("template", {
          "page": "content/home",
          "user": user
        });
      } else {
        User.getAllPrivate(function(roster) {
          response.render("template", {
            "page": "content/roster",
            "user": user,
            "roster": roster,
            "styles": [ "/assets/css/roster.css" ]
          });
        });
      }
    });
  });

  return router;

};

module.exports = renderController;
