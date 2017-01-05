$(document).ready(function() {



// load all images from examples preview folder and link to large versions

	var examplesPreview = "../content/0autoload/examples/preview/";
	var examplesLarge = "../content/0autoload/examples/large/";
	
	$.ajax({
		url : examplesPreview,
		success: function (data) {
			$(data).find('a').attr('href', function (i, val) {
				if( val.match(/\.(jpg|jpeg|png|gif)$/) ) { 
					$('.examples').append('<a href="' + examplesLarge + val +'"><img src="'+ examplesPreview + val +'"></a>');
				} 
			});
		}
	});
	
	
	
	
	
// click open preview images in popups

	// ('click', '*') to target appended element.
	$('.previews').on('click', 'a' ,  function (g) {
		g.preventDefault();
		var largeImagePath = $(this).attr('href');
		$('body').append('<div class="popup"><img src="' + largeImagePath + '"></div><div class="pageFade"></div>');
		setTimeout(function () {
			$('.popup').css('top', $(window).scrollTop());
		}, 100);
	});
		
	// ('click', '*') to target appended element.
	$('body').on('click', '.pageFade' , function () {
		$('.popup, .pageFade').remove();
	});





// clone main menu from header to frontPage main	
	
	$('header .mainMenu').children().clone().appendTo('.frontPage main .mainMenu');





// clone main menu chapters into sub- and introMenu

	//$('header .mainMenu > ul > li').each(function() {
	//	if ($(this).attr('class') === $('nav.sub').attr('data-chapter')) {
	//		$(this).children().clone().appendTo('nav.sub, .introMenu');
	//	}
	//});
	$("ul.navbar-nav > li").removeClass("active");
	$("ul.navbar-nav > li").each(function () {
	    if ($(this).find("a").text() == $("h1").text()) {
	        $(this).addClass("active");
	    }
	});



// set sub nav location based on nav id	
	
	// get number from nav id		
	var subNavLocation = parseInt($('nav.sub').attr('id'));
	
	// use number to mark selected link		
	$('nav.sub a').eq(subNavLocation).addClass('selected');


//	set title same as h1
	document.title =  $('h1').text() + ' - ABB Style Guide';





// id headings and show their path on click

	// add sequential ids to headings

	$('h2').attr('id', function (nummer) {
		return 'part_' + (nummer + 2);
	});
	
	$('h3').attr('id', function (nummer) {
		return 'info_' + (nummer + 1);
	});
	
	// wrap headings text in links

	$('h2').wrapInner('<a class="headingLink heading2" href="#"></a>');
	$('h3').wrapInner('<a class="headingLink heading3" href="#"></a>');

	// show path to heading on click
	
	$('.headingLink').on('click', function (j) {
		j.preventDefault();
		var headingID = $(this).parent().attr('id');
		var correspondingBox = $(this).next('.urlBox');
		if (correspondingBox.length) {
			correspondingBox.remove();
		}
		else {
			$(this).after('<span class="urlBox">' + this.href + headingID + '</span>');			
		}
	});	





// window width indicator
	
	var indicateWidth = $('<span class="widthIndicator"></span>');
		
	$('body').prepend(indicateWidth);

	$(window).on('load resize', function () {
		 indicateWidth.text($(window).width());
	});







	





});// end jquery