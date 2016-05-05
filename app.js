var createApplication = function() {
  
  // Middleware imports
  var express = require("express");
  var cookieParser = require("cookie-parser");
  var bodyParser = require("body-parser");
  var favicon = require("serve-favicon");
  var mongoose = require("mongoose");
  
  // Local imports
  var sessionManager = require(__dirname + "/util/SessionManager")();
  var sanitizer = require(__dirname + "/util/Sanitizer")();
  var renderController = require(__dirname + "/controllers/render");
  var apiController = require(__dirname + "/controllers/api");
  var userSchema = require(__dirname + "/db/models/user")(mongoose.Schema);
  var eventSchema = require(__dirname + "/db/models/event")(mongoose.Schema);
  var photoSchema = require(__dirname + "/db/models/photo")(mongoose.Schema);
  var hackathonDataSchema = require(__dirname + "/db/models/hackathon_data")
    (mongoose.Schema);
  
  // Create application servers
  var app = express();
  mongoose.connect("mongodb://localhost/spd");
  
  // Templating engine
  app.set("views", __dirname + "/views");
  app.set("view engine", "ejs");
  
  // Middleware
  app.use(favicon(__dirname + "/public/assets/images/favicon.ico"));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  
  // Create context for url mapping controllers
  var context = {
    "models": {
      "User": mongoose.model("User", userSchema),
      "Photo": mongoose.model("Photo", photoSchema),
      "Event": mongoose.model("Event", eventSchema),
      "HackathonData": mongoose.model("HackathonData", hackathonDataSchema)
    },
    "sessionManager": sessionManager,
    "sanitizer": sanitizer
  };
  
  // Serve mapped urls
  app.use("/", renderController(express.Router(), context));
  app.use("/", apiController(express.Router(), context));
  app.use("/", express.static(__dirname + "/public"));
  
  // Serve unmapped urls
  app.use(function(request, response) {
    sessionManager.authenticate(request.cookies, function(user) {
      response.render("template", {
        "page": "content/not_found",
        "user": user,
        "styles": []
      });
    });
  });

  return app;
  
};

module.exports = createApplication;
