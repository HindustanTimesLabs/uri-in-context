d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};
d3.selection.prototype.moveToBack = function() {
    return this.each(function() {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
            this.parentNode.insertBefore(this, firstChild);
        }
    });
};

/*DATA TYPES FOR CSV*/
function type(d){
  d.attacks = +d.attacks;
  d.civilian = +d.civilian;
  d.militant = +d.militant;
  d.secforce = +d.secforce;
  d.total = +d.total;
  return d;
}

/*CUSTOM BUCKETS*/
/*var bucketArrays = {
  a: [0,30,60,120,500,787],
  b: [0,2,10,50,250,426]
}*/
var buckets = [0,1,5,10,25,56];

function legend(data){

  //empty the legend
  $('.legend').empty();

  // add rows that will contain swatches and labels
  $('.legend').append('<div class="row swatch-container"></div><div class="row label-container"></div>')

  // generate buckets
  /*
  * AUTO-GENERATE QUINTILES
  */
  // max and interal
  /*var max = d3.max(data, function(d){
    return d.attacks;
  });
  var interval = max/5;
  var buckets = []; // quintiles
  for (var i = 0;i<=max;i+=interval){
    buckets.push(Math.floor(i));
  }*/
  buckets.forEach(function(d,i){
    $('.swatch-container').append('<div class="col-md-2 col-sm-2 col-xs-2 swatch bucket-'+(i+1)+'"></div>');
    $('.label-container').append('<div class="col-md-2 col-sm-2 col-xs-2 legend-label">'+d+'</div>')
  });

}

function colors(data,buckets){

  // max
  var max = d3.max(data, function(d){return d.attacks;});

  //assign quintiles
  for (var i = 0;i<buckets.length;i++){
    // current bucket and next bucket
    var cb = buckets[i];
    var nb = buckets[i+1];

    // loop through the data and assign buckets
    data.forEach(function(d,j){
      if (d.district != 'Pakistan Occupied Kashmir'){
        if (d.attacks != max){
          if (d.attacks >= cb && d.attacks<nb){
            $('path.subunit.district-'+d.censuscode).attr('bucket',i+1);
          }
        } else {
          $('path.subunit.district-'+d.censuscode).attr('bucket',5);
        }
      }
    })
  }// end bucket assignments

  $('.subunit').each(function(){

    var currBucket = $(this).attr('bucket');
    $(this).addClass('bucket-'+currBucket);

  });

}

function tip(data){

  // populate the tips
  data.forEach(function(d){

    $('.district-'+d.censuscode).mousemove(function(e){

      var color = $(this).css('fill');

      // just in case
      $('.subunit').removeClass('highlight');

      // dimensions of the tip
      var height = $('.tip').height();
      var width = $('.tip').width();
      var paddingLeft = +(($('.tip').css('padding-left')).split('p')[0]);
      width = width+(paddingLeft*2);
      var paddingTop = +(($('.tip').css('padding-top')).split('p')[0]);
      var winWidth = $(window).width();
      var winHeight = $(window).height()+$(window).scrollTop();

      // don't let overflow horizontal
      var left = e.pageX-((width)/2);
      var right = left + width;
      if (left<5){
        left = 5;
      } else if (right > (winWidth-5)){
        left = winWidth-5-width;
      } else {
        left = e.pageX-((width)/2);
      }

      //don't let overflow vertical
      var top = e.pageY+30;
      var bottom = top + height+20;

      if (bottom > winHeight-100){
        top = e.pageY-25-height;
      } else {
        top = e.pageY-25-height;
      }


      $('.tip').empty();
      $('.tip').append('<div class="title">'+d.district+'</div>');
      if (d.district != 'Pakistan Occupied Kashmir'){
        $('.tip').append('<div class="tip-item total"><div class="key">Total attacks</div><div class="value"><div class="swatch" style="background:'+color+'"></div>'+d.attacks+'</div></div>');
        $('.tip').append('<div class="tip-item subtitle total"><div class="key">Total fatalities</div><div class="value">'+d.total+'</div></div>');
        $('.tip').append('<div class="tip-item"><div class="key">Militants / terrorists</div><div class="value">'+d.militant+'</div></div>');
        $('.tip').append('<div class="tip-item"><div class="key">Indian security forces</div><div class="value">'+d.secforce+'</div></div>');
        $('.tip').append('<div class="tip-item"><div class="key">Civilians</div><div class="value">'+d.civilian+'</div></div>');
      }

      $('.tip').css({
        'left': left,
        'top': top
      });
      $('.tip').show();
    });
    $('.district-'+d.censuscode).mouseout(function(){
      $('.tip').hide();
    });
  });
}

$(document).ready(function(){

  var width = $('.map-wrapper').width(),
    height = $('#map').height(),
    centered;

  var projection = d3.geoAlbers()
      .center([0,34.85])
      .rotate([-77.55,0])
      .parallels([50, 60])
      .scale(6500);

  var path = d3.geoPath()
      .projection(projection)
      .pointRadius(2);

  var svg = d3.select("#map").append("svg")
      .attr("width", width)
      .attr("height", height)
      //.call(d3.zoom().on("zoom", redraw));

  var g = svg.append("g");

  // append the tip and hide it
  $('body').append('<div class="tip"></div>');
  $('.tip').hide();

  d3.json("data/jk_districts.json", function(error, data) {

    // error check
    if (error) throw error;

    // build subunits
    g.selectAll(".subunit")
        .data(topojson.feature(data, data.objects.jk_districts_2011).features)
      .enter().append("path")
        .attr("class", function(d) {
          // add classes, one for general subunit and another for the ac number
          return "subunit district-"+d.properties.censuscode;
        })
        .attr("d", path)
        .on("mouseover", function(d){
          // this is necessary to make the ac/internal border show
          d3.select(this).moveToFront();
          d3.selectAll('.place').moveToFront();
          d3.selectAll('.place-label').moveToFront();
          $('.highlight').removeClass('highlight');
        })
        .on("mouseout", function(d){
          // this is necessary to make the state/external border show
          d3.select(this).moveToBack();

        });

    d3.csv("data/districts.csv", type, function(error,data){

      // just keep this before we start filtering the data;
      var allData = data;



      results(data);

      function results(data){
        tip(allData);
        legend(data);
        colors(data,buckets);
      }

    }); // end csv*/

    // outer boundary
    g.append("path")
        .datum(topojson.mesh(data, data.objects.jk_districts_2011, function(a, b) { return a === b}))
        .attr("d", path)
        .attr("class", "subunit-boundary");

    // places
    g.append("path")
        .datum(topojson.feature(data, data.objects.places))
        .attr("d", path)
        .attr("class", "place");

    g.selectAll(".place-label")
        .data(topojson.feature(data, data.objects.places).features)
      .enter().append("text")
        .attr("class", "place-label")
        .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.properties.name; });

    g.selectAll(".place-label")
        .attr("x", function(d) { return d.geometry.coordinates[0] > -1 ? 6 : -6; })
        .style("text-anchor", function(d) { return d.geometry.coordinates[0] > -1 ? "start" : "end"; });


  }); // end json


});
