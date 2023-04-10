const infoExpand = document.querySelectorAll('.info')

const temp = []

infoExpand.forEach(element => {
    const object = {
        infoElement: element,
        clicked: false
    }

    temp.push(object)
})

console.log(temp)

const htmlBody = document.getElementsByTagName('body')[0]
htmlBody.onclick = () => {
    temp.forEach(element => {
        // Do stuff when clicking the entire body
    })
}

temp.forEach(element => {
    element.infoElement.onclick = () => {
        if (element.clicked) {
            element.infoElement.style.display = ''
            element.infoElement.children[1].style.display = ''
            element.infoElement.style.backgroundColor = ''
            element.infoElement.style.padding = ''
            element.infoElement.style.width = ''
            element.infoElement.style.height = ''
            element.infoElement.style.textAlign = ''
            element.infoElement.style.border = ''
            element.infoElement.style.top = -20 + 'px'
            element.clicked = false
            return
        }

        temp.forEach(elem => {
            elem.infoElement.style.display = ''
            elem.infoElement.children[1].style.display = ''
            elem.infoElement.style.backgroundColor = ''
            elem.infoElement.style.padding = ''
            elem.infoElement.style.width = ''
            elem.infoElement.style.height = ''
            elem.infoElement.style.textAlign = ''
            elem.infoElement.style.border = ''
            elem.infoElement.style.top = -20 + 'px'
            elem.clicked = false
        })

        element.infoElement.style.display = 'block'
        element.infoElement.children[1].style.display = 'block'
        element.infoElement.style.backgroundColor = 'white'
        element.infoElement.style.padding = '0 0 0 5px'
        element.infoElement.style.width = '60%'
        element.infoElement.style.height = 'fit-content'
        element.infoElement.style.textAlign = 'left!important'
        element.infoElement.style.border = '1px solid black'
        element.clicked = true

        setTimeout(function () {
            const heightInfo = element.infoElement.offsetHeight
            if (element.infoElement.parentElement.getBoundingClientRect().bottom + heightInfo > window.innerHeight) {
                element.infoElement.style.top = -(heightInfo - 5) + 'px'
            }
            else {
                element.infoElement.style.top = -20 + 'px'
            }
        }, 200)
    }
})
