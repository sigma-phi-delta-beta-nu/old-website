var randomstring = require("random-string");

var SessionManager = function() {
  
  // Store sessions
  var sessions = [];

  // Add a session
  this.add = function(user, callback) {
    
    // Create a new session
    var session = {
      "user": user,
      "sid": randomstring({ "length": 16 })
    };
    
    // Add session and clean session list
    sessions.push(session);
    this.clean();
    callback(session.sid);
    
  }
  
  // Authenticate a session
  this.authenticate = function(cookies, callback) {
    
    var sid = "";
    
    if (cookies === null) {
      callback(null);
      return;
    } else {
      sid = cookies["sid"];
    }
    
    // Find the session for this sid (if there is one)
    for (var i = 0; i < sessions.length; i++) {
      if (sessions[i].sid === sid) {
        callback(sessions[i].user);
        return;
      }
    }
    
    // Otherwise, return null
    callback(null);
    
  };
  
  // Update sessions
  this.update = function(users, callback) {
    
    for (var i = 0; i < users.length; i++) {
      var found = false;
      for (var j = 0; j < sessions.length; j++) {
        if (sessions[j].user.username === users[i].username) {
          sessions[j].user = users[i];
          found = true;
          break;
        }
      }
      if (!found) {
        callback(false);
        return;
      }
    }
    
    callback(true);
    
  }
  
  // Remove a session
  this.remove = function(sid, callback) {
    
    var cleanedSessions = []
    
    for (var i = 0; i < sessions.length; i++) {
      if (sessions[i] !== sid) {
        cleanedSessions.push(sessions[i]);
      }
    }
    
    sessions = cleanedSessions;
    callback();
    
  };
  
  // Clean the session list
  this.clean = function() {
    
    // Store clean sessions into a temporary array
    var cleanedSessions = [];
    
    // Find matching values
    for (var i = 0; i < sessions.length; i++) {
      
      // Check for duplicates
      var found = false;
      for (var j = i + 1; j < sessions.length; j++) {
        if (sessions[i].user !== null) {
          if (sessions[i].user.username === sessions[j].user.username) {
            found = true;
          }
        }
      }
      
      // Add session if there are no duplicates
      if (!found) {
        cleanedSessions.push({
          "user": sessions[i].user,
          "sid": sessions[i].sid
        });
      }
      
    }
    
    // Reassign sessions to cleaned array
    sessions = cleanedSessions;
    
  };
  
  return this;
  
};

module.exports = SessionManager;
