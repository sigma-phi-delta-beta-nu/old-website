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
        console.log(data);
        var userLinks = data.Item["links"]["L"];
        var links = [];
        for (var i = 0; i < userLinks.length; i++) {
          links[userLinks[i]["M"]["label"]["S"]] = userLinks[i]["M"]["url"]["S"];
        }
        user["links"] = links;
        
        queryParams = {
          "TableName": "events",
          "IndexName": "event_id",
          "AttributesToGet": [{ "S": "name" }],
          "KeyConditions": {
            "events_id": {
              "ComparisonOperator": "EQ",
              "AttributeValueList": data.Item["events"]["L"]
            }
          }
        }
        
        console.log(data.Item["events"]["L"]);
        dynamodb.query(queryParams, function(error, data) {
          if (error) {
            console.log(error);
          }
          var names = [];
          console.log(data);
          
          
        });
        
        callback(user);
        
      });
    }
  });

};
