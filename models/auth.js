/*  Functions provided by this file:  */
/*   - login                          */
/*   - authenticate                   */

var aws = require("aws-sdk");
var dynamodb = new aws.DynamoDB({ region: "us-west-2" });

exports.login = function(username, password, callback) {
  
  var queryParams = {
    Key: {
      username: {"S" : username}
    },
    TableName: "users",
    AttributesToGet: ["password"]
  }
  
  dynamodb.getItem(queryParams, function(error, data) {
    if (error) {
      //console.log(error);
    } else {
      if (data.Item != null) {
        if (data.Item["password"]["S"] === password) {
          callback(username);
        } else {
          callback(null);
        }
      }
    }
  });

};

exports.authenticate = function(cookies, callback) {
  
  if (cookies["logged_in"] === undefined) {
    callback(null);
    return;  //for some reason, this is necessary
  }
  
  var basicUser = { "username": cookies["logged_in"] };
  
  getUserData(basicUser, function(user) {
    callback(user);
  });
 
};

var getUserData = function(user, callback) {

  var queryParams = {
    Key: { username: { "S": user["username"] } },
    TableName: "membership",
    AttributesToGet: ["nickname"]
  }
  
  dynamodb.getItem(queryParams, function(error, data) {
    if (error) {
      console.log(error);
    } else {
      user["nickname"] = data.Item.nickname["S"];
      
      queryParams["TableName"] = "user_data";
      queryParams["AttributesToGet"] = ["links", "events"];
      
      dynamodb.getItem(queryParams, function(error, data) {
        
        if (error) {
          console.log(error);
        } else {
          var userLinks = data.Item["links"]["L"];
          var links = [];
          
          for (var i = 0; i < userLinks.length; i++) {
            links[userLinks[i]["M"]["label"]["S"]] = userLinks[i]["M"]["url"]["S"];
          }
          
          user["links"] = links;
          
          var scanParams = {
            "TableName": "events",
            "IndexName": "url",
            "AttributesToGet": ["name", "url"],
            "ScanFilter": {
              "url": {
                "ComparisonOperator": "IN",
                "AttributeValueList": data.Item["events"]["L"]
              }
            }
          };
          
          var events = [];
          
          dynamodb.scan(scanParams, function(error, data) {
            if (error) {
              console.log(error);
            } else {
              var userEvents = data.Items;
              for (var i = 0; i < userEvents.length; i++) {
                events.push({
                  "url": "/events/" + userEvents[i]["url"]["S"],
                  "name": userEvents[i]["name"]["S"]
                });
              }
              user["events"] = events;
            }
            callback(user);
          });
        }
      });
    }
  });

};
