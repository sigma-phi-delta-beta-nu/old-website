var Sanitizer = function() {
  
  this.sanitize = function(input, type) {
    
    // Recursive check
    if (typeof input === "object") {
      var keys = Object.keys(input);
      for (var i = 0; i < keys.length; i++) {
        if (!this.sanitize(input[keys[i]], type)) {
          return false;
        }
      }
    }
    
    // Check typeof
    if (typeof input !== type) {
      return false;
    }
    
    // Check empty string
    if (input === "") {
      return false;
    }
    
    // Good enough
    return true;
    
  }
  
  return this;
  
};

module.exports = Sanitizer;
