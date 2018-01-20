"use strict"

module.exports = function drawAxis(params) {

    if (params.initialize === true) {
      //draw gridlines
      this.append("g")
        .classed("gridline", true)
        .attr("transform", "translate(0,0)")			
        .call(params.gridlines);
      //draw axis
      this.append("g")
        .classed("x axis", true)
        .attr("transform", "translate(0," + params.height +")")
        .call(params.axis.x)
          .selectAll("text")
            .classed("x-axis-label", true)
            .style("text-anchor", "end")
            .attr("dx", -8)
            .attr("dy", 8)
            .style("fill", function(d, i) {
              return params.ordinalColorScale(i)})
            .attr("transform", "translate(0,0) rotate(-60)");
      this.append("g")
        .classed("y axis", true)
        .attr("transform", "translate(0,0)")
        .call(params.axis.y)
            .selectAll("text")
            .classed("y-axis-label", true)
            .style("text-anchor", "end");

      //draw anchor
      this.select(".y.axis")
        .append("text")
        .text("Votes")
            .classed("y-axis-anchor", true)
            .attr("x", -params.height/2)
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
          .style("fill", function(d, i) {
            return params.ordinalColorScale(i)})
          .attr("transform", "translate(0,0) rotate(-60)");
      this.selectAll("g.y.axis")
          .transition()
          .duration(1500)
          .ease("bounce")
          .delay(500)
          .call(params.axis.y);
    }  
  }