if (!loadedVersions.includes('m15Textless/basic')) {
	loadedVersions.push('m15Textless/basic')
	loadMaskImages([['Pinline (m15 Textless Basic)', '/data/images/cardImages/m15Textless/basic/m15TextlessBasicMaskPinline.png'], ['Type (m15 Textless Basic)', '/data/images/cardImages/m15Textless/basic/m15TextlessBasicMaskType.png'], ['Frame (m15 Textless Basic)', '/data/images/cardImages/m15Textless/basic/m15TextlessBasicMaskFrame.png']])
	loadFrameImages([
		['White Frame', '/data/images/cardImages/m15Textless/basic/m15TextlessBasicW.png', 0, 0, 1, 1, ['Full', 'Frame (m15 Textless Basic)', 'Pinline (m15 Textless Basic)', 'Title (m15)', 'Type (m15 Textless Basic)', 'Border (m15)']],
		['Blue Frame', '/data/images/cardImages/m15Textless/basic/m15TextlessBasicU.png', 0, 0, 1, 1, ['Full', 'Frame (m15 Textless Basic)', 'Pinline (m15 Textless Basic)', 'Title (m15)', 'Type (m15 Textless Basic)', 'Border (m15)']],
		['Black Frame', '/data/images/cardImages/m15Textless/basic/m15TextlessBasicB.png', 0, 0, 1, 1, ['Full', 'Frame (m15 Textless Basic)', 'Pinline (m15 Textless Basic)', 'Title (m15)', 'Type (m15 Textless Basic)', 'Border (m15)']],
		['Red Frame', '/data/images/cardImages/m15Textless/basic/m15TextlessBasicR.png', 0, 0, 1, 1, ['Full', 'Frame (m15 Textless Basic)', 'Pinline (m15 Textless Basic)', 'Title (m15)', 'Type (m15 Textless Basic)', 'Border (m15)']],
		['Green Frame', '/data/images/cardImages/m15Textless/basic/m15TextlessBasicG.png', 0, 0, 1, 1, ['Full', 'Frame (m15 Textless Basic)', 'Pinline (m15 Textless Basic)', 'Title (m15)', 'Type (m15 Textless Basic)', 'Border (m15)']],
		['Multicolored Frame', '/data/images/cardImages/m15Textless/basic/m15TextlessBasicM.png', 0, 0, 1, 1, ['Full', 'Frame (m15 Textless Basic)', 'Pinline (m15 Textless Basic)', 'Title (m15)', 'Type (m15 Textless Basic)', 'Border (m15)']],
		['Land Frame', '/data/images/cardImages/m15Textless/basic/m15TextlessBasicL.png', 0, 0, 1, 1, ['Full', 'Frame (m15 Textless Basic)', 'Pinline (m15 Textless Basic)', 'Title (m15)', 'Type (m15 Textless Basic)', 'Border (m15)']],
		['White', '/data/images/cardImages/m15Textless/basic/m15TextlessBasicSymbolW.svg', 650/1500, 1670/2100, 200/1500, 240/2100, ['Full']],
		['Blue', '/data/images/cardImages/m15Textless/basic/m15TextlessBasicSymbolU.svg', 650/1500, 1670/2100, 200/1500, 240/2100, ['Full']],
		['Black', '/data/images/cardImages/m15Textless/basic/m15TextlessBasicSymbolB.svg', 650/1500, 1670/2100, 200/1500, 240/2100, ['Full']],
		['Red', '/data/images/cardImages/m15Textless/basic/m15TextlessBasicSymbolR.svg', 650/1500, 1670/2100, 200/1500, 240/2100, ['Full']],
		['Green', '/data/images/cardImages/m15Textless/basic/m15TextlessBasicSymbolG.svg', 650/1500, 1670/2100, 200/1500, 240/2100, ['Full']],
		['Colorless', '/data/images/cardImages/m15Textless/basic/m15TextlessBasicSymbolC.svg', 650/1500, 1670/2100, 200/1500, 240/2100, ['Full']],
		['White Border', '/data/images/cardImages/white.png', 0, 0, 1, 1, ['Alternative Border', 'Alternative Border (Crown)', 'Border (m15)']],
		['Silver Border', '/data/images/cardImages/silver.png', 0, 0, 1, 1, ['Alternative Border', 'Alternative Border (Crown)', 'Border (m15)']],
		['Gold Border', '/data/images/cardImages/gold.png', 0, 0, 1, 1, ['Alternative Border', 'Alternative Border (Crown)', 'Border (m15)']]
	], 'frameClassM15TextlessBasic')
}

if (currentVersion != 'm15Textless/basic') {
	currentVersion = 'm15Textless/basic'

	artX = scaleX(116 / 1500)
	artY = scaleY(237 / 2100)
	artWidth = scaleX(1268 / 1500)
	artHeight = scaleY(1460 / 2100)

	loadTextOptions([
	new cardText('Card Title', '', 126/1500, 188/2100, 1248/1500, 80/2100, 'belerenb', 80/2100, 'black', ['oneLine=true']),
	new cardText('Card Type', '', 126/1500, 1795/2100, 504/1500, 68/2100, 'belerenb', 68/2100, 'black', ['oneLine=true']),
	new cardText('Supertype', '', 870/1500, 1795/2100, 350/1500, 68/2100, 'belerenb', 68/2100, 'black', ['oneLine=true','textAlign="center"']),
	])
}

hideFrameImages('frameClassM15TextlessBasic')