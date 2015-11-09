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
    "attending": [String]
  });
  
  // Create the Schema functions
  // Get an event
  userSchema.statics.get = function(username, url, callback) {
    
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
  userSchema.methods.remove = function(callback) {
    
  };
  
  // Add an attendee to an event
  userSchema.methods.addAttendee = function(callback) {
    
  };
  
  // Remove an attendee from an event
  userSchema.methods.removeAttendee = function(callback) {
    
  };
  
  // Get events, sorted by category
  userSchema.statics.getByCategories = function(username, callback) {
    
    
    
  };
  
};

module.exports = createSchema;