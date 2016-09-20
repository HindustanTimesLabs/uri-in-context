function calcHeight(bp){
  bp == 'sm' ? y = 200 : y = 400;
  return y;
}

function draw(chartVal){

  var margin = {top: 40, right: 1, bottom: 30, left: 20},
      width = $('#month-chart').width() - margin.left - margin.right,
      height = calcHeight(breakpoint) - margin.top - margin.bottom;

  var x = d3.scaleBand()
      .range([0, width], .1);

  var y = d3.scaleLinear()
      .range([height, 0]);

  var xAxis = d3.axisBottom()
      .scale(x)

  var yAxis = d3.axisLeft()
      .scale(y)
      .ticks(5);

  var svg = d3.select("#month-chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



  d3.csv("data/months.csv", type, function(error, data) {

    x.domain(data.map(function(d) { return d.month; }));
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    y.domain([0, d3.max(data, function(d) {
      return d[chartVal];
    })]);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Frequency");

    //DATA JOIN
    var bar = svg.selectAll(".bar")
        .data(data);

    bar.enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.month)+4; })
        .attr("width", x.bandwidth()-4)
        .attr("y", function(d) { return y(d[chartVal]); })
        .attr("height", function(d) { return height - y(d[chartVal]); })
        .on('mouseover',function(d){
          $('#month-chart').append('<div class="chart-tip"></div>')
          $('.chart-tip').append('<div class="title">'+d.month+'</div>')
          $('.chart-tip').append('<div class="tip-item total"><div class="key">Total attacks</div><div class="value">'+d.attack+'</div></div>');
          $('.chart-tip').append('<div class="tip-item subtitle total"><div class="key">Total killed</div><div class="value">'+d.tot+'</div></div>');
          $('.chart-tip').append('<div class="tip-item"><div class="key">Militants</div><div class="value">'+d.mil+'</div></div>');
          $('.chart-tip').append('<div class="tip-item"><div class="key">Indian security forces</div><div class="value">'+d.sec+'</div></div>');
          $('.chart-tip').append('<div class="tip-item"><div class="key">Civilians</div><div class="value">'+d.civ+'</div></div>');
          var height = $('.chart-tip').height();
          $('.chart-tip').css({
            top: y(d[chartVal])-height+10,
            left: x(d.month)-((x.bandwidth()-4)/2)-20,
            width: x.bandwidth()*4
          });
        })
        .on('mouseout',function(){
          $('.chart-tip').remove();
        });


        // fix x axis labels for mobile
        $('.x.axis text').each(function(i,d){
          var ct = $(d).text();
          var nt = ct.slice(0,3);
          breakpoint == 'sm' ? $(d).text(nt) : $(d).text(ct)

        });
  });
}

function type(d) {
  d.attack = +d.attack;
  d.civ	= +d.civ;
  d.sec	= +d.sec;
  d.mil = +d.mil;
  d.tot = +d.tot;
  return d;
}

draw('attack');
