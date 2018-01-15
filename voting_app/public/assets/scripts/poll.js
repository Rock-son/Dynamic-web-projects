'use strict'

const d3 = require("d3");


document.addEventListener("DOMContentLoaded", onContentLoaded);


// container object's width and height

	var w = +window.innerWidth / 1.5,
		h = +window.innerHeight / 1.2,
		margin =  {
        top: 100,
        bottom: 80,
        left: 80,
        right: 40
      },
      width = w - margin.left - margin.right,
      height = h - margin.top - margin.bottom,
      tooltip = null;


// onload event listener callback function
function onContentLoaded(response) {
  
  const poll = JSON.parse(document.getElementById("poll_data").value),
        data = poll.options,
        description = poll.title,
        max = d3.max(data, entry => entry[1]),
        x =  d3.scaleBand()
                      .domain(data.map(entry => entry[0]))
                      .range([0, width]),
        y = d3.scaleLinear()
                      .domain([0, max])
                      .range([height, 0]),
        yGridLines = d3.axisLeft()
                             .scale(y)
                             .tickSize(-width, 0, 0)
                             .tickFormat("")
                             .ticks(max),
        linearColorScale = d3.scaleLinear()
                              .domain([0, data.length])
                              .range(["#572500", "#F68026"]),
        xAxis = d3.axisBottom()
                 .scale(x)
                 .tickPadding(25)
                 .tickSize(0),
        yAxis = d3.axisLeft()
                  .scale(y)
                  .ticks(max)
                  .tickPadding(10)
                  .tickSize(-width, 10, -10),
        svg  = d3.select("body")
                   .append("svg")
                      .attr("id", "chart")
                      .attr("width", w)
                      .attr("height", h),
        chart = svg.append("g")
                     .classed("display", true)
                     .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
      
        tooltip = d3.select('body')
                      .append('div')
                      .classed("tooltip", true);
      
        chart.append('text')
                    .classed("chart-title", true)
                    .html(description)
                    .attr("x", width/2)
                    .attr("y", -40)
                    .attr("transform", "translate(0,0)")
                    .style("text-anchor", "middle");
      
      
          plot.call(chart, {
            description: description,
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
                  .attr("dx", -30)
                  .attr("dy", 10)
                  .attr("transform", "rotate(-45)") /* rotate(-45)*/
                  .style("font-size", "1.5rem");
        
          this.append("g")
              .classed("y axis", true)
              .attr("transform", "translate(0,0)")
              .call(params.axis.y)
                .selectAll("text")
                  .classed("y-axis-label", true)
                  .style("text-anchor", "middle")  //"end" and dx = -8 - with rotation
                  .attr("dx", -20)
                  .attr("dy", 8)
                  .attr("transform", "translate(0,0)") /* rotate(-45)*/
                  .style("font-size", "1.5rem")
                  .style("font-weight", "700");
        
          //draw axis anchors
          this.select(".y.axis")
              .append("text")
              .text("Votes")
              .attr("x", -(height/2))
              .attr("y", -45)
              .attr("transform", "rotate(-90)")
              .attr("fill", "#555")
              .style("text-anchor", "middle")
              .style("font-variant", "small-caps")
              .style("font-size", "2.5rem");
                     
    
      }
    
      function plot(params) {
        
        var barWidth = Math.ceil(width / params.data.length);
      // Object.assign({}, params, {xScale: {domain: [params.dates.minDate, params.dates.maxDate], range: [0, width]}, 
      //                            yScale: {domain: [0, d3.max(params.data, entry => entry[1])]}, range: [0, height]
      //                           });
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
            .attr("x", (d, i) => params.xScale(d[0]))
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
    
