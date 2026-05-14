if (!loadedVersions.includes('m15Promo/version')) {
	loadedVersions.push("m15Promo/version")
	loadMaskImages([['Pinline (m15 Promo)', '/data/images/cardImages/m15Promo/m15PromoMaskPinline.png'], ['Titleless (m15 Promo)', '/data/images/cardImages/m15Promo/m15PromoMaskTitleless.png'], ['Type (m15 Promo)', '/data/images/cardImages/m15Promo/m15PromoMaskType.png'], ['Rules (m15 Promo)', '/data/images/cardImages/m15Promo/m15PromoMaskRules.png']])
}

if (currentVersion != 'm15Promo/version') {
	currentVersion = 'm15Promo/version'

	artX = 0
	artY = 0
	artWidth = scaleX(1)
	artHeight = scaleY(1936 / 2100)

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
	new cardText('Card Title', '', 126/1500, 188/2100, 1248/1500, 80/2100, 'belerenb', 80/2100, 'white', ['oneLine=true', 'shadow=3']),
	new cardText('Card Type', '', 126/1500, 1439/2100, 1248/1500, 68/2100, 'belerenb', 68/2100, 'white', ['oneLine=true', 'shadow=3']),
	new cardText('Rules Text', '', 135/1500, 1545/2100, 1230/1500, 450/2100, 'mplantin', 74/2100, 'white', ['shadow=3']),
	new cardText('Power/Toughness', '', 1191/1500, 1954/2100, 205/1500, 78/2100, 'belerenbsc', 78/2100, 'black', ['oneLine=true,textAlign="center"'])
	])
}

loadFramePackOptions([['regular', 'Regular'], ['floatingCrowns', 'Floating Crowns'], ['holoStamps', 'Holographic Stamps'], ['nickname', 'Nickname (Godzilla)'], ['innerCrowns', 'Inner Crowns'], ['darkPT', 'Dark Power/Toughness']])
