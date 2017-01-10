$(document).ready(function() {



// load svgs inline

    $('#Artboard_4_copy_4_part1_txt').load('../content_v2/2/6_Colors_illustrations/Artboard_4_copy_4_part1_txt.svg');
    $('#Artboard_4_copy_4_part2_txt').load('../content_v2/2/6_Colors_illustrations/Artboard_4_copy_4_part2_txt.svg');
    $('#Artboard_4_txt').load('../content_v2/2/6_Colors_illustrations/Artboard_4_txt.svg');





// scroll down detection

    $(window).on('scroll', function () {
        if($(window).scrollTop() > 300) {
            $('body').addClass('scrolledPastMenu');
        }
        else {
            $('body').removeClass('scrolledPastMenu');
        }
    });





    /******************************************************
     navigation
     ******************************************************/

// clone main menu from header to frontPage main

    $('header .mainMenu').children().clone().appendTo('.frontPage main .mainMenu');





// clone main menu chapters into sub- and introMenu

    $('header .mainMenu > ul > li').each(function() {
        if ($(this).attr('class') === $('nav.sub').attr('data-chapter')) {
            $(this).children().clone().appendTo('nav.sub, .introMenu');
            $(this).addClass('active');
        }
    });

    $("ul.navbar-nav > li").removeClass("active");
    $("ul.navbar-nav > li").each(function () {
        if ($(this).find("a").text() == $("h1").text()) {
            $(this).addClass("active");
        }
    });

    $("ul.navbar-nav > li").each(function () {
        if ($(this).find("a").text() == $("h1").attr('id')) {
            $(this).addClass("active");
        }
    });




// set menu location based on sub nav id

    var subNavLocation = parseInt($('nav.sub').attr('id'));
    $('nav.sub a').eq(subNavLocation).addClass('selected');
    $('.mainMenu .active a').eq(subNavLocation).addClass('selected');





// create nextPage link (if no introMenu)

    if (!$('.introMenu').length) {
        $('.mainMenu .active a').eq(subNavLocation + 1).clone().appendTo('main .inner').addClass('nextPage');
    }





// header nav expansion

    $('header button').on('click', function () {
        $('header').toggleClass('open');
    });





    /******************************************************
     title, headings and structure
     ******************************************************/

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





    /******************************************************
     NOT IN USE
     ******************************************************/

	/*

	 // load all images from examples preview folder and link to large versions

	 var examplesPreview = "../content/0autoload/examples/preview/";
	 var examplesLarge = "../content/0autoload/examples/large/";

	 $.ajax({
	 url : examplesPreview,
	 success: function (data) {
	 $(data).find('a').attr('href', function (i, val) {
	 if( val.match(/\.(svg|png|jpg|jpeg|gif)$/) ) {
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





	 // click open preview images in popups, basic version

	 $('.preview, .previews a').on('click', function (g) {
	 g.preventDefault();
	 var imagePath = $(this).children('img').attr('src');
	 $('body').append('<div class="popup"><img src="' + imagePath + '"></div><div class="pageFade"></div>');
	 setTimeout(function () {
	 $('.popup').css('top', $(window).scrollTop());
	 }, 100);
	 });





	 // window width indicator

	 var indicateWidth = $('<span class="widthIndicator"></span>');

	 $('body').prepend(indicateWidth);

	 $(window).on('load resize', function () {
	 indicateWidth.text($(window).width());
	 });



	 */




});// end jquery