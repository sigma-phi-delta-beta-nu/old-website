$(document).ready(function() {
    $('#about_us_drop_down').hide();
	$('.flexslider').flexslider();
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
	$('#about_us').mouseenter(function() {
		$('#about_us_drop_down').fadeIn('slow');
	});
	$('.drop_down_container').mouseleave(function() {
		$('#about_us_drop_down').fadeOut('slow');
    });
});
