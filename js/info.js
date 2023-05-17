const infoExpand = document.querySelectorAll('.info')
const infoButtons = []

infoExpand.forEach(element => {
    const object = {
        infoElement: element,
        clicked: false
    }

    infoButtons.push(object)
})

infoButtons.forEach(element => {
    element.infoElement.onclick = () => {
        // If button is clicked (open), then close it when user clicks on it
        if (element.clicked) {
            element.infoElement.classList.remove('expanded')
            element.infoElement.style.top = -25 + 'px'
            element.infoElement.children[1].style.display = ''
            element.clicked = false
            return
        }

        // If any info button is clicked, restore all other ones which might be open
        infoButtons.forEach(elem => {
            elem.infoElement.classList.remove('expanded')
            elem.infoElement.style.top = -25 + 'px'
            elem.infoElement.children[1].style.display = ''
            elem.clicked = false
        })

        // Open the info button the user clicked
        element.infoElement.classList.add('expanded')
        element.infoElement.children[1].style.display = 'block'
        element.clicked = true

        setTimeout(function () {
            const heightInfo = element.infoElement.offsetHeight
            if (element.infoElement.parentElement.getBoundingClientRect().bottom + heightInfo > window.innerHeight) {
                element.infoElement.style.top = -(heightInfo - 5) + 'px'
            }
            else {
                element.infoElement.style.top = -25 + 'px'
            }
        }, 200)
    }
})
