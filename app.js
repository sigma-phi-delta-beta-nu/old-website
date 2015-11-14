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
  
  // Create application
  var app = express();
  
  // Templating engine
  app.set("views", __dirname + "/views");
  app.set("view engine", "ejs");
  
  // Middleware
  app.use(favicon(__dirname + "/public/images/favicon.ico"));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  
  // Create context for url mapping controllers
  var context = {
    "models": {
      "User": mongoose.model("User", userSchema)
    },
    "sessionManager": sessionManager,
    "sanitizer": sanitizer
  };
  
  // Serve mapped urls
  app.use("/", renderController(express.Router(), context));
  app.use("/", apiController(express.Router(), context));
  app.use(express.static(__dirname + "/public"));

  // Serve unmapped urls
  app.use(function(request, response) {
    response.render("error", {
      title: "error",
      user: null,
    });
  });
  
  return app;
  
};

module.exports = createApplication;
