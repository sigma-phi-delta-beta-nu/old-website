var express = require('express');
var handler_router = express.Router();

var aws = require('aws-sdk');
var dynamodb = new aws.DynamoDB({region: 'us-west-2'});

handler_router.post('/login_handler', function(request, response) {
	
	var user = request.body.username;
    var pwd = request.body.password;

    var queryParams =
    {
        Key: {
            "username" : {"S" : user}
        },
        TableName: "users",
        AttributesToGet: ["password"]
    }

    dynamodb.getItem(queryParams, function(error, data) {
        if (error) {
            console.log(error);
        } else {
            if (data.Item != null) {
           		if (data.Item.password["S"] === pwd) {
                    response.cookie('logged_in', user, { maxAge: 100 * 60 * 60 });
                    response.send(data);
                } else {
                    response.send("Failed");
					console.log("Incorrect password");
                }
                response.end();
            } else {
                console.log("No username entered.");
				response.end("Failed");
            }
        }
    });	
});

handler_router.get('/logout_handler', function(request, response) {
	
	response.clearCookie('logged_in');
    response.end("Successful");
	
});

module.exports = handler_router;
