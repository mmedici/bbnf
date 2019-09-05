/*-------------------------------------------------------------------------------
PRE LOADER
-------------------------------------------------------------------------------*/

$(window).load(function(){
    $('.preloader').fadeOut(800); // set duration in brackets    
});


/* Back top
-----------------------------------------------*/
var btn = $('.go-top');

$(window).scroll(function() {
    if ($(window).scrollTop() > 300) {
        btn.addClass('show');
    } else {
        btn.removeClass('show');
    }
});

btn.on('click', function(e) {
    e.preventDefault();
    $('html, body').animate({scrollTop:0}, '300');
});


/* In order to fix stuck parallax when opening closing collapsibles 
-------------------------------------------------*/
function helpParallax() {
    jQuery(window).trigger('resize').trigger('scroll');
}

/* find all 'details' on page and add the attribute to chekc ontoggles */
var matches = document.querySelectorAll('details');
for (var i = 0; i < matches.length; i++) {
    matches[i].setAttribute('ontoggle', 'helpParallax()');
}
