var margin = {left:100, right: 10, top: 10, bottom: 100, };
var width = 600;
var height = 400;

var idx = 0;
var dataLength = 0;

var svg = d3.select('#chart-area')
.append('svg')
.attr('width', width + margin.right + margin.left)
.attr('height', height + margin.top + margin.bottom + 1)
.append("g")
.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

d3.json("data/data.json").then(function(dataset){
	console.log(dataset);

	var yearsData = dataset.map ( (d) => {return d.year;});

	const processedData = dataset.map((year) => {
		return year["countries"].filter((country) => {
			var canPlot = (country.income && country.life_exp);
			return canPlot;
		}).map((country) => {
			country.income = +country.income;
			country.life_exp = +country.life_exp;
			return country;
		})
	});

	dataLength = yearsData.length;

	var yScale = d3.scaleLinear().range([0, height]).domain([90, 0]);
	var yAxis = d3.axisLeft(yScale);

	svg.append("g").attr("class", "left axis").call(yAxis);

	var xScale = d3.scaleLog().domain([142, 150000]).range([0, width]).base(10);
	var areaScale = d3.scaleLinear().domain([2000, 1400000000]).range([25*Math.PI, 1500*Math.PI]);
    var xAxis = d3.axisBottom(xScale).tickValues([400, 4000, 40000]).tickFormat(d3.format("($d"));

    svg.append("g")
		.attr("class", "bottom axis")
		.attr("transform", "translate(0, " + height + ")")
		.call(xAxis);

	var xLabel = svg.append("text")
        .attr("class", "y axis-label")
        .attr("x", width - 60)
        .attr("y", height - 20)
        .attr("font-size", "28px")
        .attr("text-anchor", "right")
        .style("fill","gray");

	var yLabel = svg.append("text")
        .attr("class", "y axis-label")
        .attr("x", -height/2)
        .attr("y", -60)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .style("fill","black")
		.text("Life Expectancy (Years)");

	svg.append("text")
        .attr("class", "y axis-label")
        .attr("x", width / 2)
        .attr("y", height + margin.top)
        .attr("transform", "translate(0, " + (40) + ")")
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .style("fill","black")
        .text("GDP Per Capita ($)");


	var continents = ["africa", "americas", "asia", "europe"];
	var boxContinents = svg.append("g").attr("transform", "translate(" + (width - 10) + "," + (height - 125) + ")");
	var colors = {asia: "yellow", americas: "blue", europe: "red", africa: "brown"};

	continents.forEach((continent, i) => {
		var boxRow = boxContinents.append("g").attr("transform", "translate(0, " + (i * 20) + ")");
		boxRow.append("rect").attr("width", 10).attr("height", 10).attr("fill", colors[continent]);
		boxRow.append("text").attr("x", -10).attr("y", 10).attr("text-anchor", "end").style("text-transform", "capitalize").text(continent);
	});

	var time = d3.transition().duration(400);
	updatePlot(processedData);
	d3.interval( () => {
		idx++;
		if (idx == dataLength){
			idx = 0;
		}
		updatePlot(processedData);
	}, 200);

	function updatePlot(data){
        xLabel.text(yearsData[idx]);

		var circles = svg.selectAll('circle').data(data[idx]);

        circles.exit().remove();

		circles.enter().append("circle")
		.attr("fill", (d) => {return colors[d.continent]})
		.merge(circles)
		.transition(time)
		.attr("cx", (d) => { return xScale(d.income); })
		.attr("cy", (d) => { return yScale(d.life_exp); })
		.attr("r", (d) => {return Math.sqrt(areaScale(d.population)/ Math.PI)});
	}

})


