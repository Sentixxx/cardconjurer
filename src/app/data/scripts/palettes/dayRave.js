rootStyles.setProperty('--site-background', '#f5f5f5 url("/data/images/site/backgrounds/lowpolyLightGreen.svg") left/cover no-repeat fixed')
rootStyles.setProperty('--site-background-filter', 'grayscale(0) hue-rotate(0deg)')
rootStyles.setProperty('--layer-background', 'none')
rootStyles.setProperty('--layer-background-filter', 'grayscale(100)')
rootStyles.setProperty('--layer-background-selected', '#cccccc')
rootStyles.setProperty('--interactable-unselected', '#aaaaaa')
rootStyles.setProperty('--interactable-selected', '#00aa00')
rootStyles.setProperty('--font-color', '#000000')
rootStyles.setProperty('--body-background', 'none')
localStorage.setItem('colorPalette', 'dayRave')

//Shifts the hue
var colorCycle
var currentHueRotation = 0
if (colorCycle == undefined) {
	colorCycle = setInterval(shiftHue, 200)
}

function shiftHue(checkForClear = false) {
	if (document.getElementById('inputColorPalette').value.includes('Rave')) {
		rootStyles.setProperty('--site-background-filter', 'grayscale(0) hue-rotate(' + currentHueRotation + 'deg)')
		currentHueRotation += 1
		if (currentHueRotation == 360) {currentHueRotation = 0}
	}
}