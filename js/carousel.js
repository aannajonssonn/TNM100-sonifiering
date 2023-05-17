// Source code: https://codepen.io/frise/pen/mZvKpe 
const carouselList = document.querySelectorAll('.carousel__list')

carouselList.forEach((list) => {
  list.addEventListener('click', function (event) {
    var newActive = event.target
    var isItem = newActive.closest('.carousel__item')
  
    if (!isItem || newActive.classList.contains('carousel__item_active')) {
      return
    }
    
    update(newActive, list.children)
  })
})

const update = function(newActive, listElement) {
  const newActivePos = newActive.dataset.pos
  // Parse from HTMLCollection to Array
  var listElements = Array.prototype.slice.call(listElement)

  const current = listElements.find((elem) => elem.dataset.pos == 0)
  const prev = listElements.find((elem) => elem.dataset.pos == -1)
  const next = listElements.find((elem) => elem.dataset.pos == 1)
  const first = listElements.find((elem) => elem.dataset.pos == -2)
  const last = listElements.find((elem) => elem.dataset.pos == 2)
  
  current.classList.remove('carousel__item_active');
  
  [current, prev, next, first, last].forEach(item => {
    var itemPos = item.dataset.pos

    item.dataset.pos = getPos(itemPos, newActivePos)
  })
}

const getPos = function (current, active) {
  const diff = current - active

  if (Math.abs(current - active) > 2) {
    return -current
  }

  return diff
}