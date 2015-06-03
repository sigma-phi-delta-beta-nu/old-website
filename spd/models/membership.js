// These functions provide an interface to the database
// that returns the entire membership, sorted in various
// ways.

var aws = require("aws-sdk");
var dynamodb = new aws.DynamoDB({ region: "us-west-2" });

exports.queryPledgeClasses = function(callback) {
  
  var membership = {};
  var pledgeClasses = [];
  var classes = [];
  
  var scanParams = {
    TableName: "membership",
    IndexName: "class",
    AttributesToGet: ["class"]
  }
  
  //scan the database for names of pledge classes
  var classScan = function(scanParams, callback) {
    dynamodb.scan(scanParams, function(error, data) {
      if (error) {
        console.log(error);
      } else {
        var list = data.Items;
        var length = data.Count;
        for (var i = 0; i < length; i++) {
          var found = false;
          for (var j = 0; j < pledgeClasses.length; j++) {
            if (list[i]["class"]["S"] == pledgeClasses[j]) {
              found = true;
              break;
            }
          }
          if (!found || i === 0) {
            pledgeClasses.push(list[i]["class"]["S"]);
            membership[list[i]["class"]["S"]] = [];
          }
          if (i === length - 1) {
            callback();
          }
        }
      }
    });
  };
  
  var classQuery = function(pledgeClasses, callback) {
    for (var i = 0; i < pledgeClasses.length; i++) {
      var queryParams = {
        IndexName: "class",
        KeyConditions: {
          "class": {
            ComparisonOperator: "EQ",
            AttributeValueList: [{ "S": pledgeClasses[i] }]
          }
        },
        TableName: "membership",
        AttributesToGet: ["firstname", "lastname"]
      }
      classes.push({ 
        pledgeClass: pledgeClasses[i],
        params: queryParams
      });
      if (i === pledgeClasses.length - 1) {
        callback();
      }
    }
  };
  
  var dbQuery = function(classes, pledgeClassesToGo, callback) {
    var pledgeClassIndex = pledgeClassesToGo - 1;
    if (pledgeClassIndex >= 0) {
      dynamodb.query(classes[pledgeClassIndex]["params"], function(error, data) {
        if (error) {
          console.log(error);
        } else {
          var list = data.Items;
          var length = data.Count;
          for (var i = 0; i < length; i++) {
            var firstname = list[i]["firstname"]["S"];
            var lastname = list[i]["lastname"]["S"];
            membership[classes[pledgeClassIndex]["pledgeClass"]]
              .push({ "firstname": firstname, "lastname": lastname });
          }
        }
        dbQuery(classes, pledgeClassesToGo - 1, callback);
      });
    } else {
      callback();
    }
  };
  
  classScan(scanParams, function() {
    classQuery(pledgeClasses, function() {
      dbQuery(classes, classes.length, function() {
        callback(membership);
      });
    });
  });
}
