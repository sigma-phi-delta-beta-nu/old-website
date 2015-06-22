var aws = require("aws-sdk");
var dynamodb = new aws.DynamoDB({ region: "us-west-2" });

exports.queryAlbums = function(user, callback) {
  
  var queryParams = {
    "TableName": "photo_gallery",
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
      var gallery = {};/*
      for (var i = 0; i < data.Items.length; i++) {
        var galleryKeys = Object.keys(gallery);
        var keyIndex = -1;
        for (var j = 0; j < galleryKeys.length; j++) {
          if (data.Items[i]["album"]["S"] === galleryKeys[j]) {
            keyIndex = j;
          }
        }
        if (keyIndex !== -1) {
          gallery[galleryKeys[keyIndex]].push({
            "url": data.Items[i]["url"]["S"],
            "caption": data.Items[i]["caption"]["S"]
          });
        } else {
          gallery[data.Items[i]["album"]["S"]] = [{
            "url": data.Items[i]["url"]["S"],
            "caption": data.Items[i]["caption"]["S"]
          }];
        }
      }*/
      populateGallery(data.Items, gallery);
      if (user === null) {
        callback(gallery);
      } else {
        queryParams["KeyConditions"]["type"]["AttributeValueList"][0]["S"] = "private";
        dynamodb.query(queryParams, function(error, data) {
          if (error) {
            console.log(error);
          } else {
            populateGallery(data.Items, gallery);
            callback(gallery);
          }
        });
      }
    }
  });
  
  var populateGallery = function(list, gallery) {
    for (var i = 0; i < list.length; i++) {
      var galleryKeys = Object.keys(gallery);
      var keyIndex = -1;
      for (var j = 0; j < galleryKeys.length; j++) {
        if (list[i]["album"]["S"] === galleryKeys[j]) {
          keyIndex = j;
        }
      }
      if (keyIndex !== -1) {
        gallery[galleryKeys[keyIndex]].push({
          "url": list[i]["url"]["S"],
          "caption": list[i]["caption"]["S"]
        });
      } else {
        gallery[list[i]["album"]["S"]] = [{
          "url": list[i]["url"]["S"],
          "caption": list[i]["caption"]["S"]
        }];
      }
    }
  }
  
};
