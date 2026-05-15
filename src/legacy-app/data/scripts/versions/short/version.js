if (!loadedVersions.includes('short/version')) {
	loadedVersions.push('short/version')
	loadMaskImages([['Type (short)', '/data/images/cardImages/short/shortMaskType.png']])
}

if (currentVersion != 'short/version') {
	currentVersion = 'short/version'

	artX = scaleX(0 / 1500)
	artY = scaleY(0 / 2100)
	artWidth = 1
	artHeight = scaleY(1937 / 2100)

	manaCostXPath = '1316 - 78 * manaSymbolIndex'
	manaCostYPath = '121'
	manaCostDiameter = '70'
	manaCostShadowOffset = '[-2, 6]'
	manaCostDirection = 'reverse'

	setSymbolX = [scaleX(1382/1500), 'right']
	setSymbolY = [scaleY(1527/2100), 'center']
	setSymbolWidth = scaleX(180/1500)
	setSymbolHeight = scaleY(86/2100)

	watermarkX = scaleX(0.5)
	watermarkY = scaleY(1630/2100)
	watermarkWidth = scaleX(1140/1500)
	watermarkHeight = scaleY(484/2100)

	bottomInfoFunction = 'bottomInfoM15'

	loadTextOptions([
	new cardText('Card Title', '', 242/1500, 188/2100, 1132/1500, 80/2100, 'belerenb', 80/2100, 'black', ['oneLine=true']),
	new cardText('Card Type', '', 126/1500, 1550/2100, 1248/1500, 68/2100, 'belerenb', 68/2100, 'black', ['oneLine=true']),
	new cardText('Rules Text', '', 135/1500, 1656/2100, 1230/1500, 339/2100, 'mplantin', 74/2100, 'black'),
	new cardText('Flipside Type', '', 102/1500, 1927/2100, 546/1500, 49/2100, 'belerenb', 49/2100, 'white', ['oneLine=true']),
	new cardText('Flipside Reminder', '', 102/1500, 1929/2100, 546/1500, 54/2100, 'mplantin', 54/2100, 'white', ['oneLine=true', 'textAlign="right"']),
	new cardText('Power/Toughness', '', 1191/1500, 1954/2100, 205/1500, 78/2100, 'belerenbsc', 78/2100, 'black', ['oneLine=true,textAlign="center"'])
	])
}

loadFramePackOptions([['regular', 'Modal'], ['modalNickname', 'Modal Nickname']])