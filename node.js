var express = require('express');
var server = express();

server.use('/', express.static(__dirname + '/static'));

server.listen(process.env.PORT || 9000);
