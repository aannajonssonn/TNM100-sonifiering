// Code from https://d3-graph-gallery.com/graph/line_basic.html for d3 v6

// Get CSS elements from the graph div
const graphCSS = document.getElementById('graph')
const graphDiv = graphCSS.getBoundingClientRect()

// Set the dimensions and margins of the graph
const offset = { y: 10, x: 5 }
const margin = { top: 10, right: 10, bottom: 30, left: 60 },
  width = (graphDiv.width - offset.x) - margin.left - margin.right,
  height = (graphDiv.height - offset.y) - margin.top - margin.bottom

const color = d3.scaleOrdinal(d3.schemeCategory10) // 10 different colors for 10 different numbers

// Append the svg object to the body of the page
const svg = d3.select('#graph')
  .append('svg')
  .attr('transform', 'translate(' + offset.x / 3 + "," + offset.y / 3 + ')')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Draw the x axis 
function drawAxis(dataset) {
  d3.csv(dataset,
    // Format time variable for x axis
    function (d) {
      return { date: d3.timeParse('%Y')(d.date), value: d.value }
    }).then(

      function (data) {
        // Add X axis --> it is a date format
        const x = d3.scaleTime()
          .domain(d3.extent(data, function (d) { return d.date }))
          .range([0, width])

        svg.append('g')
          .attr('transform', 'translate(0,' + height + ')')
          .call(d3.axisBottom(x))

        // Axis labels
        svg.append('text')
          .attr('x', width)
          .attr('y', height - 5)
          .style('text-anchor', 'end')
          .text(data.columns[3])
          .style('fill', 'white')
      })
}

function drawGraph(dataset, category, id) {
  d3.csv(dataset,

    // Format time variable for x axis
    function (d) {
      return { date: d3.timeParse('%Y')(d.date), value: d.value }
    }).then(

      function (data) {
        // Add X axis --> it is a date format
        const x = d3.scaleTime()
          .domain(d3.extent(data, function (d) { return d.date }))
          .range([0, width])

        // Axis labels
        svg.append('text')
          .attr('x', -40)
          .attr('y', 5)
          .text(data.columns[2])
          .attr('class', category)
          .style('fill', 'white')

        // Add Y axis
        const yMin = d3.min(data, function (d) { return +d.value })
        const y = d3.scaleLinear()
          .domain([yMin - 0.5 * Math.abs(yMin), d3.max(data, function (d) { return +d.value })])
          .range([height, margin.top])
        svg.append('g')
          .call(d3.axisLeft(y))
          .attr('class', category)

        // Add the line
        svg.append('path')
          .datum(data)
          .attr('class', category)
          .attr('fill', 'none')
          .attr('stroke', color.range()[id])
          .attr('stroke-width', 2.5)
          .attr('d', d3.line()
            .y(function (d) { return y(d.value) })
            .defined(function (d) { return d.value }) // Ignore null value
            .x(function (d) { return x(d.date) })
          )
      })
}

function removeGraph(category) {
  svg.selectAll('.' + category).remove()
}
