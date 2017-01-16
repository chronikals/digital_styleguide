$(document).ready(function() {

// load svgs inline

    $('#Artboard_4_copy_4_part1_txt').load('../content_v2/2/6_Colors_illustrations/Artboard_4_copy_4_part1_txt.svg');
    $('#Artboard_4_copy_4_part2_txt').load('../content_v2/2/6_Colors_illustrations/Artboard_4_copy_4_part2_txt.svg');
    $('#Artboard_4_txt').load('../content_v2/2/6_Colors_illustrations/Artboard_4_txt.svg');


// scroll down detection
    /*
    $(window).on('scroll', function () {
        if($(window).scrollTop() > 300) {
            $('body').addClass('scrolledPastMenu');
        }
        else {
            $('body').removeClass('scrolledPastMenu');
        }
    }); */


    /******************************************************
     navigation
     ******************************************************/

// clone main menu from header to frontPage main

    $('header .mainMenu').children().clone().appendTo('.frontPage main .mainMenu');


// clone main menu chapters into sub- and introMenu

    $('header .mainMenu > ul > li').each(function() {
        if ($(this).attr('class') === $('nav.sub').attr('data-chapter')) {
            $(this).addClass('active');
        }
    });



// set menu location based on sub nav id

    var subNavLocation = parseInt($('nav.sub').attr('id'));
    $('nav.sub a').eq(subNavLocation).addClass('selected');
    $('.mainMenu .active a').eq(subNavLocation).addClass('selected');

// header nav expansion

    $('#menupress').click(function () {
        $('header').toggleClass('open');
    });

    $('#menupress2').click(function () {
        $('header').toggleClass('open');
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
    /*
    $('h2').wrapInner('<a class="headingLink heading2" href="#"></a>');
    $('h3').wrapInner('<a class="headingLink heading3" href="#"></a>');
     */
    // show path to heading on click

    /*
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
    */

});// end jquery



//script for auto-closing hamburger-menu when user clicks outside the container which has the menu

$(document).mouseup(function (e)
{
    var container = $('header .mainMenu');
    var hamburger = $('header');

    if (!hamburger.is(e.target) // if the target of the click isn't the container...
        && hamburger.hasClass('open'))
    {
        hamburger.toggleClass('open');
    }

    $('#menupress').click(function(event){
        var hamburger = $('header');
        hamburger.toggleClass('open');;
    });

    $('#menupress2').click(function(event){
        var hamburger = $('header');
        hamburger.toggleClass('open');;
    });

});

