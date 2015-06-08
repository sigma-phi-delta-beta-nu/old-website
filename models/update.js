var aws = require("aws-sdk");
var dynamodb = new aws.DynamoDB({ region: "us-west-2" });

exports.addLink = function(username, label, url, callback) {
  
  var updateData = {
    "M": {
      "label": { "S": label },
      "url": { "S": url }
    }
  };
  var updateParams = {
    "Key": { "username": { "S": username } },
    "TableName": "user_data",
    "AttributeUpdates": {
      "links": {
        "Action": "PUT",
        "Value": updateData 
      }
    }
  };
  
  dynamodb.updateItem(updateParams, function(error) {
    if (error) {
      console.log(error);
      callback(false);
    } else {
      callback(true);
    }
  });
};
