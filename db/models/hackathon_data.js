var createSchema = function(Schema) {
  
  // Create the Schema fields
  var hackathonDataSchema = new Schema({
    "red": Number,
    "green": Number,
    "blue": Number,
    "list_of_strings": [String],
    "list_of_numbers": [Number],
    "flag": Boolean,
    "age": Number,
    "name": String,
    "time": String,
    "count": Number,
    "description": String,
    "title": String,
    "position": {
      "x": Number,
      "y": Number
    },
    "vector": {
      "x": Number,
      "y": Number
    }
  });
  
  // Create the Schema functions
  hackathonDataSchema.statics.get = function(id, callback) {
    this.findOne({ "_id": id }).exec(function(error, data) {
      if (error || data === undefined) {
        callback(false);
      }
      else {
        callback(data);
      }
    });
  };

  hackathonDataSchema.statics.remove = function(id, callback) {
    this.findOne({ "_id": id }).remove(function(err, removed) {
      callback(err === null);
    });
  };
  
  return hackathonDataSchema;
  
};

module.exports = createSchema;
