if (!loadedVersions.includes('short/modalNickname')) {
	loadedVersions.push('short/modalNickname')
	loadMaskImages([['Nickname Title (short modal)', '/data/images/cardImages/short/modal/shortModalNicknameMaskTitle.png']])
	loadFrameImages([
		['White Nickname Title', '/data/images/cardImages/short/modal/shortModalNicknameTitleW.png', 37/1500, 85/2100, 1389/1500, 221/2100, ['Full', 'Nickname Title (short modal)']],
		['Blue Nickname Title', '/data/images/cardImages/short/modal/shortModalNicknameTitleU.png', 37/1500, 85/2100, 1389/1500, 221/2100, ['Full', 'Nickname Title (short modal)']],
		['Black Nickname Title', '/data/images/cardImages/short/modal/shortModalNicknameTitleB.png', 37/1500, 85/2100, 1389/1500, 221/2100, ['Full', 'Nickname Title (short modal)']],
		['Red Nickname Title', '/data/images/cardImages/short/modal/shortModalNicknameTitleR.png', 37/1500, 85/2100, 1389/1500, 221/2100, ['Full', 'Nickname Title (short modal)']],
		['Green Nickname Title', '/data/images/cardImages/short/modal/shortModalNicknameTitleG.png', 37/1500, 85/2100, 1389/1500, 221/2100, ['Full', 'Nickname Title (short modal)']],
	], 'frameClassShortModalNickname')
}

if (currentVersion != 'short/modalNickname') {
	currentVersion = 'short/modalNickname'
	
	loadTextOptions([
	new cardText('Card Nickname', '', 242/1500, 188/2100, 1132/1500, 80/2100, 'belerenb', 80/2100, 'black', ['oneLine=true']),
	new cardText('Card Title', '', 210/1500, 276/2100, 1080/1500, 48/2100, 'belerenb', 48/2100, 'white', ['oneLine=true', 'textAlign="center"', 'fontStyle="italic "', 'shadow=3']),
	new cardText('Card Type', '', 126/1500, 1550/2100, 1248/1500, 68/2100, 'belerenb', 68/2100, 'black', ['oneLine=true']),
	new cardText('Rules Text', '', 135/1500, 1656/2100, 1230/1500, 339/2100, 'mplantin', 74/2100, 'black'),
	new cardText('Flipside Type', '', 102/1500, 1927/2100, 546/1500, 49/2100, 'belerenb', 49/2100, 'white', ['oneLine=true']),
	new cardText('Flipside Reminder', '', 102/1500, 1929/2100, 546/1500, 54/2100, 'mplantin', 54/2100, 'white', ['oneLine=true', 'textAlign="right"']),
	new cardText('Power/Toughness', '', 1191/1500, 1954/2100, 205/1500, 78/2100, 'belerenbsc', 78/2100, 'black', ['oneLine=true,textAlign="center"'])
	])
}

hideFrameImages('frameClassShortModalNickname')