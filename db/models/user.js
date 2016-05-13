var createSchema = function(Schema) {
  
  // Create the Schema fields
  var userSchema = new Schema({
    "name": {
      "first": String,
      "last": String
    },
    "nickname": String,
    "class": String,
    "email": String,
    "phone": String,
    "birthday": String,
    "currentAddress": String,
    "currentCity": String,
    "currentState": String,
    "currentPostal": String,
    "homeAddress": String,
    "homeCity": String,
    "homeState": String,
    "homePostal": String,
    "username": String,
    "password": String,
    "links": [{
      "name": String,
      "url": String
    }],
    "events": [{
      "name": String,
      "url": String
    }],
    "positions": [String]
  });
  
  // Create the Schema functions
  // Login a user
  userSchema.statics.login = function(username, password, callback) {
    
    // Execute a query
    this.findOne({
      "username": username,
      "password": password
    }).exec(function(error, data) {
      
      // Check the result
      if (error) {
        console.log(error);
        callback(null);
        
      // Successful query
      } else {
        // Test if user was found
        if (data !== undefined) {
          callback(data);
        } else {
          callback(null);
        }
      }
      
    });
    
  };
  
  userSchema.statics.addLink = function(username, name, url, callback) {
    
    if (!username) {
      callback(false);
      return;
    }
    
    this.findOne({ "username": username }).exec(function(error, user) {
      if (error) {
        console.log(error);
        callback(false);
      } else {
        var found = false;
        for (var i = 0; i < user.links.length; i++) {
          if (user.links[i].name === name) {
            found = true;
            user.links[i].url = url;
          }
        }
        if (!found) {
          user.links.push({
            "name": name,
            "url": url
          });
        }
        user.save(function() {
          callback(user);
        });
      }
    });
    
  };

  userSchema.statics.removeLink = function(username, name, url, callback) {

    if (!username) {
      callback(false);
      return;
    }
    
    this.findOne({ "username": username }).exec(function(error, user) {
      if (error) {
        console.log(error);
        callback(false);
      } else {
        var newLinks = [];
        for (var i = 0; i < user.links.length; i++) {
          if (user.links[i].name !== name) {
            newLinks.push(user.links[i]);
          }
        }
        user.links = newLinks;
        user.save(function() {
          callback(user);
        });
      }
    });
    
  };
  
  userSchema.methods.addEvent = function(name, url, callback) {
    
    this.events.push({
      "name": name,
      "url": url
    });
    
    this.save(function() {
      callback();
    });
    
  }
  
  userSchema.methods.removeEvent = function(url, callback) {
    
    var events = [];
    for (var i = 0; i < this.events.length; i++) {
      if (this.events[i].url !== url) {
        events.push(this.events[i]);
      }
    }
    
    this.events = events;
    this.save(function() {
      callback();
    });
    
  };
  
  userSchema.statics.removeEventFromAll = function(url, callback) {
    
    this.find({ "events.url": url }).exec(function(error, data) {
      if (error) {
        console.log(error);
        callback(false);
      } else {
        var usersUpdated = [];
        for (var i = 0; i < data.length; i++) {
          var events = [];
          for (var j = 0; j < data[i].events.length; j++) {
            if (data[i].events[j].url !== url) {
              events.push(data[i].events[j]);
            }
          }
          data[i].events = events;
          data[i].save();
          usersUpdated.push(data[i]);
        }
        callback(usersUpdated);
      }
    });
    
  };
  
  userSchema.statics.getClasses = function(callback) {

    var classes = {};
    this.find({}, "name.first name.last class", function(err, users){
      users.forEach(function(user){
        var keys = Object.keys(classes);
        var found = false;
        keys.forEach(function(className){
           if(user.class === className) { found = true; }
        });
        if(found) {
           classes[user.class].push(user);
        }
        else {
           classes[user.class] = [user];
        }
      });
      callback(classes);
    });

  };
  
  userSchema.statics.getPositions = function(callback) {
    
    var positions = {};
    this.find({ "positions": { "$not": { "$size": 0 } } })
      .exec(function(error, members) {
      if (error) {
        console.log(error);
        callback(null);
      } else {
        
        var elected = [ "Chief Engineer", "Vice Chief Engineer", "Business Manager", "Secretary", "Historian", "Chaplain", "Pledge Master", "Guide", "Recruitment Chairman" ];
		var electedEmails = [ "chief", "vicechief", "business", "secretary", "historian", "chaplain", "pledge", "guide", "recruitment" ];
        var appointed = [ "Pledge Board Chairman", "Assistant Business Manager", "Social Chairman", "Athletic Chairman", "Engineering Governing Council Representative", "Risk Management Chairman", "Fundraising Chairman", "Webmaster", "Expansion Chairman", "House Manager", "Academic Chairman", "Sergeant-At-Arms", "Brotherhood Chairman", "Philanthropy Chairman" ];
        var appointedEmails = [ "pbc", "abm", "social", "athletic", "egcr", "risk", "fundraising", "webmaster", "expansion", "housemanager", "academic", "sergeant", "brotherhood", "philanthropy" ];
		
        var positions = {
          "elected": [],
          "appointed": []
        };
        
        for (var i = 0; i < elected.length; i++) {
          for (var j = 0; j < members.length; j++) {
            for (var k = 0; k < members[j].positions.length; k++) {
              if (members[j].positions[k] === elected[i]) {
                positions.elected.push({
                  "name": members[j].name,
                  "email": electedEmails[i] + ".spd.calpoly@gmail.com",
                  "position": members[j].positions[k]
                });
              }
            }
          }
        }
        
        for (var i = 0; i < appointed.length; i++) {
          for (var j = 0; j < members.length; j++) {
            for (var k = 0; k < members[j].positions.length; k++) {
              if (members[j].positions[k] === appointed[i]) {
                positions.appointed.push({
                  "name": members[j].name,
                  "email": appointedEmails[i] + ".spd.calpoly@gmail.com",
                  "position": members[j].positions[k]
                });
              }
            }
          }
        }
        
        callback(positions);
        
      }
    });
    
  };
  
  userSchema.statics.getAllPrivate = function(callback) {
    
    this.find({})
      .select("name.first name.last nickname class positions email phone birthday currentAddress currentCity currentState currentPostal homeAddress homeCity homeState homePostal")
      .exec(function(error, data) {
      
      if (error) {
        console.log(error);
        callback(null);
      } else {
        var classes = [ "Founding", "Alpha", "Beta", "Gamma", "Delta" ];
        data.sort(function(a, b) {
          if (classes.indexOf(a.class) != classes.indexOf(b.class)) {
            return classes.indexOf(a.class) - classes.indexOf(b.class);
          }
          if (a.name.first < b.name.first) {
            return -1;
          }
          return 1;
        });
        callback(data);
      }
      
    });
    
  };
  
  return userSchema;
  
};

module.exports = createSchema;
