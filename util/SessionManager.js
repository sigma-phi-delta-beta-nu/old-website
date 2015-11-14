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
    this.cleanSessions();
    callback(session.sid);
    
  }
  
  // Authenticate a session
  this.authenticate = function(sid, callback) {
    
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
