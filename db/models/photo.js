var createSchema = function(Schema) {
  
  // Create the Schema fields
  var photoSchema = new Schema({
    "title": String,
    "caption": String,
    "url": String,
    "album": String,
    "type": String
  });
  
  // Create the Schema functions
  // Get a photo
  photoSchema.statics.get = function(username, url, callback) {
    
    this.findOne({
      "url": url
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
  
  // Get photos from a specific album
  photoSchema.statics.getAlbum = function(username, album, callback) {
    
  };
  
  // Get photos, grouped in albums
  photoSchema.statics.getAlbums = function(username, callback) {
    
  };
  
  return photoSchema;
  
};

module.exports = createSchema;
