if (!loadedVersions.includes('expedition/version')) {
	loadedVersions.push('expedition/version')
	loadMaskImages([['Pinline (expedition)', '/data/images/cardImages/expedition/expeditionMaskPinline.png'], ['Type (m15 textless)', '/data/images/cardImages/m15Textless/m15TextlessMaskType.png'], ['Rules (expedition)', '/data/images/cardImages/expedition/expeditionMaskTextbox.png'], ['Frame (expedition)', '/data/images/cardImages/expedition/expeditionMaskFrame.png']])
}

if (currentVersion != 'expedition/version') {
	currentVersion = 'expedition/version'

	artX = scaleX(113 / 1500)
	artY = scaleY(233 / 2100)
	artWidth = scaleX(1274 / 1500)
	artHeight = scaleY(1468 / 2100)

	manaCostXPath = '1316 - 78 * manaSymbolIndex'
	manaCostYPath = '121'
	manaCostDiameter = '70'
	manaCostShadowOffset = '[-2, 6]'
	manaCostDirection = 'reverse'

	setSymbolX = [scaleX(1382/1500), 'right']
	setSymbolY = [scaleY(1772/2100), 'center']
	setSymbolWidth = scaleX(180/1500)
	setSymbolHeight = scaleY(86/2100)

	watermarkX = scaleX(0.5)
	watermarkY = scaleY(1630/2100)
	watermarkWidth = scaleX(1140/1500)
	watermarkHeight = scaleY(484/2100)

	bottomInfoFunction = 'bottomInfoM15'

	loadTextOptions([
	new cardText('Card Title', '', 126/1500, 188/2100, 1248/1500, 80/2100, 'belerenb', 80/2100, 'black', ['oneLine=true']),
	new cardText('Card Type', '', 126/1500, 1795/2100, 1248/1500, 68/2100, 'belerenb', 68/2100, 'black', ['oneLine=true']),
	new cardText('Rules Text', '', 135/1500, 1238/2100, 1230/1500, 600/2100, 'mplantin', 74/2100, 'black'),
	new cardText('Power/Toughness', '', 1191/1500, 1954/2100, 205/1500, 78/2100, 'belerenbsc', 78/2100, 'black', ['oneLine=true,textAlign="center"'])
	])
}

loadFramePackOptions([['regular', 'Regular'], ['new', 'New (Zendikar Rising)'], ['floatingCrowns', 'Floating Crowns']])