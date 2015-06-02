$(document).ready(function() {

	if ($.cookie('logged_in')) {
		$("#login_form").hide();
		$("#logout_form").show();
	} else {
		$("#login_form").show();
		$("#logout_form").hide();
		$("#login_form").find("input").first().focus();
	}

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
	
	$('input').keypress(function(event) {
		
		if (event.keyCode == 13) {
			event.preventDefault();
			var $inputs = $(this).closest("div").find("input");
			var usr = $inputs.first().val();
			if (usr === "") {
				alert("Please enter a username.");
				return;
			}
			var pwd = $inputs.last().val();
			if (pwd === "") {
				alert("Please enter a password");
				return;
			}
			var hash = Sha256.hash(pwd);
			authenticate(usr, hash);
		}

	});
	
	$('#login').click(function() {
		
		var $inputs = $(this).closest("div").find("input");
		var usr = $inputs.first().val();
		var pwd = $inputs.last().val();
		var hash = Sha256.hash(pwd);
		authenticate(usr, hash);
	
	});
	
	$('#logout').click(function() {
		
		$.ajax({
			type: 'GET',
			url: '/logout_handler',
			success: function() {
				location.reload(true);
			}
		});

	});
	
	$("#file_upload").click(function() {
		
		f = document.getElementById("file").files[0];
		
		var sending_data = {
			file: f
		}
		
		$.ajax({
			type: "POST",
			url: "/file_upload",
			data: JSON.stringify(sending_data),
			contentType: "application/json",
			success: function(returnedData) {
				if (returnedData == "yes") {
					console.log("Niggaaa");
				}
			},
			error: function(err) {
				console.log(err);
			}
		});
		
	});
	
	function authenticate(usr, pwd) {
		
        var sendingData = {
			username: usr,
            password: pwd
        }

        $.ajax({
            type: 'POST',
            url: '/login_handler',
            data: JSON.stringify(sendingData),
			contentType: 'application/json',
            success: function(returnedData) {
                if (returnedData !== "Failed") {
                    location.reload(true);
                } else {
                    alert("Sorry, that username/password combination was incorrect.");
					//alert(pwd);
					$("#login_form").find("input").first().next().val("");
					$("#login_form").find("input").first().next().focus();
				}
            },
            error: function(err) {
                console.log(err);
            }
		});
	}
});
