const playButton = document.getElementById('play')
function slideRange () {
    playButton.removeEventListener('click', slideRange, false)
    const range = document.getElementById('play-range')
    playButton.classList.add('clicked')
    playButton.style.cursor = 'context-menu'
    timeout(parseInt(range.min), range)
}

function timeout(i, range) {
    if (parseInt(i) > range.max) {
        range.value = range.min
        playButton.style.cursor = 'pointer'
        playButton.classList.remove('clicked')
        playButton.addEventListener('click', slideRange, false)
        return
    }
    
    setTimeout(function() {
        range.value = i

        timeout(parseInt(i+1), range)
    }, 25)
}

playButton.addEventListener('click', slideRange, false)