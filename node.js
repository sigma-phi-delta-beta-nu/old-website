var express = require('express');
var app = express();
var fs = require('fs');

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
	
	var pwd = request.query.password;
	if (pwd === 'oookillem') {
		response.end('Successful');
		sessionCode = 1;
	} else {
		response.end('Failed');
	}
	
});

app.get('/internal', function (request, response) {
	
	if (sessionCode == 1) {
		displayPage('internal.html', response);
	} else {
		response.end('Nice try. Please login');
	}

});

app.listen(9000);
