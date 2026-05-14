rootStyles.setProperty('--site-background', '#3a3838 url("/data/images/site/backgrounds/lowpolyDarkGreen.svg") left/cover no-repeat fixed')
rootStyles.setProperty('--site-background-filter', 'grayscale(0) hue-rotate(0deg)')
rootStyles.setProperty('--layer-background', 'none')
rootStyles.setProperty('--layer-background-filter', 'grayscale(100) brightness(0.5)')
rootStyles.setProperty('--layer-background-selected', '#1d1d1d')
rootStyles.setProperty('--interactable-unselected', '#666666')
rootStyles.setProperty('--interactable-selected', '#99ee99')
rootStyles.setProperty('--font-color', '#efefef')
rootStyles.setProperty('--body-background', 'none')
localStorage.setItem('colorPalette', 'nightRave')

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