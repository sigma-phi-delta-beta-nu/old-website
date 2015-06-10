var aws = require("aws-sdk");
var dynamodb = new aws.DynamoDB({ region: "us-west-2" });

exports.queryCategories = function(user, callback) {
  
  var logged_in;
  if (user === null) {
    logged_in = false;
  } else {
    logged_in = true;
  }
  
  var queryParams = {
    "TableName": "events",
    "IndexName": "type",
    "Select": "ALL_ATTRIBUTES",
    "KeyConditions": {
      "type": {
        "ComparisonOperator": "EQ",
        "AttributeValueList": [{ "S": "public" }]
      }
    }
  };
  
  dynamodb.query(queryParams, function(error, data) {
    
    if (error) {
      console.log(error);
    } else {
      var rawList = data.Items;
      var events = [];
      for (var i = 0; i < rawList.length; i++) {
        events.push(deDynamoItem(rawList[i]));
      }
      if (logged_in) {
        queryParams["KeyConditions"]["type"]["AttributeValueList"][0]["S"] = "private";
        dynamodb.query(queryParams, function(error, data) {
          if (error) {
            console.log(error);
          } else {
            var rawList = data.Items;
            for (var i = 0; i < rawList.length; i++) {
              events.push(deDynamoItem(rawList[i]));
            }
            callback(events);
          }
        });
      } else {
        callback(events);
      }
    }
    
  });
  
  var deDynamoItem = function(item) {
    var attrKeys = Object.keys(item);
    var attrTypeKeys = [];
    for (var j = 0; j < attrKeys.length; j++) {
      attrTypeKeys[attrKeys[j]] = Object.keys(item[attrKeys[j]])[0];
    } 
    var current = {};
    for (var j = 0; j < attrKeys.length; j++) {
      current[attrKeys[j]] = item[attrKeys[j]][attrTypeKeys[attrKeys[j]]];
    }
    return current;
  }
  
};
