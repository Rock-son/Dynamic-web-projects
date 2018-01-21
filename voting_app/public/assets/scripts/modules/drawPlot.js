"use strict"

const drawAxis = require("./drawAxis");

module.exports = function drawPlot(params) {

  params.x.domain(params.data.map(function(entry) {return entry.key}));
  params.y.domain([0, d3.max(params.data, function(d) {return d.value})]);
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
      .attr("x", function(d,i) {return params.x(d.key)})
      .attr("y", function(d,i) {return params.y(d.value)})
      .attr("width", function(d, i) {return params.x.rangeBand()})
      .attr("height", function(d, i) {return params.height - params.y(d.value)})
      .style("fill", function(d, i) {
        //return params.linearColorScale(i)});
        return params.ordinalColorScale(i)});
        
  this.selectAll(".bar-label")
        .transition()
        .duration(1500)
        .ease("bounce")
        .delay(500)
        .attr("x", function(d,i) {return params.x(d.key) + params.x.rangeBand()/2})
        .attr("dx", 0)
        .attr("y", function(d,i) {return params.y(d.value)})
        .attr("dy", function(d,i) {return d.value < 1 ? -10 : 50})
        .style("fill", function(d,i) {return d.value < 1 ? "rgba(255,255,255,0)" : "white"})
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