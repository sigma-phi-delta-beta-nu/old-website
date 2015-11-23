var createSchema = function(Schema) {
  
  // Create the Schema fields
  var userSchema = new Schema({
    "firstname": String,
    "lastname": String,
    "class": String,
    "username": String,
    "password": String,
    "links": [
      {
        "name": String,
        "url": String
      }
    ]
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
    
    // Do mad stuffs
    this.update(
      {"username" : username},
      {$push: {"links" : {"name" : name, "url" : url}}}, 
      {upsert:true}, 
      function(err, data) {
        if(err) { console.log(err); }
      }
      );

  };

  userSchema.statics.removeLink = function(username, name, url, callback) {

    this.update(
      {"username" : username},
      {$pull : {"links" : {"name" : name, "url" : url}}},
      {safe : true},
      function(err, data) {
        if(err) { console.log(err); }
      }
      );

  };
 
  userSchema.statics.getClasses = function(callback) {

    var classes = {};
    this.find({}, "firstname lastname class", function(err, users){
      users.forEach(function(user){
        var keys = Object.keys(classes);
        var found = false;
        keys.forEach(function(className){
           if(user.class === className) { found = true; }
        });
        if(found) {
          classes(user.class).push(user);
        }
        else {
          classes(user.class) = [user];
        }
      });
      callback(classes);
    });

  };
 
  return userSchema;
  
};

module.exports = createSchema;
