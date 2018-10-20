$( document ).ready(function( $ ) {
  $('.intro__slider').slick({
    'autoplay': true,
    'autoplaySpeed': 5000,
    'speed': 800,
    'arrows': false,
    'fade': true
  });

  $( '.header__menu-toggler' ).click(function( e ) {
    $('.header__menu').slideToggle();
    $('.header__menu').toggleClass('active');
  });

  $( ".header__menu-link" ).click(function( e ) {
    e.preventDefault();

    var offset = 80;
    $("html, body").animate({ scrollTop: $($(this).attr("href")).offset().top - offset }, 500);

    $(".header__menu-link").each( function(){
      $(this).parent('li').removeClass('header__menu-item_active');
    });
    $(this).parent('li').addClass('header__menu-item_active');

    if( $('.header__menu').hasClass('active') ){
       $('.header__menu').removeClass('active');
       $('.header__menu').slideUp();
    }
  });

  $(window).scroll(function() {
    var offset = 160;
		var scrollDistance = $(window).scrollTop() + offset;

		$('section').each(function(i) {
				if ($(this).position().top <= scrollDistance) {
						$('.header__menu li.header__menu-item_active').removeClass('header__menu-item_active');
						$('.header__menu-link').eq(i).parent('li').addClass('header__menu-item_active');
				}
		});
  }).scroll();
});
