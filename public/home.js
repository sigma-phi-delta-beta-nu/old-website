// public/res/js/home.js
// Copyright (c) 2015 Brandon M. Kelley

$(document).ready(function() {
  
  var centerLanding = function() {
    var canvas = $("#background").outerHeight() - $(".navbar").outerHeight();
    var landingSize;
    if ($("#super-center div").outerHeight() > 0) {
      landingSize = $("#super-center div").outerHeight();
    } else {
      landingSize = $("#super-center div").next().outerHeight();
    }
    var topOffset;
    if (canvas > landingSize + 10) {
      topOffset = (canvas - landingSize) / 2;
    } else {
      topOffset = 10;
    }
    $("#super-center").css("margin-top", topOffset + "px");
  };
  
  centerLanding();
  $(window).resize(centerLanding);
  
});
