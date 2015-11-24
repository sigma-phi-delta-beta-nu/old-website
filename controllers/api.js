var apiController = function(router, context) {
  
  router.post("/login", function(request, response) {
    
    var username = request.body.username;
    var password = request.body.password;
    
    // Check if user is in the database
    context.models.User.login(username, password, function(user) {
      
      var success;
      
      // If they are, create a cookie
      if (user !== null) {
        context.sessionManager.add(user, function(sid) {
          response.cookie("sid", sid, { "maxAge": 100 * 60 * 60 * 24 });
          response.end(JSON.stringify({ "success": true }));
        });
      } else {
        response.end(JSON.stringify({ "success": false }));
      }
      
    });
    
  });
  
  router.get("/logout", function(request, response) {
    
    if (request.cookies === null) {
      response.end(JSON.stringify({ "success": false }));
      return;
    }
    
    context.sessionManager.remove(request.cookies["sid"], function() {
      response.clearCookie("sid");
      response.end(JSON.stringify({ "success": true }));
    });
    
  });
  
  router.post("/addLink", function(request, response) {
    
    context.sessionManager.authenticate(request.cookies, function(user) {
      
      var username = (user) ? user.username : null;
      var label = request.body.label;
      var url = request.body.url;
      
      context.models.User.addLink(username, label, url, function(updated) {
        if (updated) {
          context.sessionManager.update([updated], function(success) {
            response.end(JSON.stringify({ "success": success }));
          });
        } else {
          response.end(JSON.stringify({ "success": false }));
        }
      });
      
    });
    
  });
  
  router.post("/removeLink", function(request, response) {
    
    context.sessionManager.authenticate(request.cookies, function(user) {
      
      var username = (user) ? user.username : null;
      var label = request.body.label;
      var url = request.body.url;
      
      context.models.User.removeLink(username, label, url, function(updated) {
        if (updated) {
          context.sessionManager.update([updated], function(success) {
            response.end(JSON.stringify({ "success": success }));
          });
        } else {
          response.end(JSON.stringify({ "success": false }));
        }
      });
      
    });
    
  });
  
  router.post("/addEvent", function(request, response) {
    
    context.sessionManager.authenticate(request.cookies, function(user) {
      
      var category = request.body.category;
      var cost = request.body.cost;
      var date = request.body.date;
      var description = request.body.description;
      var location = request.body.location;
      var title = request.body.name;
      var picture = "/event_default.jpg";
      var time = request.body.time;
      var type = request.body.type.toLowerCase();
      var url = request.body.url;
      
      var newEvent = {
        "category": category,
        "cost": cost,
        "date": date,
        "description": description,
        "location": location,
        "title": title,
        "picture": picture,
        "time": time,
        "type": type,
        "url": url,
        "author": user.username,
        "attending": [{
          "name": {
            "first": user.name.first,
            "last": user.name.last
          },
          "username": user.username
        }]
      }
      
      new context.models.Event(newEvent).save(function() {
        user.addEvent(newEvent.title, newEvent.url, function() {
          response.end(JSON.stringify({ "success": true }));
        });
      });
      
    });
      
  });
  
  router.post("/removeEvent", function(request, response) {
    
    var url = request.body.url;
    context.models.Event.remove(url, function() {
      context.models.User.removeEventFromAll(url, function(users) {
        if (users) {
          context.sessionManager.update(users, function(success) {
            response.end(JSON.stringify({ "success": success }));
          });
        } else {
          response.end(JSON.stringify({ "success": false }));
        }
      });
    });
    
  });
  
  router.post("/addAttendee", function(request, response) {
    
    context.sessionManager.authenticate(request.cookies, function(user) {
      
      var url = request.body.url;
      var title = request.body.title;
      var attendee = {
        "name": {
          "first": user.name.first,
          "last": user.name.last
        },
        "username": user.username
      };
      
      context.models.Event.addAttendee(url, attendee, function(success) {
        if (success) {
          user.addEvent(title, url, function() {
            response.end(JSON.stringify({ "success": true }));
          });
        } else {
          response.end(JSON.stringify({ "success": false }));
        }
      });
      
    });
    
  });
  
  router.post("/removeAttendee", function(request, response) {
    
    context.sessionManager.authenticate(request.cookies, function(user) {
      
      var url = request.body.url;
      var attendee = user.username;
      
      context.models.Event.removeAttendee(url, attendee, function(success) {
        if (success) {
          user.removeEvent(url, function() {
            response.end(JSON.stringify({ "success": true }));
          });
        } else {
          response.end(JSON.stringify({ "success": false }));
        }
      });
      
    });
    
  });
  
  return router;
  
};

module.exports = apiController;
