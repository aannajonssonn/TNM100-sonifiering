document.getElementById('play').onclick = function () {
    const range = document.getElementById('play-range')

    timeout(parseInt(range.min), range)
}

function timeout(i, range) {
    if (parseInt(i) > range.max) {
        range.value = range.min
        return
    }
    
    setTimeout(function() {
        range.value = i

        timeout(parseInt(i+1), range)
    }, 25)
}