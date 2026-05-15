if (!loadedVersions.includes('unstable/version')) {
	loadedVersions.push('unstable/version')
	// loadMaskImages([])
}

if (currentVersion != 'unstable/version') {
	currentVersion = 'unstable/version'

	artX = 0
	artY = 0
	artWidth = scaleX(1)
	artHeight = scaleY(1931/2100)

	manaCostXPath = '0'
	manaCostYPath = '0'
	manaCostDiameter = '0'
	manaCostShadowOffset = 'none'
	manaCostDirection = 'reverse'

	setSymbolX = [cardWidth / 2, 'center']
	setSymbolY = [scaleY(244/2100), 'center']
	setSymbolWidth = 0
	setSymbolHeight = 0

	watermarkX = 0
	watermarkY = 0
	watermarkWidth = 0
	watermarkHeight = 0

	bottomInfoFunction = 'bottomInfoM15'

	loadTextOptions([
	new cardText('Card Title', '', 165/1500, 90/2100, 1170/1500, 80/2100, 'belerenb', 80/2100, 'white', ['oneLine=true','textAlign="center"']),
	])
}

loadFramePackOptions([['regular', 'Regular']])