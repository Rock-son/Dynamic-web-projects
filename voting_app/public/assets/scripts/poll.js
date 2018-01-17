'use strict'

//const d3 = require("d3");


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
        data = poll.options.map((item, index) => { return {key: item[0], value: item[1]} }),
        max = d3.max(data, entry => entry.value),
  x = d3.scale.ordinal()
        .domain(data.map(function(entry) {return entry.key}))
        .rangeBands([0, width]),
  y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) {return d.value})])
        .range([height, 0]),
  yGridLines = d3.svg.axis()
            .scale(y)
            .tickSize(-width, 0, 0)
            .tickFormat("")
            .orient("left")
            .ticks(max),
  linearColorScale = d3.scale.linear()
                .domain([0, data.length])
                .range(["#572500", "#F68026"]),
  ordinalColorScale = d3.scale.category20(),
  xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom")
          .tickSize(0),
  yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .ticks(max),
  svg  = d3.select("#graph").append("svg")
              .attr("id", "chart")
              .attr("width", w)
              .attr("height", h),
  chart = svg.append("g")
        .classed("display", true)
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")"),
  controls = d3.select("#graph")
          .append("div")
          .attr("id", "controls"),
  sort_btn = controls.append("button")
            .html("Sort data: ascending")
            .attr("state", 0);

  chart.append('text')
      .classed("chart-title", true)
      .html(poll.title)
      .attr("x", width/2)
      .attr("y", -40)
      .attr("transform", "translate(0,0)")
      .style("text-anchor", "middle");

      
  sort_btn.on("click", function() {
    var self = d3.select(this),
      ascending = function(a, b) {
        return a.value - b.value;
      },
      descending = function(a, b) {
        return b.value - a.value;
      },
      state = +self.attr("state"),
      txt = "Sort data: ",
      sortedData = null;
    if (state === 0) {
      sortedData = data.sort(ascending);
      state = 1;
      txt += "descending";
    } else if (state === 1) {
      sortedData = data.sort(descending);
      state = 0;
      txt+= "ascending";
    }
    
    self.attr("state", state);
    self.html(txt);
    plot.call(chart, {
        data: sortedData,
        axis: {
            x: xAxis,
            y: yAxis
        },
        gridlines: yGridLines,
        initialize: false
      });
  });

function drawAxis(params) {

  if (params.initialize === true) {
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
          .style("text-anchor", "end")
          .attr("dx", -8)
          .attr("dy", 8)
          .attr("transform", "translate(0,0) rotate(-45)");
    this.append("g")
      .classed("y axis", true)
      .attr("transform", "translate(0,0)")
      .call(params.axis.y)

    //draw anchors
    this.select(".y.axis")
      .append("text")
      .text("Votes")
      .attr("x", -height/2)
      .attr("y", -40)
      .style("text-anchor", "middle")
      .attr("transform", "rotate(-90)");

  } else if (params.initialize === false) {
    //update!
    this.selectAll("g.x.axis")
        .transition()
        .duration(1500)
        .ease("bounce")
        .delay(500)
        .call(params.axis.x);
    this.selectAll(".x-axis-label")
      .style("text-anchor", "end")
      .attr("transform", "translate(0,0) rotate(-45)");
    this.selectAll("g.y.axis")
        .transition()
        .duration(1500)
        .ease("bounce")
        .delay(500)
        .call(params.axis.y);
  }

}

function plot(params) {

  x.domain(data.map(function(entry) {return entry.key}));
  y.domain([0, d3.max(data, function(d) {return d.value})]);
  //draw the axes
  drawAxis.call(this, params);

  //enter()
  this.selectAll(".bar")
    .data(params.data)
    .enter()
      .append("rect")
      .classed("bar", true);

  this.selectAll(".bar-label")
      .data(params.data)
      .enter()
        .append("text")
        .classed("bar-label", true);

  //update()
  this.selectAll(".bar")
      .transition()
      .duration(1500)
      .ease("bounce")
      .delay(500)
      .attr("x", function(d,i) {return x(d.key)})
      .attr("y", function(d,i) {return y(d.value)})
      .attr("width", function(d, i) {return x.rangeBand()})
      .attr("height", function(d, i) {return height - y(d.value)})
      .style("fill", function(d, i) {
        //return linearColorScale(i)});
        return ordinalColorScale(i)});
        
  this.selectAll(".bar-label")
        .transition()
        .duration(1500)
        .ease("bounce")
        .delay(500)
        .attr("x", function(d,i) {return x(d.key) + x.rangeBand()/2})
        .attr("dx", 0)
        .attr("y", function(d,i) {return y(d.value)})
        .attr("dy", function(d,i) {return d.value < 15 ? 0 : 15})
        .style("fill", function(d,i) {return d.value < 15 ? "red" : "white"})
        .text(function(d, i) {
          return d.value
        });
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

plot.call(chart, {
      data: data,
      axis: {
          x: xAxis,
          y: yAxis
      },
      gridlines: yGridLines,
      initialize: true
});
      
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
    }