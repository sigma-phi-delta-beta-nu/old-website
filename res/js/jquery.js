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
	
	$('input').keypress(function(event) {
		
		if (event.keyCode == 13) {
			event.preventDefault();
			var pwd = $(this).val();
			//var hash = hashCode(pwd);
			var hash = Sha256.hash(pwd);
			authenticate(hash);
		}

	});
	
	$('#login').click(function() {
		
		var pwd = $(this).closest("div").find("input").val();
		//var hash = hashCode(pwd);
		var hash = Sha256.hash(pwd);
		authenticate(hash);
	
	});
	
	$('#logout').click(function() {
		
		$.ajax({
			type: 'GET',
			url: '/logout_handler',
			success: function() {
				window.location = '/internal';
			}
		});

	});
	
	function authenticate(pwd) {
		
        var sendingData = {
            password: pwd
        }

        $.ajax({
            type: 'GET',
            url: '/login_handler',
            data: sendingData,
            dataType: 'text',
            success: function(returnedData) {
                if (returnedData === "Successful") {
                    window.location = "/internal";
                } else {
                    //alert("Sorry, that password was incorrect.");
					alert(pwd);
				}
            },
            error: function() {
                alert("Error occured.");
            }
		});
	}
});
