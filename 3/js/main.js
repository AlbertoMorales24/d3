d3.csv("data/ages.csv").then((data)=> {

	console.log(data);

});

d3.tsv("data/ages.tsv").then((data)=> {

	console.log(data);

});

var svg = d3.select("#chart-area").append("svg").attr("width", 400).attr("height", 400);  

var info = [];

d3.json("data/ages.json").then((data)=> {
    data.forEach((d)=>{
		d.age = +d.age;
        info.push(d.age)
	});
	console.log(data);
    var circles = svg.selectAll("circle").data(info);  
    circles.enter()
    .append("circle")
    .attr("cx", (d,i) => { return (i * 50) + 50})
    .attr("cy", 50)
    .attr("r", (d) => { return d; })
    .attr("fill",(d) => { 
        if(d > 10){
            return ("red");
        } else {
            return ("blue");
        }
    });
});


