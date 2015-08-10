// Imports
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require("serve-favicon");

var route_controller = require('./controllers/routes');
var handler_controller = require("./controllers/handlers");

var app = express();

// Templating engine
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// Use frameworks
app.use(favicon(__dirname + "/public/images/favicon.ico"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));

// Find route
app.use("/", route_controller);
app.use("/", handler_controller);

// catch 404
app.use(function(request, response) {
  var err = new Error("Page not found.");
  response.status(404);
  response.render("template", {
    title: "Not Found",
    user: null,
    message: err.message,
    error: err
  });
});

module.exports = app;
