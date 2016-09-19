$(document).ready(function(){
  // mobile logo
  function mobileLogo(x) {
    if (x < 480) {
      $('.navbar-brand img').attr('src', 'img/ht-logo-sq.png');
    } else {
      $('.navbar-brand img').attr('src', 'img/navlogo.png');
    }
  }

  mobileLogo($(window).width());
  $(window).resize(function() {
    mobileLogo($(window).width());
  });

  // sharing
  var url = window.location.href;
  //share hrefs
  var twitterShare = 'https://twitter.com/home?status=UP%202012%20election%20map%20'+ url;
  $('.twitter-share').attr('href', twitterShare);
  var facebookShare = 'https://www.facebook.com/sharer/sharer.php?u=' + url;
  $('.facebook-share').attr('href', facebookShare);
});
