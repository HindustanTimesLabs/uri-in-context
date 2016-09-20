// calc breakpoint
function calcBreak(x){
  x<480 ? y = 'sm' : y = 'md';
  return y;
}
var breakpoint = calcBreak($(window).width());
$(window).resize(function(){
  var breakpoint = calcBreak($(window).width());
});

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
  var twitterShare = 'https://twitter.com/home?status=In some ways, the Uri attack was typical. '+ url + ' via @htTweets';
  $('.twitter-share').attr('href', twitterShare);
  var facebookShare = 'https://www.facebook.com/sharer/sharer.php?u=' + url;
  $('.facebook-share').attr('href', facebookShare);
});
