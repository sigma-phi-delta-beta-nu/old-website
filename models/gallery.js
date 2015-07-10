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
      var gallery = {};
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
    var galleryKeys;
    var keyIndex;
    for (var i = 0; i < list.length; i++) {
      galleryKeys = Object.keys(gallery);
      keyIndex = -1;
      for (var j = 0; j < galleryKeys.length; j++) {
        if (list[i]["album"]["S"] === galleryKeys[j]) {
          keyIndex = j;
        }
      }
      if (keyIndex !== -1) {
        gallery[galleryKeys[keyIndex]].push({
          "albumUrl": list[i]["albumUrl"]["S"],
          "url": list[i]["url"]["S"]
        });
      } else {
        gallery[list[i]["album"]["S"]] = [{
          "albumUrl": list[i]["albumUrl"]["S"],
          "url": list[i]["url"]["S"]
        }];
      }
    }
  }
  
};

exports.queryAlbum = function(user, albumUrl, callback) {
  
  var queryParams = {
    "TableName": "photo_gallery",
    "IndexName": "albumUrl",
    "Select": "ALL_ATTRIBUTES",
    "KeyConditions": {
      "albumUrl": {
        "ComparisonOperator": "EQ",
        "AttributeValueList": [{ "S": albumUrl }]
      }
    }
  };
  
  dynamodb.query(queryParams, function(error, data) {
    if (error) {
      console.log(error);
    } else {
      var album = [];
      populateAlbum(data.Items, album);
      callback(album);
    }
  });
  
  var populateAlbum = function(list, album) {
    for (var i = 0; i < list.length; i++) {
      album.push({
        "url": list[i]["url"]["S"],
        "caption": list[i]["caption"]["S"],
        "type": list[i]["type"]["S"],
        "album": list[i]["album"]["S"]
      });
    }
  };
  
};

exports.queryPhoto = function(user, imageUrl, callback) {
  
  var queryParams = {
    "TableName": "photo_gallery",
    "IndexName": "url",
    "Select": "ALL_ATTRIBUTES",
    "KeyConditions": {
      "url": {
        "ComparisonOperator": "EQ",
        "AttributeValueList": [{ "S": imageUrl }]
      }
    }
  };
  
  dynamodb.query(queryParams, function(error, data) {
    if (error) {
      console.log(error);
    } else {
      var photo = {};
      populatePhoto(data.Items[0], photo);
      callback(photo);
    }
  });
  
  var populatePhoto = function(item, photo) {
    var photoKeys = Object.keys(item);
    for (var i = 0; i < photoKeys.length; i++) {
      photo[photoKeys[i]] = item[photoKeys[i]]["S"];
    }
  };
  
};
