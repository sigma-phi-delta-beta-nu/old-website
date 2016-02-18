$(document).ready(function() {
    
    $(".navbar-brand").click(function() {
      $(this).css("background", "transparent");
    });
    
    $(".content").css("margin-bottom", "0px");
    
    if ($(".flexslider").attr("onpage") !== "true") {
      moveFooter();
      $(window).resize(moveFooter);
    }
    
    function moveFooter() {
      var navHeight = $("#navbar").outerHeight();
      var footerHeight = $("#footer").outerHeight();
      var contentHeight = $(".content").outerHeight();
      var bodyHeight = $("body").outerHeight();
      if (navHeight + footerHeight + contentHeight < bodyHeight) {
        $(".content").css({
         "margin-bottom": bodyHeight - navHeight - footerHeight - contentHeight + "px"
        });
      }
    }
    
    $('input').keypress(function(event) {
		
		if (event.keyCode == 13) {
			event.preventDefault();
            var $submit = $(this).closest("div").find("button");
            if ($submit.attr("id") === "login") {
			  var $inputs = $(this).closest("div").find("input");
			  var usr = $inputs.first().val();
			  if (usr === "") {
			  	alert("Please enter a username.");
			  	return;
			  }
			  var pwd = $inputs.last().val();
			  if (pwd === "") {
			  	alert("Please enter a password");
                $inputs.last().focus();
			  	return;
			  }
			  var hash = Sha256.hash(pwd);
        console.log("Hash: " + hash);
			  authenticate(usr, hash);
		    }
        }

	});
	
	$('#login').click(function() {
		
		var $inputs = $(this).closest("div").find("input");
		var usr = $inputs.first().val();
		var pwd = $inputs.last().val();
		var hash = Sha256.hash(pwd);
		authenticate(usr, hash);
	
	});
	
	$('#logout').click(function(clickEvent) {
		
    clickEvent.preventDefault();
    
		$.ajax({
			type: 'GET',
			url: '/logout',
			success: function(result) {
				if (window.location.pathname === "/dashboard"
                 || window.location.pathname === "/roster") {
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
      
      if (sendingData.label === "" || sendingData.url === "") {
        alert("Sorry, one of the fields was left blank.");
        return;
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
    
    $("#remove_link").click(function() {
      
      if ($(this).text() == "Remove a link") {
        $(".remove").show();
        $(this).text("Done");
      } else {
        $(".remove").hide();
        $(this).text("Remove a link");
      }
      
    });
    
    $(".remove").click(function() {
      
      var linkLabel = $(this).closest("li").find("a").text();
      var sendingData = {
        "label": linkLabel
      }
      
      $.ajax({
        type: "POST",
        url: "/removeLink",
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
    
    $("#addEvent").click(function() {
      
      var $name = $("label[for='eventName']").find("input");
      var $location = $("label[for='location']").find("input");
      var $date = $("label[for='date']").find("input");
      var $time = $("label[for='time']").find("input");
      var $category = $("label[for='category']").find("select");
      var $privacy = $("label[for='privacy']").find("select");
      var $cost = $("label[for='cost']").find("input");
      var $description = $("label[for='description']").find("textarea");
      
      var sendingData = {
        "name": $name.val(),
        "location": $location.val(),
        "date": $date.val(),
        "time": $time.val(),
        "category": $category.val(),
        "type": $privacy.val(),
        "cost": $cost.val(),
        "description": $description.val()
      };
      
      var keys = Object.keys(sendingData);
      for (var i = 0; i < keys.length; i++) {
        if (sendingData[keys[i]] === "") {
          alert("Sorry, one of the fields was left blank.");
          return;
        }
      }
      
      sendingData["url"] = "/" + sendingData.name
        .toLowerCase()
        .replace(/ /g, "_")
        .replace(/'/g, "%27")
        .replace(/\//g, "%2f")
        .replace(/\"/g, "%22");
      
      $.ajax({
        "type": "POST",
        "url": "/addEvent",
        "data": JSON.stringify(sendingData),
        "contentType": "application/json",
        "success": function() {
          window.location = "/events" + sendingData.url;
        },
        "error": function(err) {
          console.log(err);
        }
      });

    });
    
    $("#removeEvent").click(function() {
      
      var url = window.location.pathname.substring(7, window.location.pathname.length);
      $.ajax({
        "type": "POST",
        "url": "/removeEvent",
        "data": JSON.stringify({ "url": url }),
        "contentType": "application/json",
        "success": function() {
          window.location = "/events";
        },
        "error": function(err) {
          console.log(err);
        }
      });
      
    });
    
    $("#addAttendee").click(function() {
      
      var title = $("#event_name").text();
      var url = window.location.pathname.substring(7, window.location.pathname.length);
      
      $.ajax({
        "type": "POST",
        "url": "/addAttendee",
        "data": JSON.stringify({ "title": title, "url": url }),
        "contentType": "application/json",
        "success": function() {
          window.location.reload(true);
        },
        "error": function(err) {
          console.log(err);
        }
      });
      
    });
    
    $("#removeAttendee").click(function() {
      
      var url = window.location.pathname.substring(7, window.location.pathname.length);
      
      $.ajax({
        "type": "POST",
        "url": "/removeAttendee",
        "data": JSON.stringify({ "url": url }),
        "contentType": "application/json",
        "success": function() {
          window.location.reload(true);
        },
        "error": function(err) {
          console.log(err);
        }
      });
      
    });
    
    $("#addPhoto").click(function() {
      
      var photo = $("label[for='photo']").find("input");
      
      var file = photo[0]["files"][0];
      var reader = new FileReader();
      reader.readAsText(file);
      console.log(reader["result"]);
    });
    
    $(".event_thumb").mouseenter(function() {
      $(this).css("background", "#FADDDD");
    });
    
    $(".event_thumb").mouseleave(function() {
      $(this).css("background", "#FFFFFF");
    });
    
    $(".gallery_thumb").mouseenter(function() {
      $(this).css("background", "#FADDDD");
    });
    
    $(".gallery_thumb").mouseleave(function() {
      $(this).css("background", "#FFFFFF");
    });
    
    $(".hyper_select").find("div").mouseenter(function() {
      $(this).css("background", "#FADDDD");
    });
    
    $(".hyper_select").find("div").mouseleave(function() {
      $(this).css("background", "#EAEAEA");
    });
    
    $(".hyper_select").find("div").first().css("color", "#FA0000");
    
    $(".hyper_select").find("div").click(function() {
      if ($(this).css("color") === "rgb(0, 0, 0)") {
        $(this).closest(".hyper_select").find("div").css("color", "#000000");
        $(this).css("color", "#FA0000");
        if ($(this).text() === "Hyperlink") {
          var currentRow = $("tr").first();
          var rowCount = $("tr").length;
          for (var i = 0; i < rowCount; i++) {
            var email = currentRow.find("td").last().text();
            currentRow.find("td").last().html("<a href='mailto:" + 
              email + "'>" + email + "</a>");
            if (currentRow.next().length === 0) {
              currentRow = $("tbody").last().find("tr").first();
            } else {
              currentRow = currentRow.next();
            }
          }
        } else {
          var currentRow = $("tr").first();
          var rowCount = $("tr").length;
          for (var i = 0; i < rowCount; i++) {
            currentRow.find("td").last().html(
              currentRow.find("td").last().find("a").text()
            );
            if (currentRow.next().length === 0) {
              currentRow = $("tbody").last().find("tr").first();
            } else {
              currentRow = currentRow.next();
            }
          }
        }
      }
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
                var result = JSON.parse(returnedData);
                if (result["success"]) {
                    window.location = "/dashboard";
                } else {
                    alert("Sorry, that password is incorrect.");
                    $("#login").closest("div").find("input").first().next().val("");
					$("#login").closest("div").find("input").first().next().focus();
				
				}
            },
            error: function(err) {
                console.log(err);
            }
		});
	}
});
