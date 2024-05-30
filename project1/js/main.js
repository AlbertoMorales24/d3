var margin = {left:100, right: 10, top: 10, bottom: 100, };

var width = 600;
var height = 400;

var g = d3.select('#chart-area')
    .append('svg')
        .attr('width', width + margin.right + margin.left)
        .attr('height', height + margin.top + margin.bottom + 1)
        .attr('fill', 'black')
    .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

d3.json('data/revenues.json').then((data) => {
    var max = 0;
    data.forEach((d)=>{
        d.revenue = +d.revenue;
        if (d.revenue > max){
            max = d.revenue;
        }
    });

    var months = data.map ((d) => {return d.month;});

    var x = d3.scaleBand()
        .domain(months)
        .range([0, width])
        .paddingInner(0.3)
        .paddingOuter(0.3);

    var y = d3.scaleLinear()
        .domain([max, 0])
        .range([0, height]);
        
    var rects = g.selectAll('rect').data(data)

    rects.enter()
    .append('rect')
    .attr('x', (d) => {return x(d.month);})
    .attr('y', (d) => {return y(d.revenue);})
    .attr('width', x.bandwidth())
    .attr('height', (d) => {return height - y(d.revenue);})
    .attr('fill', 'yellow');
            
    var xAxis = d3.axisBottom(x);
    g.append("g")
    .attr("class", "bottom axis")
    .attr("transform", "translate(0, " + height + ")")
    .call(xAxis)
    .selectAll("text")
    .attr("y", "20")
    .attr("x", "15")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(0)");

    var yAxis = d3.axisLeft(y)
    .ticks(10)
    .tickFormat((d) => { return "$" +d/1000 + "K"; });

    g.append("g")
    .attr("class", "left axis")
    .call(yAxis);

    g.append("text")
    .attr("class", "x axis-label")
    .attr("x", (width / 2))
    .attr("y", height * 1.25)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(0, -50)")
    .text("Month");

    g.append("text")
    .attr("class", "y axis-label")
    .attr("x", - (height / 2))
    .attr("y", -50)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Revenue (dlls.)");

}).catch((error) => {
    console.log(error);
});