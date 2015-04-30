var express = require('express');
var main_router = express.Router();

var aws = require('aws-sdk');
var dynamodb = new aws.DynamoDB({region: 'us-west-2'});

main_router.get('/', function(request, response) {
	
	response.render('index', {});
	console.log("GET '/' successful\n");
	
});

main_router.get('/about_us', function(request, response) {
	
	var membership = {};
	
	membership["founding"] = [];
	membership["alpha"] = [];
	membership["beta"] = [];
		
	var founding_query_params = {
		IndexName: "class",
		KeyConditions: {
			"class": {
				ComparisonOperator: "EQ",
				AttributeValueList: [{"S": "founding"}]
			}
		},
		TableName: "membership",
		AttributesToGet: ["firstname", "lastname"]
	}
	
	var alpha_query_params = {
		IndexName: "class",
		KeyConditions: {
			"class": {
				ComparisonOperator: "EQ",
				AttributeValueList: [{"S": "alpha"}]
			}
		},
		TableName: "membership",
		AttributesToGet: ["firstname", "lastname"]
	}
	
	var beta_query_params = {
		IndexName: "class",
		KeyConditions: {
			"class": {
				ComparisonOperator: "EQ",
				AttributeValueList: [{"S": "beta"}]
			}
		},
		TableName: "membership",
		AttributesToGet: ["firstname", "lastname"]
	}
	
	var founding_query = function(callback) {
		dynamodb.query(founding_query_params, function(error, data) {
			if (error) {
				console.log(error);
			} else {
				var list = data.Items;
				var length = data.Count;
				for (var i = 0; i < length; i++) {
					var firstname = list[i]["firstname"]["S"];
					var lastname = list[i]["lastname"]["S"];
					membership["founding"].push({"firstname": firstname, "lastname": lastname});
					if (i === length - 1) {
						callback();
					}
				}
			}
		});
	}
		
	var alpha_query = function(callback) {
		dynamodb.query(alpha_query_params, function(error, data) {
			if (error) {
				console.log(error);
			} else {
				var list = data.Items;
				var length = data.Count;
				for (var i = 0; i < length; i++) {
					var firstname = list[i]["firstname"]["S"];
					var lastname = list[i]["lastname"]["S"];
					membership["alpha"].push({"firstname": firstname, "lastname": lastname});
					if (i === length - 1) {
						callback();
					}
				}
			}
		});
	}

	var beta_query = function(callback) {
		dynamodb.query(beta_query_params, function(error, data) {
			if (error) {
				console.log(error);
			} else {
				var list = data.Items;
				var length = data.Count;
				for (var i = 0; i < length; i++) {
					var firstname = list[i]["firstname"]["S"];
					var lastname = list[i]["lastname"]["S"];
					membership["beta"].push({"firstname": firstname, "lastname": lastname});
					if (i === length - 1) {
						callback();
					}
				}
			}
		});
	}
	
	function run() {
		founding_query(function() {
			alpha_query(function() {
				beta_query(function() {
					response.render('about_us', { members: membership });
					console.log("GET '/about_us' successful\n");
				});
			});
		});
	}
	
	run();
	
});

main_router.get('/recruitment', function(request, response) {
	
	response.render('recruitment', {});
	console.log("GET '/recruitment' successful\n");

});

main_router.get('/contact_us', function(request, response) {
	
	response.render('contact_us', {});
	console.log("GET '/contact_us' successful\n");
	
});

main_router.get('/internal', function(request, response) {
	
	if (request.cookies['logged_in']) {

		var user = request.cookies['logged_in'];
			
		queryParams = {
        	Key: {"username": {"S": user}},
        	TableName: "membership",
        	AttributesToGet: ["nickname"]
    	}
	
    	dynamodb.getItem(queryParams, function(error, data) {
        	if (error) {
        	    console.log(error);
        	} else {
        	    var brothername = data.Item.nickname["S"];
        	    response.render('internal', { nickname: brothername });
				console.log("GET '/internal' successful\n");
        	}
    	});
		
		
	} else {

		response.render('external', {});
		console.log("GET '/external' successful\n");
	
	}
});

module.exports = main_router;
