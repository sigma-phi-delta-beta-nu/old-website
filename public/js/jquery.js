$(document).ready(function() {

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
			url: '/logout',
			success: function() {
				if (window.location.pathname === "/dashboard") {
                    window.location = "/";
                } else {
                    location.reload(true);
                }
			}
		});

	});
	
    $("#add_link").click(function() {
      
      var linkLabel = $(this).closest("div").find("input").first().val().trim();
      var linkURL = $(this).closest("div").find("input").last().val().trim();
      
      var sendingData = {
        "label": linkLabel,
        "url": linkURL
      }
      
      $.ajax({
        type: "POST",
        url: "/addLink",
        data: JSON.stringify(sendingData),
        contentType: "application/json",
        success: function(returnedData) {
          window.location.reload(true);
        },
        error: function(err) {
          console.log(err);
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
            url: '/login',
            data: JSON.stringify(sendingData),
			contentType: 'application/json',
            success: function(returnedData) {
                if (returnedData === true) {
                    window.location.reload(true);
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
