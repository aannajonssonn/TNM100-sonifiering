// Code from https://d3-graph-gallery.com/graph/line_basic.html for d3 v6

// set the dimensions and margins of the graph
var graphcss = document.getElementById('graph');
var div = graphcss.getBoundingClientRect();
console.log(div)

// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 30, left: 60},
width = div.width - margin.left - margin.right,
height = div.height - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#graph")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", `translate(${margin.top},${margin.top}})`); // denna verkar inte göra något

//Read the data
d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv",

  // When reading the csv, I must format variables:
  function(d){
    return { date : d3.timeParse("%Y-%m-%d")(d.date), value : d.value }
  }).then(

  // Now I can use this dataset:
  function(data) {

    // Add X axis --> it is a date format
    const x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.value; })])
      .range([ height, 40 ]);
    svg.append("g")
      .attr("transform", "translate(40, 0)")
      .call(d3.axisLeft(y));

    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value) })
        )

})