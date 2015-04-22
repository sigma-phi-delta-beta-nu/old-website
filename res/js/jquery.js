$(document).ready(function() {

	if ($.cookie('logged_in')) {
		$("#login_form").hide();
		$("#logout_form").show();
		var $welcome_message = $("#welcome");
		$.ajax({
			type: "GET",
			url: "/welcome",
			data: { username : $.cookie('logged_in') },
			dataType: "text",
			success: function(nickname) {
				$welcome_message.text("Welcome, Brother " + nickname + "!");
			},
			error: function(err) {
				console.log(err);
			}
		});
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
			var pwd = $inputs.last().val();
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
	
	function authenticate(usr, pwd) {
		
        var sendingData = {
			username: usr,
            password: pwd
        }

        $.ajax({
            type: 'GET',
            url: '/login_handler',
            data: sendingData,
            dataType: 'text',
            success: function(returnedData) {
                if (returnedData !== "Failed") {
                    location.reload(true);
                } else {
                    //alert("Sorry, that password was incorrect.");
					alert(pwd);
					$("#login_form").find("input").val("");
					$("#login_form").find("input").first().focus();
				}
            },
            error: function(err) {
                console.log(err);
            }
		});
	}
});
