'use strict'

const d3 = require("d3");


document.addEventListener("DOMContentLoaded", main);


// container object's width and height

	var w = +window.innerWidth / 1.33,
		h = +window.innerHeight / 1.10,
		margin =  {
        top: 40,
        bottom: 80,
        left: 80,
        right: 20
      },
      width = w - margin.left - margin.right,
      height = h - margin.top - margin.bottom,
      tooltip = null;


// onload event listener callback function
function onDataLoad(response) {
  
	var data = response.data,
      description = response.description,
      minDate = new Date(data[0][0]),
      maxDate = new Date(data.slice(-1)[0][0]),
      x =  d3.scaleTime()
                  .domain([minDate, maxDate])
                  .range([0, width]),
      y = d3.scaleLinear()
                  .domain([0, d3.max(data, entry => entry[1])])
                  .range([height, 0]),
      yGridLines = d3.axisLeft()
                         .scale(y)
                         .tickSize(-width, 0, 0)
                         .tickFormat(""),
      linearColorScale = d3.scaleLinear()
                                 .domain([0, data.length])
                                 .range(["#572500", "#F68026"]),
      xAxis = d3.axisBottom()
              .scale(x),
      yAxis = d3.axisLeft()
              .scale(y),

      svg  = d3.select("#context")
               .append("svg")
                  .attr("id", "chart")
                  .attr("width", w)
                  .attr("height", h),
      chart = svg.append("g")
                 .classed("display", true)
                 .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
  console.log(data);
      tooltip = d3.select('body')
                  .append('div')
                  .classed("tooltip", true);
  
    chart.append('text')
                .classed("chart-title", true)
                .html("Gross Domestic Product, USA")
                .attr("width", 200)
                .attr("height", 200)
                .attr("x", width/2)
                .attr("y", 0)
                .attr("transform", "translate(0,0)")
                .style("text-anchor", "middle");
    d3.select('body')
          .append('div')  
          .classed("codedBy", true)
          .style("font-size", "0.5rem")
          .style("margin", "auto")
          .style("width", "100px");
    d3.select(".codedBy")
            .append("a")
              .classed("svglink", true)
              .html("Coded by Roky")
              .attr("href", "https://codepen.io/Roky/full/YqGqWg")
              .attr("target", "_blank");
  
  
    	plot.call(chart, {
        description: description,
        dates: {
            minDate: minDate,
            maxDate: maxDate
        },
				data: data,
				axis: {
						x: xAxis,
						y: yAxis
				},
        xScale: x,
        yScale: y,        
				gridlines: yGridLines,
				initialize: true
	});
}

	function drawAxis(params) {

			//draw gridlines
			this.append("g")
          .classed("gridline", true)
          .attr("transform", "translate(0,0)")			
          .call(params.gridlines);
			//draw axis
			this.append("g")
          .classed("x axis", true)
          .attr("transform", "translate(0," + height +")")
          .call(params.axis.x)
            .selectAll("text")
              .classed("x-axis-label", true)
              .style("text-anchor", "middle")  //"end" and dx = -8 - with rotation
              .attr("dx", 0)
              .attr("dy", 8)
              .attr("transform", "translate(0,0)"); /* rotate(-45)*/
			this.append("g")
          .classed("y axis", true)
          .attr("transform", "translate(0,0)")
          .call(params.axis.y)

			//draw axis anchors
			this.select(".y.axis")
          .append("text")
          .text("Gross Domestic Product, USA")
          .attr("x", 0)
          .attr("y", 15)
          .attr("transform", "rotate(-90)")
          .attr("fill", "#333")
          .style("text-anchor", "end");
			this.select(".x.axis")
          .append("text")
            .text(params.description.slice(0, params.description.indexOf("http") - 4))          
            .attr("dx", width/2)
            .attr("dy", 50)
            .style("fill", "steelblue")
            .style("font-size", "0.8rem")
            .style("text-anchor", "middle");            
      this.select(".x.axis")
          .append("a")
            .classed("svglink", true)
            .attr("xlink:href", params.description.slice(params.description.indexOf("http"), -1))
            .attr("xlink:show", "new")
          .append('text')
            .text(params.description.slice(params.description.indexOf("http"), -1))
            .attr("dx", width/2)
            .attr("dy", 70)
            .style("fill", "steelblue") 
            .style("font-size", "0.8rem")
            .style("text-anchor", "middle");
	}

	function plot(params) {
    
    var barWidth = Math.ceil(width / params.data.length);
    Object.assign({}, params, {xScale: {domain: [params.dates.minDate, params.dates.maxDate], range: [0, width]}, 
                               yScale: {domain: [0, d3.max(params.data, entry => entry[1])]}, range: [0, height]
                              });
	//	params.xScale.domain([params.dates.minDate, params.dates.maxDate]).range([0, width]);
	//	params.yScale.domain([0, d3.max(params.data, entry => entry[1])]);
		//draw the axes
		drawAxis.call(this, params);

		//enter()
		this.selectAll(".bar")
        .data(params.data)
        .enter()
          .append("rect")
          .classed("bar", true)
          .on("mouseover", handleMouseOver)
          .on("mouseout", handleMouseOut);

		this.selectAll(".bar-label")
				.data(params.data)
				.enter()
					.append("text")
					.classed("bar-label", true);

		//update()
		this.selectAll(".bar")
				.attr("x", (d, i) => params.xScale(new Date(d[0])))
        .attr("y", (d, i) => params.yScale(d[1]))
        .attr("width", (d, i) => barWidth)
        .attr("height", (d, i) => height - params.yScale(d[1]));
		//exit()
		this.selectAll(".bar")
        .data(params.data)
        .exit()
        .remove();
			
		this.selectAll(".bar-label")
        .data(params.data)
        .exit()
        .remove();
	}
  
  function handleMouseOver(d, i) {
    
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    d3.select(this).attr("fill", "orange");    
    tooltip.html('<span style="font-size: 1rem; font-weight: 700;">' + d[1].toLocaleString({useGrouping: true, maximumFractionDigits: 4}) +
                 "$ Billion</span>" + '<br><span">' + new Date(d[0]).getFullYear() + ' - ' + months[new Date(d[0]).getMonth()] +'</span>')
           .transition()
           .duration(0)
           .style("left", (d3.event.pageX + 15) + "px")
           .style("top", (d3.event.pageY - 50) + "px")
           .style("opacity", .7);
  }
  function handleMouseOut(d, i) {
    
    d3.select(this).attr(
              "fill", "steelblue"
            );
    tooltip.transition()
           .duration(300)
           .style("opacity", 0)
           .style("top", 0)
           .style("left", 0);
  }