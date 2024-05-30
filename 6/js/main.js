var margin = {left:100, right: 10, top: 10, bottom: 100, };
var width = 600;
var height = 400;

var alternate = true;

var xScale = d3.scaleBand().range([0, width]).paddingInner(0.2).paddingOuter(0.3);
var yScale = d3.scaleLinear().range([height, 0]);

var svg = d3.select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var xAxisGroup = svg.append("g")
  .attr("class", "x-axis")
  .attr("transform", "translate(0," + height + ")");

var yAxisGroup = svg.append("g")
  .attr("class", "y-axis");

var yAxisLabel = svg.append("text")
  .attr("class", "y-axis-label")
  .attr("x", -height / 2)
  .attr("y", -60)
  .attr("font-size", "24px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Earnings ($)");

var xAxisLabel = svg.append("text")
  .attr("class", "x-axis-label")
  .attr("x", -height / 2)
  .attr("y", -60)
  .attr("font-size", "24px")
  .attr("text-anchor", "middle")
  .text("Month");

function updateVisualization(data) {
  var metric = alternate ? "revenue" : "profit";

  xScale.domain(data.map((d) => d.month));
  yScale.domain([0, d3.max(data, (d) => d[metric])]);

  var xAxis = d3.axisBottom(xScale);

  xAxisGroup.call(xAxis)
    .selectAll("text")
    .attr("dy", "0.35em")
    .style("font-size", "14px")
    .style("text-anchor", "middle");

  var yAxis = d3.axisLeft(yScale)
    .ticks(8)
    .tickFormat((d) => "$" + d / 1000 + "K");

  yAxisGroup.call(yAxis);

  svg.select(".x-axis-label")
    .attr("x", width / 2)
    .attr("y", height + 50);

  var label = alternate ? "Revenue" : "Profit";
  yAxisLabel.text(label);

  var bars = svg.selectAll(".bar").data(data);

  bars.exit().remove();

  bars.enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => xScale(d.month))
    .attr("y", (d) => yScale(d[metric]))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => height - yScale(d[metric]))
    .attr("fill", "yellow");
}

d3.json("data/revenues.json").then((data) => {
  data.forEach((d) => {
    d.revenue = +d.revenue;
    d.profit = +d.profit;
  });

  d3.interval(() => {
    updateVisualization(data);
    alternate = !alternate;
  }, 2000);

  updateVisualization(data);

}).catch((error) => {
  console.log(error);
});
