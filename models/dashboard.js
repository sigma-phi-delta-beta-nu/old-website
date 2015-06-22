/*  Functions provided by this file:  */
/*   - addLink                        */
/*   - removeLink                     */

var aws = require("aws-sdk");
var dynamodb = new aws.DynamoDB({ region: "us-west-2" });

exports.addLink = function(username, label, url, callback) {
  
  var checkedUrl = url;
  
  if (url[0] !== 'h') {
    checkedUrl = "http://" + url;
  }
  
  var updateData = {
    "L": [
      {
        "M": {
          "label": { "S": label },
          "url": { "S": checkedUrl }
        }
      }
    ]
  };
  
  var updateParams = {
    "Key": { "username": { "S": username } },
    "TableName": "user_data",
    "AttributeUpdates": {
      "links": {
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

exports.removeLink = function(username, label, callback) {
  
  var getParams = {
    Key: { "username": { "S": username } },
    TableName: "user_data",
    AttributesToGet: ["links"]
  };
  
  dynamodb.getItem(getParams, function(error, data) {
    
    var oldLinks = data.Item["links"]["L"];
    var links = { "L": [] };
    
    for (var i = 0; i < oldLinks.length; i++) {
      if (oldLinks[i]["M"]["label"]["S"] != label) {
        links["L"].push({
          "M": {
            "label": { "S": oldLinks[i]["M"]["label"]["S"] },
            "url": {"S": oldLinks[i]["M"]["url"]["S"] }
          }
        });
      }
    }
    
    var updateParams = {
      "Key": { "username": { "S": username } },
      "TableName": "user_data",
      "AttributeUpdates": {
        "links": {
          "Action": "PUT",
          "Value": links
        }
      }
    };
    
    dynamodb.updateItem(updateParams, function() {
      callback();
    });
    
  });
  
};
