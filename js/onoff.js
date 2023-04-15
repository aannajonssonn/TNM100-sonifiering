
// Add event listener for on-off switches
const dataset1 = document.querySelector('#dataset1-button')
const dataset2 = document.querySelector('#dataset2-button')
const dataset3 = document.querySelector('#dataset3-button')
dataset1.addEventListener('change', (event) => {
    // Read the value of the on-off switch
    //console.log(event.target.checked)
    const category = 'temperature'
    if (event.target.checked) {
        drawGraph('/data/temperature.csv', category)
        return
    }

    removeGraph(category)
})

dataset2.addEventListener('change', (event) => {
    // Read the value of the on-off switch
    const category = 'cars'
    if (event.target.checked) {
        drawGraph('/data/cars.csv', category)
        return
    }

    removeGraph(category)
})

dataset3.addEventListener('change', (event) => {
    // Read the value of the on-off switch
    const category = 'people'
    if (event.target.checked) {
        drawGraph('/data/befolkning.csv', category)
        return
    }

    removeGraph(category)
})
