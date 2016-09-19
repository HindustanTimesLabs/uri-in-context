var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = $('#month-chart').width() - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

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
  y.domain([0, d3.max(data, function(d) { return d.attack; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.month)+4; })
      .attr("width", x.bandwidth()-4)
      .attr("y", function(d) { return y(d.attack); })
      .attr("height", function(d) { return height - y(d.attack); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

});

function type(d) {
  d.attack = +d.attack;
  d.civ	= +d.civ;
  d.sec	= +d.sec;
  d.mil = +d.mil;
  d.tot = +d.tot;
  return d;
}
