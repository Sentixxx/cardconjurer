if (!loadedVersions.includes('ixalan/version')) {
	loadedVersions.push('ixalan/version')
	// loadMaskImages([])
}

if (currentVersion != 'ixalan/version') {
	currentVersion = 'ixalan/version'

	artX = scaleX(60 / 1500)
	artY = scaleY(229 / 2100)
	artWidth = scaleX(1380 / 1500)
	artHeight = scaleY(953 / 2100)

	manaCostXPath = '1316 - 78 * manaSymbolIndex'
	manaCostYPath = '109'
	manaCostDiameter = '70'
	manaCostShadowOffset = '[-2, 6]'
	manaCostDirection = 'reverse'

	setSymbolX = [cardWidth / 2, 'center']
	setSymbolY = [scaleY(244/2100), 'center']
	setSymbolWidth = scaleX(180/1500)
	setSymbolHeight = scaleY(84/2100)

	watermarkX = scaleX(0.5)
	watermarkY = scaleY(1630/2100)
	watermarkWidth = scaleX(1140/1500)
	watermarkHeight = scaleY(484/2100)

	bottomInfoFunction = 'bottomInfoM15'

	loadTextOptions([
	new cardText('Card Title', '', 165/1500, 174/2100, 1170/1500, 79/2100, 'belerenbsc', 79/2100, 'black', ['oneLine=true','textAlign="center"']),
	new cardText('Card Type', '', 165/1500, 1262/2100, 1170/1500, 68/2100, 'belerenb', 68/2100, 'black', ['oneLine=true','textAlign="center"']),
	new cardText('Rules Text', '', 196/1500, 1327/2100, 1112/1500, 700/2100, 'mplantin', 73/2100, 'black')
	])
}

loadFramePackOptions([['regular', 'Regular']])