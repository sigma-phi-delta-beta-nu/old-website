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
  
  var user = cookies["logged_in"];
  var queryParams = {
    Key: { username: { "S": user }},
    TableName: "membership",
    AttributesToGet: ["nickname"]
  }
  
  dynamodb.getItem(queryParams, function(error, data) {
    if (error) {
      console.log(error);
    } else {
      var brothername = data.Item.nickname["S"];
      
      queryParams["TableName"] = "user_data";
      queryParams["AttributesToGet"] = ["links"];
      dynamodb.getItem(queryParams, function(error, data) {
        var userLinks = data.Item["links"]["L"];
        var links = [];
        for (var i = 0; i < userLinks.length; i++) {
          links[userLinks[i]["M"]["label"]["S"]] = userLinks[i]["M"]["url"]["S"];
        }
        callback({ "username": user, "nickname": brothername, "links": links });
      });
    }
  });
 
};
