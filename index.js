var express = require('express');
var app = express();
var fs = require('fs');
//var db = require('mongojs').connect('mongodb://spdcalpoly.org/spd_users', ['users']);

var sessionCode = 0;

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

	//console.log(db.users.find({usr : "general"}));

	var usr = "general";
	var pwd = request.query.password;

	if (usr === "general") {
		if (pwd === 'ba3940cf8278a71f7bbc7be10e4b6a6ce0270469490b30cc155ee9c8cc3a68b5') {
			response.end('Successful');
			sessionCode = 1;
		} else {
			response.end('Failed');
			sessionCode = 0;
		}
	}

});

app.get('/logout_handler', function(request, response) {
	
	sessionCode = 0;
	response.end("Successful");
	
});

app.get('/internal', function (request, response) {
	
	if (sessionCode == 1) {
		displayPage('internal.html', response);
	} else {
		displayPage('external.html', response);
	}

});

app.listen(9000);
