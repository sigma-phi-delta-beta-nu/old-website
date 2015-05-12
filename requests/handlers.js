var express = require('express');
var handler_router = express.Router();

var aws = require('aws-sdk');
var dynamodb = new aws.DynamoDB({region: 'us-west-2'});

var fs = require('fs');

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
					console.log("User authentication successful, " + user + " logged in");
                } else {
                    response.send("Failed");
					console.log("Incorrect password entered");
                }
                response.end();
            } else {
                console.log("No username entered");
				response.end("Failed");
            }
        }
    });	
});

handler_router.get('/logout_handler', function(request, response) {
	
	response.clearCookie('logged_in');
    response.end("Successful");
	console.log("User logout successful");
	
});

handler_router.post("/file_upload", function(request, response) {
	
	var file = request.body.file;
	console.log(file);
	upload_stream = fs.createReadStream(file);
	new_file_stream = fs.createWriteStream("boobs.txt");
	
	upload_stream.on("open", function() {
		upload_stream.pipe(new_file);
		new_file.close();
		console.log("yes");
		response.end("yes");
	});
	
	upload_stream.on("error", function() {
		console.log("Error");
	});
	
});

module.exports = handler_router;
