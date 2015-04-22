var express = require('express');
var app = express();
var fs = require('fs');
var aws = require('aws-sdk');
var dynamodb = new aws.DynamoDB({region: "us-west-2"});

function displayPage(filename, response) {
	
	var file = fs.createReadStream(filename);
	
	file.pipe(response, function() {
		response.end();
	});
	
}

app.use(express.static(__dirname + '/'));

app.get('/', function(request, response) {
	
	displayPage('home.html', response);

});

app.get('/about_us', function(request, response) {
	
	displayPage('about_us.html', response);
	
});

app.get('/recruitment', function(request, response) {
	
	displayPage('recruitment.html', response);
	
});

app.get('/contact_us', function(request, response) {
	
	displayPage('contact_us.html', response);
	
});

app.get('/login_handler', function(request, response) {

	var user = request.query.username;
	var pwd = request.query.password;
	
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
				}
				response.end();
			} else {
				response.end("Failed");
			}
		}
	});
});

app.get('/logout_handler', function(request, response) {
	
	response.clearCookie('logged_in');
	response.end("Successful");
	
});

app.get('/internal', function(request, response) {
	
	if (request.headers.cookie) {
		displayPage('internal.html', response);
	} else {
		displayPage('external.html', response);
	}

});

app.get('/welcome', function(request, response) {

	var user = request.query.username;
	
	queryParams = {
		Key: {"username": {"S": user}},
		TableName: "membership",
		AttributesToGet: ["nickname"]
	}

	dynamodb.getItem(queryParams, function(error, data) {
		if (error) {
			console.log(error);
		} else {
			var nickname = data.Item.nickname["S"];
			response.end(nickname);
		}
	});

});

app.listen(9000);
