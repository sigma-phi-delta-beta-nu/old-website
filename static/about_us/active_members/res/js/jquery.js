$(document).ready(function() {
	$('.submenu_animate div').mouseenter(function() {
		$(this).animate({
			padding: '0.7em'
		}, 100);
	});
	$('.submenu_animate div').mouseleave(function() {
		$(this).animate({
			padding: '0.5em',
		}, 100);
	});
});
