var apiController = function(router, context) {
  
  router.post("/login", function(request, response) {
    
    var username = request.body.username;
    var password = request.body.password;
    
    // Check if user is in the database
    context.models.User.login(username, password, function(user) {
      
      // If they are, create a cookie
      if (user !== null) {
        context.sessionManager.add(user, function(sid) {
          response.cookie("sid", sid, { "maxAge": 100 * 60 * 60 * 24 });
          response.send(true);
        });
      } else {
        response.send(false);
      }
      
    });
    
    response.end();
    
  });
  
  router.get("/logout", function(request, response) {
    response.clearCookie("sid");
    response.send(true);
    response.end();
  });
  
  router.post("/addLink", function(request, response) {
    
    var username = context;
    var label = request.body.label;
    var url = request.body.url;
    
    context.models.User.addLink(username, label, url, function(success) {
      response.send(success);
      response.end();
    });
    
  });
  
  router.post("/removeLink", function(request, response) {
    
    var username = request.cookies["logged_in"];
    var label = request.body.label;
    var url = request.body.url;
    
    context.models.User.removeLink(username, label, function(success) {
      response.send(success);
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
    
    addEvent(user, newEvent, function(success) {
      response.send(success);
      response.end();
    });
    
  });
  
  router.post("/removeEvent", function(request, response) {
    /*
    var url = request.body.url;
    
    removeEvent(url, function() {
      response.end();
    });
    */
    response.end();
  });
  
  router.post("/addAttendee", function(request, response) {
    /*
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
    */
    response.end();
  });
  
  return router;
  
};

module.exports = apiController;
