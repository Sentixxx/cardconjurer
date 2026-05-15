if (!loadedVersions.includes('token/tall')) {
	loadedVersions.push('token/tall')
	loadFrameImages([
		['White Frame', '/data/images/cardImages/token/tokenFrameWTall.png', 0, 0, 1, 1, ['Full', 'Pinline Super (m15)', 'Title (m15)', 'Type (m15)', 'Rules (m15)', 'Border (m15)']],
		['Blue Frame', '/data/images/cardImages/token/tokenFrameUTall.png', 0, 0, 1, 1, ['Full', 'Pinline Super (m15)', 'Title (m15)', 'Type (m15)', 'Rules (m15)', 'Border (m15)']],
		['Black Frame', '/data/images/cardImages/token/tokenFrameBTall.png', 0, 0, 1, 1, ['Full', 'Pinline Super (m15)', 'Title (m15)', 'Type (m15)', 'Rules (m15)', 'Border (m15)']],
		['Red Frame', '/data/images/cardImages/token/tokenFrameRTall.png', 0, 0, 1, 1, ['Full', 'Pinline Super (m15)', 'Title (m15)', 'Type (m15)', 'Rules (m15)', 'Border (m15)']],
		['Green Frame', '/data/images/cardImages/token/tokenFrameGTall.png', 0, 0, 1, 1, ['Full', 'Pinline Super (m15)', 'Title (m15)', 'Type (m15)', 'Rules (m15)', 'Border (m15)']],
		['Multicolored Frame', '/data/images/cardImages/token/tokenFrameMTall.png', 0, 0, 1, 1, ['Full', 'Pinline Super (m15)', 'Title (m15)', 'Type (m15)', 'Rules (m15)', 'Border (m15)']],
		['Artifact Frame', '/data/images/cardImages/token/tokenFrameATall.png', 0, 0, 1, 1, ['Full', 'Pinline Super (m15)', 'Title (m15)', 'Type (m15)', 'Rules (m15)', 'Border (m15)']],
		['Land Frame', '/data/images/cardImages/token/tokenFrameLTall.png', 0, 0, 1, 1, ['Full', 'Pinline Super (m15)', 'Title (m15)', 'Type (m15)', 'Rules (m15)', 'Border (m15)']],
		['White Power/Toughness', '/data/images/cardImages/m15/m15PTW.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Blue Power/Toughness', '/data/images/cardImages/m15/m15PTU.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Black Power/Toughness', '/data/images/cardImages/m15/m15PTB.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Red Power/Toughness', '/data/images/cardImages/m15/m15PTR.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Green Power/Toughness', '/data/images/cardImages/m15/m15PTG.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Multicolored Power/Toughness', '/data/images/cardImages/m15/m15PTM.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Artifact Power/Toughness', '/data/images/cardImages/m15/m15PTA.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Colorless Power/Toughness', '/data/images/cardImages/m15/m15PTC.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['White Border', '/data/images/cardImages/white.png', 0, 0, 1, 1, ['Alternative Border', 'Alternative Border (Crown)', 'Border (m15)']],
		['Silver Border', '/data/images/cardImages/silver.png', 0, 0, 1, 1, ['Alternative Border', 'Alternative Border (Crown)', 'Border (m15)']],
		['Gold Border', '/data/images/cardImages/gold.png', 0, 0, 1, 1, ['Alternative Border', 'Alternative Border (Crown)', 'Border (m15)']]
	], 'frameClassTokenTall')
}

if (currentVersion != 'token/tall') {
	currentVersion = 'token/tall'
	
	loadTextOptions([
	new cardText('Card Title', '', 126/1500, 188/2100, 1248/1500, 80/2100, 'belerenb', 80/2100, 'white', ['oneLine=true','textAlign="center"']),
	new cardText('Card Type', '', 126/1500, 1264/2100, 1248/1500, 68/2100, 'belerenb', 68/2100, 'black', ['oneLine=true']),
	new cardText('Rules Text', '', 135/1500, 1370/2100, 1230/1500, 625/2100, 'mplantin', 74/2100, 'black'),
	new cardText('Power/Toughness', '', 1191/1500, 1954/2100, 205/1500, 78/2100, 'belerenbsc', 78/2100, 'black', ['oneLine=true,textAlign="center"'])
	])

	setSymbolX = [scaleX(1382/1500), 'right']
	setSymbolY = [scaleY(1241/2100), 'center']
	setSymbolWidth = scaleX(180/1500)
	setSymbolHeight = scaleY(86/2100)
}

hideFrameImages('frameClassTokenTall')