const svg = d3.select("#chart-area").append("svg").attr('width', 500).attr('height', 500);

d3.json("data/buildings.json").then((data)=> {
  var names = data.map((d) => d.name);

  var x = d3.scaleBand()
      .domain(names)
      .range([0, 500])
      .paddingInner(0.3)
      .paddingOuter(0.3);

  var y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.height)])
      .range([500, 0]);

  var color = d3.scaleOrdinal()
      .domain(names)
      .range(d3.schemeSet3);

  var rectangles = svg.selectAll('rect').data(data);

  rectangles.enter().append('rect')
      .attr('x', (d) => x(d.name))
      .attr('y', (d) => y(d.height))
      .attr('width', x.bandwidth())
      .attr('height', (d) => 500 - y(d.height))
      .attr('fill', (d) => color(d.name));
}).catch((error) => {
  console.log(error);
});



