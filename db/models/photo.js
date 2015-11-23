var createSchema = function(Schema) {
  
  // Create the Schema fields
  var photoSchema = new Schema({
    "title": String,
    "caption": String,
    "album": String,
    "type": String,
    "url": {
      "album": String,
      "photo": String
    }
  });
  
  // Create the Schema functions
  // Get a photo
  photoSchema.statics.get = function(username, url, callback) {
    
    var searchParams;
    if (username) {
      searchParams = { "url.photo": url };
    } else {
      searchParams = {
        "url.photo": url,
        "type": "public"
      };
    }
    
    this.findOne(searchParams).exec(function(error, data) {
      
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
  
  // Get photos from a specific album
  photoSchema.statics.getAlbum = function(username, album, callback) {
    
    var searchParams;
    if (username) {
      searchParams = { "url.album": album };
    } else {
      searchParams = {
        "url.album": album,
        "type": "public",
      }
    }
    
    this.find(searchParams).exec(function(error, data) {
      if (error) {
        console.log(error);
        callback([]);
      } else {
        callback(data);
      }
    });
    
  };
  
  // Get photos, grouped in albums
  photoSchema.statics.getAlbums = function(username, callback) {
    
    var searchParams;
    if (username) {
      searchParams = {};
    } else {
      searchParams = { "type": "public" };
    }
    
    this.find(searchParams).exec(function(error, data) {
      if (error) {
        console.log(error);
        callback(null);
      } else {
        var result = {};
        for (var i = 0; i < data.length; i++) {
          var albums = Object.keys(result);
          var found = false;
          for (var j = 0; j < albums.length; j++) {
            if (albums[i] === data[i].album) {
              found = true;
            }
          }
          if (found) {
            result[data[i].album].push(data[i]);
          } else {
            result[data[i].album] = [data[i]];
          }
        }
        callback(result);
      }
    });
    
  };
  
  return photoSchema;
  
};

module.exports = createSchema;
