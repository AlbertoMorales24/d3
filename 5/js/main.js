var margin = {left:100, right: 10, top: 10, bottom: 100, };

var width = 600;
var height = 400;

var g = d3.select('#chart-area')
.append('svg')
.attr('width', width + margin.right + margin.left)
.attr('height', height + margin.top + margin.bottom + 1)
.append("g")
.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");


d3.json('data/buildings.json').then((data) => {
    var max = 0;
    data.forEach((d)=>{
        d.height = +d.height;
        if (d.height > max){
            max = d.height;
        }
    });

    var names = data.map((d) => { return d.name; });
        
    var x = d3.scaleBand()
        .domain(names)
        .range([0, width])
        .paddingInner(0.3)
        .paddingOuter(0.3);
        
    var y = d3.scaleLinear()
        .domain([0, max])
        .range([0, height]);
        
    var rects = g.selectAll('rect').data(data)

    rects.enter()
    .append('rect')
    .attr('x', (d) => x(d.name))
    .attr('y', (d) => height - y(d.height))
    .attr('width', x.bandwidth())
    .attr('height', (d) => y(d.height))
    .attr('fill', "blue");
    
    var botAxis = d3.axisBottom(x);
    
    g.append("g")    
    .attr("class", "bottom axis")
    .attr("transform", "translate(0, " + height + ")")
    .call(botAxis)
    .selectAll("text")
    .attr("y", "15")
    .attr("x", "0")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-20)");
    
    var yAxis = d3.axisLeft(y)
    .tickFormat((d) => { return d != 800 ? (d-800 + "m").slice(1) : "0m"; });

    g.append("g")
    .attr("class", "left axis")
    .call(yAxis);

    g.append("text")
    .attr("class", "y axis-label")
    .attr("x", -(height - 200))
    .attr("y", -50)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Height (m)");

    g.append("text")
    .attr("class", "x axis-label")
    .attr("x", (width - 300))
    .attr("y", height + 130)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(0, -40)")
    .text("The word's tallest buildings");
        
}).catch((error) => {
    console.log(error);
});