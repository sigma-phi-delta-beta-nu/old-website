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
  
  
};

exports.queryEvent = function(user, url, callback) {
  
  var queryParams = {
    "TableName": "events",
    "IndexName": "url",
    "Select": "ALL_ATTRIBUTES",
    "KeyConditions": {
      "url": {
        "ComparisonOperator": "EQ",
        "AttributeValueList": [{ "S": url }]
      }
    }
  }
  
  dynamodb.query(queryParams, function(error, data) {
    if (error) {
      console.log(error);
    } else {
      var foundEvent = deDynamoItem(data.Items[0]);
      if (foundEvent === null) {
        callback(null);
        return;
      }
      if (foundEvent["type"] === "private" && user === null) {
        callback(null);
        return;
      }
      var attending = [];
      var rawAttending = foundEvent["attending"];
      for (var i = 0; i < rawAttending.length; i++) {
        attending.push(rawAttending[i]["S"]);
      }
      foundEvent["attending"] = attending;
      callback(foundEvent);
    }
  });

};

exports.addEvent = function(user, eventData, callback) {
  
  var putParams = {
    "Item": {
      "url": { "S": eventData["url"] },
      "author": { "S": user.username },
      "attending": { "L": [ { "S": user.name.replace("_", " ") } ] },
      "category": { "S": eventData["category"] },
      "cost": { "N": eventData["cost"] },
      "date": { "S": eventData["date"] },
      "description": { "S": eventData["description"] },
      "location": { "S": eventData["location"] },
      "name": { "S": eventData["name"] },
      "picture": { "S": eventData["picture"] },
      "time": { "S": eventData["time"] },
      "type": { "S": eventData["type"] }
    },
    "TableName": "events"
  }
  
  dynamodb.putItem(putParams, function(error, data) {
    if (error) {
      console.log(error);
    } else {
      callback();
    }
  });
  
};

exports.removeEvent = function(url, callback) {
  
  var deleteParams = {
    "Key": {
      "url": { "S": url }
    },
    "TableName": "events"
  };
  
  dynamodb.deleteItem(deleteParams, function(error, data) {
    if (error) {
      console.log(error);
    } else {
      callback();
    }
  });
  
};

exports.addAttendee = function(url, attendee, callback) {
  
  var updateData = {
    "L": [
      { "S": attendee }
    ]
  };
  
  var updateParams = {
    "Key": { "url": { "S": url } },
    "TableName": "events",
    "AttributeUpdates": {
      "attending": {
        "Action": "ADD",
        "Value": updateData
      }
    }
  };
  
  dynamodb.updateItem(updateParams, function(error) {
    if (error) {
      console.log(error);
    } else {
      callback();
    }
  });
  
};

exports.removeAttendee = function(url, attendee, callback) {
  
  var getParams = {
    "Key": { "url": { "S": url } },
    "TableName": "events",
    "AttributesToGet": ["attending"]
  };
  
  dynamodb.getItem(getParams, function(error, data) {
    if (error) {
      console.log(error);
    } else {
      
      var oldAttendees = data.Item["attending"]["L"];
      var attendees = { "L": [] };
      
      for (var i = 0; i < oldAttendees.length; i++) {
        if (oldAttendees[i]["S"] != attendee) {
          attendees["L"].push({ "S": oldAttendees[i]["S"] });
        }
      }
      
      var updateParams = {
        "Key": { "url": { "S": url } },
        "TableName": "events",
        "AttributeUpdates": {
          "attending": {
            "Action": "PUT",
            "Value": attendees
          }
        }
      };
      
      dynamodb.updateItem(updateParams, function(error, data) {
        if (error) {
          console.log(error);
        } else {
          callback();
        }
      });
      
    }
  });
  
};

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
