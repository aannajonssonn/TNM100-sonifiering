
const dataset1 = document.querySelector('#dataset1-button')
const dataset2 = document.querySelector('#dataset2-button')
const dataset3 = document.querySelector('#dataset3-button')
const dataset_element = document.querySelectorAll('#dataset1-button, #dataset2-button, #dataset3-button')
console.log(dataset1)
// array of datasets
const datasets = [[dataset_element[0], 'temperature', '/data/temperature.csv'], [dataset_element[1], 'cars', '/data/cars.csv'], [dataset_element[2], 'people', '/data/befolkning.csv']]
console.log(datasets)
// listening to the event listener and sending the csv link, category and index to the drawGraph function for the checked dataset


// if a change is detected in any checkbox, all graphs are redrawn
datasets.forEach((dataset, index) => {
  dataset[0].addEventListener('change', () => {
    // remove all graphs using datasets using removeGraph function
    removeGraph(dataset[1])
    // if the checkbox is checked, draw the graph
    if (dataset[0].checked) {
      drawGraph(dataset[2], dataset[1], index)
    }
  })
})




