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

// create nextPage link (if no introMenu)

	if (!$('.introMenu').length) {
		$('.mainMenu .active a').eq(subNavLocation + 1).clone().appendTo('footer').addClass('nextPage');
	}


// set menu location based on sub nav id

    var subNavLocation = parseInt($('nav.sub').attr('id'));
    $('nav.sub a').eq(subNavLocation).addClass('selected');
    var subNavList = $('nav.sub a').eq(subNavLocation).childNodes;
    $('.mainMenu .active a').eq(subNavLocation).addClass('selected');
    var subNavList2 = $('.mainMenu .active a').eq(subNavLocation).childNodes;


    $("aside > ul > li > ul > li").removeClass("active");
    $("aside > ul > li > ul > li").each(function () {
        if ($(this).find("a").text() == $("h1").text()) {
            $(this).find("a").addClass("active");
        }
    });

    /* Highlighting of submenus when each page loads - WORK IN PROGRESS
    $("aside > ul > li").each(function () {
        $(this).find("ul").addClass("in");
        if ($(this).attr("id") == $("#location").attr("data-chapter")) {
            $(this).find("ul").addClass("in");
            $(this).find("a").data("aria-expanded","true");
            $(this).find("ul").data("aria-expanded","true");
        }
    });*/
    


     /******************************************************
     title, headings and structure
     ******************************************************/

//	set title same as h1

    document.title =  $('h1').text() + ' - UI Styleguide';

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



//JS for exapanding on hover Metis menu
/*
(function($) {
  $(document).ready(function() {  
    var $this = $('#menu-components'), resizeTimer, self = this;    
    var initCollapse = function(el) {
      if ($(window).width() >= 768) {
        this.find('li').has('ul').children('a').off('click');
      }
    }
    $(window).resize(function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(self.initCollapse($this), 250);
    });    
  });
})(jQuery);
*/


/* copy loaded thumbnails into carousel */
$('.BrandGuidelineCarousel').on('load', function() {
  
}).each(function(i) {
  if(this.complete) {
  	var item = $('<div class="item"></div>');
    var itemDiv = $(this).parents('div');
    var title = $(this).parent('a').attr("title");
    
    item.attr("title",title);
  	$(itemDiv.html()).appendTo(item);
  	item.appendTo('.carousel-inner'); 
    if (i==0){ // set first item active
     item.addClass('active');
    }
  }
});



/* activate the carousel */
$('#modalCarousel').carousel({interval:false});

/* change modal title when slide changes */
$('#modalCarousel').on('slid.bs.carousel', function () {
  $('.modal-title').html($(this).find('.active').attr("title"));
})

/* when clicking a thumbnail */
$('.BrandGuidelineCarousel-item').click(function(){
    var idx = $(this).index();
  	var id = parseInt(idx);
  	$('#myModal').modal('show'); // show the modal
    $('#modalCarousel').carousel(id); // slide carousel to selected
  	
});