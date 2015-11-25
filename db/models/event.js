var createSchema = function(Schema) {
  
  // Create the Schema fields
  var eventSchema = new Schema({
    "url": String,
    "author": String,
    "category": String,
    "cost": Number,
    "date": String,
    "description": String,
    "location": String,
    "title": String,
    "picture": String,
    "time": String,
    "type": String,
    "attending": [{
      "name": {
        "first": String,
        "last": String
      },
      "username": String
    }]
  });
  
  // Create the Schema functions
  // Get an event
  eventSchema.statics.get = function(username, url, callback) {
    
    this.findOne({
      "url": url,
    }).exec(function(error, data) {
      
      // Check the result
      if (error) {
        console.log(error);
        callback(null);
        
      // Successful query
      } else {
        
        // Test if user was found
        if (data !== undefined) {
          
          // Make sure this user can view it
          if (data.type === "private" && username === null) {
            callback(null);
          } else {
            callback(data);
          }
          
        } else {
          callback(null);
        }
        
      }
      
    });
  };
  
  // Remove an event
  eventSchema.statics.remove = function(url, callback) {
    
    this.findOne({ "url": url }).exec(function(error, data) {
      if (error) {
        console.log(error);
        callback();
      } else {
        data.remove(function() {
          callback();
        });
      }
    });
    
  };
  
  // Add an attendee to an event
  eventSchema.statics.addAttendee = function(url, attendee, callback) {
    
    this.findOne({ "url": url }).exec(function(error, data) {
      if (error) {
        console.log(error);
        callback(false);
      } else {
        data.attending.push(attendee);
        data.save(function() {
          callback(true);
        });
      }
    });
    
  };
  
  // Remove an attendee from an event
  eventSchema.statics.removeAttendee = function(url, attendee, callback) {
    
    this.findOne({ "url": url }).exec(function(error, data) {
      if (error) {
        console.log(error);
        callback(false);
      } else {
        var attendees = [];
        for (var i = 0; i < data.attending.length; i++) {
          if (data.attending[i].username !== attendee) {
            attendees.push(data.attending[i]);
          }
        }
        if (attendees.length === data.attending.length) {
          callback(false);
        } else {
          data.attending = attendees;
          data.save(function() {
            callback(true);
          });
        }
      }
    });
    
  };
  
  // Get events, sorted by category
  eventSchema.statics.getCategories = function(username, callback) {
    
    var searchParams;
    if (username) {
      searchParams = {};
    } else {
      searchParams = { "type": "public" };
    }
    
    this.find(searchParams).exec(function(error, data) {
      if (error) {
        console.log(error);
        callback([]);
      } else {
        var result = {};
        for (var i = 0; i < data.length; i++) {
          var categories = Object.keys(result);
          var found = false;
          for (var j = 0; j < categories.length; j++) {
            if (categories[j] === data[i].category) {
              found = true;
            }
          }
          if (found) {
            result[data[i].category].push(data[i]);
          } else {
            result[data[i].category] = [data[i]];
          }
        }
        callback(result);
      }
    });
    
  };
  
  return eventSchema;
  
};

module.exports = createSchema;
