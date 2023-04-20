// const data = ['Dataset 1', 'Dataset 2', 'Dataset 3', 'Dataset 4'] // namnen på de olika dataseten

const dataOptions = [{
  label: 'Dataset 1',
  datalink: './data/temperature.csv'
},
{
  label: 'Dataset 2',
  datalink: './data/testdata.csv'
},
{
  label: 'Dataset 3',
  datalink: './data/testdata.csv'
},
{
  label: 'Dataset 4',
  datalink: './data/testdata.csv'
}
]

const list = document.getElementById("datasets")

dataOptions.forEach((item) => {

})

/*const div = document.createElement("div")
div.innerText = item.label
div.className = 'onoff'

const label = document.createElement('label')
label.className = 'switch'

const input = document.createElement('input')
input.type = 'checkbox'
//input.id = ''
const span = document.createElement('span')
span.className = 'slider round'

input.appendChild(span)
label.appendChild(input)
div.appendChild(label)
list.appendChild(div)*/