var createSchema = function(Schema) {
  
  // Create the Schema fields
  var linkSchema = new Schema({
    "name": String,
    "url": String
  });
  
  return linkSchema;
  
};

var model = function() {
  var mongoose = require("mongoose");
  return mongoose.model("Link", createSchema(mongoose.Schema));
}

module.exports = model();
