if (!loadedVersions.includes('m15Textless/genericShowcase')) {
	loadedVersions.push('m15Textless/genericShowcase')
	loadFrameImages([
		['White Frame', '/data/images/cardImages/m15Textless/genericShowcase/m15TextlessGenericShowcaseFrameW.png', 0, 0, 1, 1, ['Full', 'Pinline (m15 Textless)', 'Title (m15)', 'Type (m15 Textless)', 'Border (m15)']],
		['Blue Frame', '/data/images/cardImages/m15Textless/genericShowcase/m15TextlessGenericShowcaseFrameU.png', 0, 0, 1, 1, ['Full', 'Pinline (m15 Textless)', 'Title (m15)', 'Type (m15 Textless)', 'Border (m15)']],
		['Black Frame', '/data/images/cardImages/m15Textless/genericShowcase/m15TextlessGenericShowcaseFrameB.png', 0, 0, 1, 1, ['Full', 'Pinline (m15 Textless)', 'Title (m15)', 'Type (m15 Textless)', 'Border (m15)']],
		['Red Frame', '/data/images/cardImages/m15Textless/genericShowcase/m15TextlessGenericShowcaseFrameR.png', 0, 0, 1, 1, ['Full', 'Pinline (m15 Textless)', 'Title (m15)', 'Type (m15 Textless)', 'Border (m15)']],
		['Green Frame', '/data/images/cardImages/m15Textless/genericShowcase/m15TextlessGenericShowcaseFrameG.png', 0, 0, 1, 1, ['Full', 'Pinline (m15 Textless)', 'Title (m15)', 'Type (m15 Textless)', 'Border (m15)']],
		['Multicolored Frame', '/data/images/cardImages/m15Textless/genericShowcase/m15TextlessGenericShowcaseFrameM.png', 0, 0, 1, 1, ['Full', 'Pinline (m15 Textless)', 'Title (m15)', 'Type (m15 Textless)', 'Border (m15)']],
		['Artifact Frame', '/data/images/cardImages/m15Textless/genericShowcase/m15TextlessGenericShowcaseFrameA.png', 0, 0, 1, 1, ['Full', 'Pinline (m15 Textless)', 'Title (m15)', 'Type (m15 Textless)', 'Border (m15)']],
		['Land Frame', '/data/images/cardImages/m15Textless/genericShowcase/m15TextlessGenericShowcaseFrameL.png', 0, 0, 1, 1, ['Full', 'Pinline (m15 Textless)', 'Title (m15)', 'Type (m15 Textless)', 'Border (m15)']],
		['Darkened White Power/Toughness', '/data/images/cardImages/m15/m15NicknamePTW.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Darkened Blue Power/Toughness', '/data/images/cardImages/m15/m15NicknamePTU.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Darkened Black Power/Toughness', '/data/images/cardImages/m15/m15NicknamePTB.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Darkened Red Power/Toughness', '/data/images/cardImages/m15/m15NicknamePTR.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Darkened Green Power/Toughness', '/data/images/cardImages/m15/m15NicknamePTG.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Darkened Multicolored Power/Toughness', '/data/images/cardImages/m15/m15NicknamePTM.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Darkened Artifact Power/Toughness', '/data/images/cardImages/m15/m15NicknamePTA.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Darkened Colorless Power/Toughness', '/data/images/cardImages/m15/m15NicknamePTC.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['White Border', '/data/images/cardImages/white.png', 0, 0, 1, 1, ['Alternative Border', 'Alternative Border (Crown)', 'Border (m15)']],
		['Silver Border', '/data/images/cardImages/silver.png', 0, 0, 1, 1, ['Alternative Border', 'Alternative Border (Crown)', 'Border (m15)']],
		['Gold Border', '/data/images/cardImages/gold.png', 0, 0, 1, 1, ['Alternative Border', 'Alternative Border (Crown)', 'Border (m15)']]
	], 'frameClassM15TextlessGenericShowcase')
}

if (currentVersion != 'm15Textless/genericShowcase') {
	currentVersion = 'm15Textless/genericShowcase'

	loadTextOptions([
	new cardText('Card Title', '', 126/1500, 188/2100, 1248/1500, 80/2100, 'belerenb', 80/2100, 'white', ['oneLine=true']),
	new cardText('Card Type', '', 126/1500, 1795/2100, 1248/1500, 68/2100, 'belerenb', 68/2100, 'white', ['oneLine=true']),
	new cardText('Power/Toughness', '', 1191/1500, 1954/2100, 205/1500, 78/2100, 'belerenbsc', 78/2100, 'white', ['oneLine=true,textAlign="center"'])
	])

	artX = scaleX(0 / 1500)
	artY = scaleY(0 / 2100)
	artWidth = scaleX(1)
	artHeight = scaleY(1948 / 2100)
}

hideFrameImages('frameClassM15TextlessGenericShowcase')