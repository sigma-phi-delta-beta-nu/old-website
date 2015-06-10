/*  Functions provided by this file:  */
/*   - queryPledgeClasses             */
/*   - queryPositions                 */

var aws = require("aws-sdk");
var dynamodb = new aws.DynamoDB({ region: "us-west-2" });

exports.queryClasses = function(callback) {
  
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
};

exports.queryPositions = function(callback) {
  
  var positions = [];
  var pos = [];
  var scanParams = {
    TableName: "membership",
    IndexName: "status",
    AttributesToGet: ["positions", "firstname", "lastname", "email"]
  }
  
  var scan = function(params, callback) {
    dynamodb.scan(params, function(error, data) {
      if (error) {
        console.log(error);
      } else {
        var membersList = data.Items;
        var length = data.Count;
        for (var i = 0; i < length; i++) {
          var member = membersList[i];
          for (var j = 0; j < member["positions"]["SS"].length; j++) {
            var position = member["positions"]["SS"][j];
            if (position != "(Empty)") {
              positions.push({
                position: position,
                firstname: member["firstname"]["S"],
                lastname: member["lastname"]["S"],
                email: member["email"]["S"]
              });
            }
          }
          if (i === length - 1) {
            callback();
          }
        }
      }
    });
  };
  
  var positionSort = function(positions, callback) {
    
    var elected = ["Chief Engineer", "Vice Chief Engineer", "Business Manager", "Secretary", "Historian", "Chaplain", "Pledge Master", "Guide", "Recruitment Chairman"];
    var appointed = ["Social Chairman", "Risk Reduction Chairman", "Fundraising Chairman", "Expansion Chairman", "Athletic Chairman", "Pledge Board Chairman", "Brotherhood Chairman", "Philanthropy Chairman", "Assistant Business Manager", "Sergeant At Arms", "Webmaster", "Engineering Governing Council Delegate"];
    var pos = {};
    pos["elected"] = [];
    pos["appointed"] = [];
    
    for (var i = 0; i < positions.length; i++) {
      for (var j = 0; j < elected.length; j++) {
        if (positions[i]["position"] == elected[j]) {
          pos["elected"][j] = positions[i];
        }
      }
      for (var k = 0; k < appointed.length; k++) {
        if (positions[i]["position"] == appointed[k]) {
          pos["appointed"][k] = positions[i];
        }
      }
      if (i == positions.length - 1) {
        callback(pos);
      }
    }
  };
  
  scan(scanParams, function() {
    positionSort(positions, function(sorted) {
      callback(sorted);
    });
  });
  
};
