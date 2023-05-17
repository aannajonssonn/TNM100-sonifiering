
const dataset1 = document.querySelector('#dataset1-button')
const dataset2 = document.querySelector('#dataset2-button')
const dataset3 = document.querySelector('#dataset3-button')
// array of datasets
const datasets = [[dataset1, 'temperature', '/data/temperature.csv'], [dataset2, 'cars', '/data/cars.csv'], [dataset3, 'people', '/data/befolkning.csv']]
// listening to the event listener and sending the csv link, category and index to the drawGraph function for the checked dataset


// if a change is detected in any checkbox, all graphs are redrawn
dataset1.addEventListener('change', function () {
  if (dataset1.checked) {
    drawGraph(datasets[0][2], datasets[0][1], 0)
    // uncheck the other checkboxes, remove the graphs
    dataset2.checked = false
    dataset3.checked = false
    removeGraph(datasets[1][1])
    removeGraph(datasets[2][1])
  } else {
    removeGraph(datasets[0][1])
  }
})

// repeat for the other checkboxes
dataset2.addEventListener('change', function () {
  if (dataset2.checked) {
    drawGraph(datasets[1][2], datasets[1][1], 1)
    dataset1.checked = false
    dataset3.checked = false
    removeGraph(datasets[0][1])
    removeGraph(datasets[2][1])
  } else {
    removeGraph(datasets[1][1])
  }
})

dataset3.addEventListener('change', function () {
  if (dataset3.checked) {
    drawGraph(datasets[2][2], datasets[2][1], 2)
    dataset1.checked = false
    dataset2.checked = false
    removeGraph(datasets[0][1])
    removeGraph(datasets[1][1])
  } else {
    removeGraph(datasets[2][1])
  }
})




