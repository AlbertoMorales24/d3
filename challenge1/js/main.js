var svg = d3.select("#chart-area").append("svg").attr("width", 400).attr("height", 400);

var info = [];

d3.json("data/buildings.json").then((data)=> {
	data.forEach((d)=>{
		d.height = +d.height;
        info.push(d.height)
	});

    var rectangles = svg.selectAll("rect").data(info);

    rectangles.enter().append("rect")
    .attr("x",(d,i)=>{
        return (i*info.length*3);
    })
    .attr("y",(d,i)=>{
        return (Math.max(...info)-d);
    })
    .attr("width",20)
    .attr("height",(d)=>{return d;})
    .attr("fill","blue");
}).catch((error) => {
    console.log(error);
});


