var createSchema = function(Schema) {
  
  // Create the Schema fields
  var userSchema = new Schema({
    "name": {
      "first": String,
      "last": String
    },
    "username": String,
    "password": String,
    "links": [
      {
        "name": String,
        "url": String
      }
    ],
    "events": []
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

  userSchema.statics.addLink = function(name, url, callback) {
    
    
    
  };
  
  return userSchema;
  
};

module.exports = createSchema;
