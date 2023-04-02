
// Add event listener for on-off switches
const checkedValue = document.querySelector('#mirror-button')
checkedValue.addEventListener('change', (event) => {
    // Read the value of the on-off switch
    console.log(event.target.checked)
})
