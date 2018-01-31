'use strict'

//const d3 = require("d3");
const drawPlot = require("./modules/drawPlot"),
      formEventListeners = require("./modules/form.js");

document.addEventListener("DOMContentLoaded", formEventListeners);
document.addEventListener("DOMContentLoaded", main);



function main() {

	const url = /(.*\?url=\w*)[^&?.*]/.exec(window.location.href)[0] + ".json";
	d3.xhr(url, onDataLoad);
}



// onload event listener callback function
function onDataLoad(event) {
    
	// HIDE ERROR ON PAGE (if exists)      
	setTimeout(() => {            
		let doc = null;
		if ((doc = document.getElementById('error'))) {
				doc.style.opacity = '0';
		}
	}, 3000);
	  
	  // container object's width and height
	const winSize = +window.innerWidth,
		  w = +window.innerWidth > 660 ? +window.innerWidth * .7 : +window.innerWidth, // same as in responsive CSS
          h = +window.innerHeight / 1.2,
          margin = { top: 100,
                     bottom: 120,
                     left: +window.innerWidth < 999 ? 40 : 80,
                     right: 20
          },
          width = w - margin.left - margin.right,
          height = h - margin.top - margin.bottom,


		poll = JSON.parse(event.response).data,
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

		controls = d3.select(".container__right")
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

	drawPlot.call(chart, {
			  data: data,
			  x,
			  y,
			  height,
			  axis: {
			  x: xAxis,
			  y: yAxis
			  },
			  ordinalColorScale,
			  gridlines: yGridLines,
			  initialize: true
	});
		
	sort_btn.on("click", function() {

		const self = d3.select(this),
			  ascending = function(a, b) {
			  return a.value - b.value;
			  },

			  descending = function(a, b) {
			  return b.value - a.value;
			  };

		let state = +self.attr("state"),
		txt = "Sort data: ",
		sortedData = null;

		if ( state === 0 ) {
		sortedData = data.sort(ascending);
		state = 1;
		txt += "descending";
		} else if ( state === 1 ) {
		sortedData = data.sort(descending);
		state = 0;
		txt+= "ascending";
		}
		
		self.attr("state", state);
		self.html(txt);

	drawPlot.call(chart, {
				data: sortedData,
				x,
				y,
				height,
				axis: {
					x: xAxis,
					y: yAxis
				},
				ordinalColorScale,
				gridlines: yGridLines,
				initialize: false
			  });
    });
}