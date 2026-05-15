if (!loadedVersions.includes('m15Textless/version')) {
	loadedVersions.push('m15Textless/version')
	loadMaskImages([['Pinline (m15 Textless)', '/data/images/cardImages/m15Textless/m15TextlessMaskPinline.png'], ['Type (m15 Textless)', '/data/images/cardImages/m15Textless/m15TextlessMaskType.png'], ['Filigree (m15 Textless)', '/data/images/cardImages/m15Textless/invention/m15TextlessMaskInvention.png']])
}

if (currentVersion != 'm15Textless/version') {
	currentVersion = 'm15Textless/version'

	artX = scaleX(60 / 1500)
	artY = scaleY(60 / 2100)
	artWidth = scaleX(1380 / 1500)
	artHeight = scaleY(1888 / 2100)

	manaCostXPath = '1316 - 78 * manaSymbolIndex'
	manaCostYPath = '121'
	manaCostDiameter = '70'
	manaCostShadowOffset = '[-2, 6]'
	manaCostDirection = 'reverse'

	setSymbolX = [scaleX(1382/1500), 'right']
	setSymbolY = [scaleY(1772/2100), 'center']
	setSymbolWidth = scaleX(180/1500)
	setSymbolHeight = scaleY(86/2100)

	watermarkX = 0
	watermarkY = 0
	watermarkWidth = scaleX(1/1500)
	watermarkHeight = scaleY(1/2100)

	bottomInfoFunction = 'bottomInfoM15'

	loadTextOptions([
	new cardText('Card Title', '', 126/1500, 188/2100, 1248/1500, 80/2100, 'belerenb', 80/2100, 'black', ['oneLine=true']),
	new cardText('Card Type', '', 126/1500, 1795/2100, 1248/1500, 68/2100, 'belerenb', 68/2100, 'black', ['oneLine=true']),
	new cardText('Power/Toughness', '', 1191/1500, 1954/2100, 205/1500, 78/2100, 'belerenbsc', 78/2100, 'black', ['oneLine=true,textAlign="center"'])
	])
}

loadFramePackOptions([['regular', 'Kaladesh Inventions'], ['holoStamps', 'Holographic Stamps'], ['textlessGenericShowcase', 'Generic Showcase'], ['textlessBasic', 'Fullart Basic'], ['floatingCrowns', 'Floating Crowns'], ['innerCrowns', 'Inner Crowns']])