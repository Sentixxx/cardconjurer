if (!loadedVersions.includes('modal/version')) {
	loadedVersions.push('modal/version')
	loadMaskImages([['Flipside (modal)', '/data/images/cardImages/modal/modalMaskFlipside.png'], ['Border (modal)', '/data/images/cardImages/modal/modalMaskBorder.png'], ['Pinline (modal)', '/data/images/cardImages/modal/modalMaskPinline.png'], ['Title (modal)', '/data/images/cardImages/modal/modalMaskTitle.png'], ['Rules (modal)', '/data/images/cardImages/modal/modalMaskText.png'], ['Frame (modal)', '/data/images/cardImages/modal/modalMaskFrame.png']])
	notify("The front halves of modal cards are fully functional, but at this moment we do not have the back faces complete.", '#ffffaae0')
}

if (currentVersion != 'modal/version') {
	currentVersion = 'modal/version'

	artX = scaleX(115 / 1500)
	artY = scaleY(237 / 2100)
	artWidth = scaleX(1270 / 1500)
	artHeight = scaleY(929 / 2100)

	manaCostXPath = '1316 - 78 * manaSymbolIndex'
	manaCostYPath = '121'
	manaCostDiameter = '70'
	manaCostShadowOffset = '[-2, 6]'
	manaCostDirection = 'reverse'

	setSymbolX = [scaleX(1382/1500), 'right']
	setSymbolY = [scaleY(1241/2100), 'center']
	setSymbolWidth = scaleX(180/1500)
	setSymbolHeight = scaleY(86/2100)

	watermarkX = scaleX(0.5)
	watermarkY = scaleY(1630/2100)
	watermarkWidth = scaleX(1140/1500)
	watermarkHeight = scaleY(484/2100)

	bottomInfoFunction = 'bottomInfoM15'

	loadTextOptions([
	new cardText('Card Title', '', 242/1500, 188/2100, 1132/1500, 80/2100, 'belerenb', 80/2100, 'black', ['oneLine=true']),
	new cardText('Card Type', '', 126/1500, 1264/2100, 1248/1500, 68/2100, 'belerenb', 68/2100, 'black', ['oneLine=true']),
	new cardText('Rules Text', '', 135/1500, 1370/2100, 1230/1500, 625/2100, 'mplantin', 74/2100, 'black'),
	new cardText('Flipside Type', '', 102/1500, 1927/2100, 546/1500, 49/2100, 'belerenb', 49/2100, 'white', ['oneLine=true']),
	new cardText('Flipside Reminder', '', 102/1500, 1929/2100, 546/1500, 54/2100, 'mplantin', 54/2100, 'white', ['oneLine=true', 'textAlign="right"']),
	new cardText('Power/Toughness', '', 1191/1500, 1954/2100, 205/1500, 78/2100, 'belerenbsc', 78/2100, 'black', ['oneLine=true,textAlign="center"'])
	])
}

loadFramePackOptions([['regular', 'Regular']])