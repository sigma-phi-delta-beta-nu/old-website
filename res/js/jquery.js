$(document).ready(function() {
	
	$('.submenu_animate div').mouseenter(function() {
		$(this).animate({
			padding: '0.7em',
		}, 100);
	});
	
	$('.submenu_animate div').mouseleave(function() {
		$(this).animate({
			padding: '0.5em',
		}, 100);
	});
	
	$("#submit").click(function() {
		var pwd = $(this).closest("div").find("input").first().val();
		var sendingData = {
			password: pwd
			}
		var $appendingLocation = $(this).closest("div");
		$.ajax({
			type: 'GET',
			url: '/login_handler',
			data: sendingData,
			dataType: 'text',
			success: function(returnedData) {
				if (returnedData === "Successful") {
					window.location = "/internal";
				} else {
					alert("Incorrect password");
				}
			},
			error: function() {
				alert("Error occured.");
			}
		});
	});
});
