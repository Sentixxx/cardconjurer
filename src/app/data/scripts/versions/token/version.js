if (!loadedVersions.includes('token/version')) {
	loadedVersions.push('token/version')
}

if (currentVersion != 'token/version') {
	currentVersion = 'token/version'

	artX = scaleX(60 / 1500)
	artY = scaleY(60 / 2100)
	artWidth = scaleX(1380 / 1500)
	artHeight = scaleY(1877 / 2100)

	manaCostXPath = '1316 - 78 * manaSymbolIndex'
	manaCostYPath = '121'
	manaCostDiameter = '70'
	manaCostShadowOffset = '[-2, 6]'
	manaCostDirection = 'reverse'

	setSymbolX = [scaleX(1382/1500), 'right']
	setSymbolY = [scaleY(1416/2100), 'center']
	setSymbolWidth = scaleX(180/1500)
	setSymbolHeight = scaleY(86/2100)

	watermarkX = scaleX(0.5)
	watermarkY = scaleY(1630/2100)
	watermarkWidth = scaleX(1140/1500)
	watermarkHeight = scaleY(484/2100)

	bottomInfoFunction = 'bottomInfoM15'

	loadTextOptions([
	new cardText('Card Title', '', 126/1500, 188/2100, 1248/1500, 80/2100, 'belerenb', 80/2100, 'white', ['oneLine=true','textAlign="center"']),
	new cardText('Card Type', '', 126/1500, 1439/2100, 1248/1500, 68/2100, 'belerenb', 68/2100, 'black', ['oneLine=true']),
	new cardText('Rules Text', '', 135/1500, 1545/2100, 1230/1500, 450/2100, 'mplantin', 74/2100, 'black'),
	new cardText('Power/Toughness', '', 1191/1500, 1954/2100, 205/1500, 78/2100, 'belerenbsc', 78/2100, 'black', ['oneLine=true,textAlign="center"'])
	])
}

loadFramePackOptions([['regular', 'Regular'], ['textless', 'Textless'], ['tall', 'Tall'], ['floatingCrowns', 'Floating Crowns'], ['holoStamps', 'Holographic Stamps']])