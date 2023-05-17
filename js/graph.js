// Code from https://d3-graph-gallery.com/graph/line_basic.html for d3 v6

// Get CSS elements from the graph div
const graphCSS = document.getElementById('graph')
const graphDiv = graphCSS.getBoundingClientRect()
let mouseDown = 0

document.body.onmousedown = function () {
  ++mouseDown
}
document.body.onmouseup = function () {
  --mouseDown
}

// Set the dimensions and margins of the graph
const offset = { y: 10, x: 5 }
const margin = { top: 10, right: 10, bottom: 30, left: 60 },
  width = (graphDiv.width - offset.x) - margin.left - margin.right,
  height = (graphDiv.height - offset.y) - margin.top - margin.bottom

const color = d3.scaleOrdinal(d3.schemeCategory10) // 10 different colors for 10 different numbers

// Append the svg object to the body of the page
const svg = d3.select('#graph')
  .append('svg')
  .attr('transform', 'translate(' + offset.x / 3 + ',' + offset.y / 3 + ')')
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
        const yMax = d3.max(data, function (d) { return +d.value })
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


        // Code inspired by https://observablehq.com/@vica/d3-linechart-with-hover
        // Style the interaction
        const canvas = d3.select('#graph')
        const plot_g = svg
        const mouse_g = plot_g.append('g').classed('mouse', true).style('display', 'none')
        mouse_g.append('rect').attr('width', 2).attr('x', -1).attr('height', height).attr('fill', 'lightgray')

        mouse_g.append('rect').attr('width', width).attr('y', -1).attr('height', 2).attr('class', 'horizontal').attr('fill', 'lightgray')
        mouse_g.append('text').attr('class', 'value').style('fill', 'white')

        mouse_g.append('circle').attr('r', 3).attr('stroke', color.range()[id])
        mouse_g.append('text').attr('class', 'year').style('fill', 'white')

        const [minYear, maxYear] = d3.extent(data, d => d.date)
        let prevYear

        canvas.on('mousemove', function (mouse) {
          if (!mouseDown) {
            mouse_g.style('display', 'none')
            return
          }

          interactions(mouse)
        })

        canvas.on('click', function (mouse) {
          interactions(mouse)
        })

        canvas.on('mouseout', function (mouse) {
          mouse_g.style('display', 'none')
        })

        const playButton = document.getElementById('play')
        function slideRange() {
          playButton.removeEventListener('click', slideRange, false)

          const range = document.getElementById('play-range')
          playButton.classList.add('clicked')
          playButton.style.cursor = 'context-menu'

          mouse_g.style('display', 'block')

          timeout(parseInt(range.min), range)
        }

        function timeout(i, range) {
          if (parseInt(i) > range.max) {
            mouse_g.style('display', 'none')
            range.value = range.min
            playButton.style.cursor = 'pointer'
            playButton.classList.remove('clicked')

            playButton.addEventListener('click', slideRange, false)
            return
          }

          interactions(null, i, range)
          setTimeout(function () {
            range.value = i

            timeout(parseInt(i + 1), range)
          }, 30)
        }

        function interactions(mouse = null, position = 0, ranges = 0) {
          mouse_g.style('display', 'block')

          let [xCoord, yCoord] = mouse ? d3.pointer(mouse) : [(position + 5) / ranges.max * width, 0]
          xCoord -= margin.left
          const ratio = xCoord / width
          const formatTime = d3.timeFormat('%Y')
          const parseTime = d3.timeParse('%Y')
          const currentYear = parseInt(formatTime(minYear)) + parseInt(Math.round(ratio * d3.timeYear.count(minYear, maxYear))) // https://github.com/d3/d3-time
          let currentValue = data.find(d => {
            return formatTime(d.date) == currentYear
          })

          if (!currentValue) return
          currentValue = currentValue.value

          mouse_g.attr('transform', `translate(${x(parseTime(currentYear))},${0})`)
          mouse_g.selectAll('.year')
            .text(`År: ${currentYear}`)
            .attr('y', 100)
            .attr('text-anchor', currentYear < (minYear + maxYear) / 2 ? 'start' : 'end')
          mouse_g.select('circle').attr('cy', y(currentValue))

          mouse_g.selectAll('.horizontal').attr('transform', `translate(${-x(parseTime(currentYear))},${y(currentValue)})`)
          mouse_g.selectAll('.value')
            .text(`Värde: ${currentValue}`)
            .attr('x', -x(parseTime(currentYear)) + 100)
            .attr('y', y(currentValue) - 2)
            .attr('text-anchor', currentYear < (minYear + maxYear) / 2 ? 'start' : 'end')

          // Send current y value to the server
          if (prevYear != currentYear) {
            const carouselList = document.querySelectorAll('.carousel__list')
            const waveformElements = Array.prototype.slice.call(carouselList[0].children)
            const currentWaveform = waveformElements.find((elem) => elem.dataset.pos == 0)

            const genreElements = Array.prototype.slice.call(carouselList[1].children)
            const currentGenre = genreElements.find((elem) => elem.dataset.pos == 0)

            const filterElements = Array.prototype.slice.call(carouselList[2].children)
            const currentFilter = filterElements.find((elem) => elem.dataset.pos == 0)

            const echoChecked = document.getElementById('echo').children[1].children[0].checked
            const reverbChecked = document.getElementById('reverb').children[1].children[0].checked
            const volumeChecked = document.getElementById('volume').children[1].children[0].checked
            const discreteChecked = document.getElementById('discrete').children[1].children[0].checked
            const mirrorChecked = document.getElementById('mirror').children[1].children[0].checked

            const samplePoint = {
              value: currentValue,
              min: yMin,
              max: yMax,

              waveform: currentWaveform.innerText,
              genre: currentGenre.innerText,
              filter: currentFilter.innerText,

              echo: echoChecked,
              reverb: reverbChecked,
              volume: volumeChecked,
              discrete: discreteChecked,
              mirror: mirrorChecked
            }

            const options = {
              method: 'POST',
              headers: {
                'Content-type': 'application/json; charset=UTF-8'
              },
              body: JSON.stringify(samplePoint)
            }

            const promise = fetch('/data', options)
            promise.then(response => {
              if (!response.ok) {
                console.error(response)
              } else {
                return response.json()
              }
            }).then(result => {
              //console.log(result)
            })
          }

          prevYear = currentYear
        }

        playButton.addEventListener('click', slideRange, false)
      })
}


function removeGraph(category) {
  svg.selectAll('.' + category).remove()
}
