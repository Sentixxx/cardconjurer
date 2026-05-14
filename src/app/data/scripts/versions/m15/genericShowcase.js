if (!loadedVersions.includes('m15/genericShowcase')) {
	loadedVersions.push('m15/genericShowcase')
	loadFrameImages([
		['White Frame', '/data/images/cardImages/m15/genericShowcase/m15GenericShowcaseFrameW.png', 0, 0, 1, 1, ['Full', 'Pinline Super (m15)', 'Title (m15)', 'Type (m15)', 'Rules (m15)', 'Border (m15)']],
		['Blue Frame', '/data/images/cardImages/m15/genericShowcase/m15GenericShowcaseFrameU.png', 0, 0, 1, 1, ['Full', 'Pinline Super (m15)', 'Title (m15)', 'Type (m15)', 'Rules (m15)', 'Border (m15)']],
		['Black Frame', '/data/images/cardImages/m15/genericShowcase/m15GenericShowcaseFrameB.png', 0, 0, 1, 1, ['Full', 'Pinline Super (m15)', 'Title (m15)', 'Type (m15)', 'Rules (m15)', 'Border (m15)']],
		['Red Frame', '/data/images/cardImages/m15/genericShowcase/m15GenericShowcaseFrameR.png', 0, 0, 1, 1, ['Full', 'Pinline Super (m15)', 'Title (m15)', 'Type (m15)', 'Rules (m15)', 'Border (m15)']],
		['Green Frame', '/data/images/cardImages/m15/genericShowcase/m15GenericShowcaseFrameG.png', 0, 0, 1, 1, ['Full', 'Pinline Super (m15)', 'Title (m15)', 'Type (m15)', 'Rules (m15)', 'Border (m15)']],
		['Multicolored Frame', '/data/images/cardImages/m15/genericShowcase/m15GenericShowcaseFrameM.png', 0, 0, 1, 1, ['Full', 'Pinline Super (m15)', 'Title (m15)', 'Type (m15)', 'Rules (m15)', 'Border (m15)']],
		['Artifact Frame', '/data/images/cardImages/m15/genericShowcase/m15GenericShowcaseFrameA.png', 0, 0, 1, 1, ['Full', 'Pinline Super (m15)', 'Title (m15)', 'Type (m15)', 'Rules (m15)', 'Border (m15)']],
		['Land Frame', '/data/images/cardImages/m15/genericShowcase/m15GenericShowcaseFrameL.png', 0, 0, 1, 1, ['Full', 'Pinline Super (m15)', 'Title (m15)', 'Type (m15)', 'Rules (m15)', 'Border (m15)']],
		['Darkened White Power/Toughness', '/data/images/cardImages/m15/m15NicknamePTW.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Darkened Blue Power/Toughness', '/data/images/cardImages/m15/m15NicknamePTU.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Darkened Black Power/Toughness', '/data/images/cardImages/m15/m15NicknamePTB.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Darkened Red Power/Toughness', '/data/images/cardImages/m15/m15NicknamePTR.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Darkened Green Power/Toughness', '/data/images/cardImages/m15/m15NicknamePTG.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Darkened Multicolored Power/Toughness', '/data/images/cardImages/m15/m15NicknamePTM.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Darkened Artifact Power/Toughness', '/data/images/cardImages/m15/m15NicknamePTA.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Darkened Colorless Power/Toughness', '/data/images/cardImages/m15/m15NicknamePTC.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']]
	], 'frameClassM15GenericShowcase')
}

if (currentVersion != 'm15/genericShowcase') {
	currentVersion = 'm15/genericShowcase'
	
	loadTextOptions([
	new cardText('Card Title', '', 126/1500, 188/2100, 1248/1500, 80/2100, 'belerenb', 80/2100, 'white', ['oneLine=true']),
	new cardText('Card Type', '', 126/1500, 1264/2100, 1248/1500, 68/2100, 'belerenb', 68/2100, 'white', ['oneLine=true']),
	new cardText('Rules Text', '', 135/1500, 1370/2100, 1230/1500, 625/2100, 'mplantin', 74/2100, 'white'),
	new cardText('Power/Toughness', '', 1191/1500, 1954/2100, 205/1500, 78/2100, 'belerenbsc', 78/2100, 'white', ['oneLine=true,textAlign="center"'])
	])

	artX = 0
	artY = 0
	artWidth = scaleX(1)
	artHeight = scaleY(1936 / 2100)
}

hideFrameImages('frameClassM15GenericShowcase')