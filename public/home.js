// public/res/js/home.js
// Copyright (c) 2015 Brandon M. Kelley

$(document).ready(function() {

  centerLanding();
  $(window).resize(centerLanding);
  
  setNavOpacity();
  $(document).scroll(setNavOpacity);
  
  function centerLanding() {
    var canvas = $("#background").outerHeight();
    var arrowSize = $("#arrowdown").outerHeight();
    var fluffSize = 100;
    var landingSize;
    if ($("#super-center div").outerHeight() > 0) {
      landingSize = $("#super-center div").outerHeight();
    } else {
      landingSize = $("#super-center div").next().outerHeight();
    }
    var topOffset;
    if (canvas > landingSize + 10) {
      topOffset = (canvas - landingSize - arrowSize - fluffSize);
    } else {
      topOffset = 10;
    }
    $("#super-center").css("padding-top", topOffset + "px");
  }
  
  function setNavOpacity() {
    var fadeDist = $("#background").outerHeight();
    var scrolledDist = $(document).scrollTop();
    if (scrolledDist <= fadeDist) {
      var fractionFade = scrolledDist / fadeDist;
      var newColor = "rgba(200, 0, 0, " + fractionFade + ")";
      $(".navbar").css("background-color", newColor);
    }
  }
  
});
