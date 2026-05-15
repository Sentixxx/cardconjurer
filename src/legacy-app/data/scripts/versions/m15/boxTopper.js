if (!loadedVersions.includes('m15/boxTopper')) {
	loadedVersions.push("m15/boxTopper")
	loadFrameImages([
		['White Box Topper Frame', '/data/images/cardImages/m15/boxTopper/m15BoxTopperFrameW.png', 0, 0, 1, 1, ['Full', 'Pinline Super (m15)', 'Title (m15)', 'Type (m15)', 'Rules (m15)', 'Frame (m15)', 'Border (m15)']],
		['Blue Box Topper Frame', '/data/images/cardImages/m15/boxTopper/m15BoxTopperFrameU.png', 0, 0, 1, 1, ['Full', 'Pinline Super (m15)', 'Title (m15)', 'Type (m15)', 'Rules (m15)', 'Frame (m15)', 'Border (m15)']],
		['Black Box Topper Frame', '/data/images/cardImages/m15/boxTopper/m15BoxTopperFrameB.png', 0, 0, 1, 1, ['Full', 'Pinline Super (m15)', 'Title (m15)', 'Type (m15)', 'Rules (m15)', 'Frame (m15)', 'Border (m15)']],
		['Red Box Topper Frame', '/data/images/cardImages/m15/boxTopper/m15BoxTopperFrameR.png', 0, 0, 1, 1, ['Full', 'Pinline Super (m15)', 'Title (m15)', 'Type (m15)', 'Rules (m15)', 'Frame (m15)', 'Border (m15)']],
		['Green Box Topper Frame', '/data/images/cardImages/m15/boxTopper/m15BoxTopperFrameG.png', 0, 0, 1, 1, ['Full', 'Pinline Super (m15)', 'Title (m15)', 'Type (m15)', 'Rules (m15)', 'Frame (m15)', 'Border (m15)']],
		['Multicolored Box Topper Frame', '/data/images/cardImages/m15/boxTopper/m15BoxTopperFrameM.png', 0, 0, 1, 1, ['Full', 'Pinline Super (m15)', 'Title (m15)', 'Type (m15)', 'Rules (m15)', 'Frame (m15)', 'Border (m15)']],
		['Artifact Box Topper Frame', '/data/images/cardImages/m15/boxTopper/m15BoxTopperFrameA.png', 0, 0, 1, 1, ['Full', 'Pinline Super (m15)', 'Title (m15)', 'Type (m15)', 'Rules (m15)', 'Frame (m15)', 'Border (m15)']],
		['Land Box Topper Frame', '/data/images/cardImages/m15/boxTopper/m15BoxTopperFrameL.png', 0, 0, 1, 1, ['Full', 'Pinline Super (m15)', 'Title (m15)', 'Type (m15)', 'Rules (m15)', 'Frame (m15)', 'Border (m15)']],
		['Vehicle Box Topper Frame', '/data/images/cardImages/m15/boxTopper/m15BoxTopperFrameV.png', 0, 0, 1, 1, ['Full', 'Pinline Super (m15)', 'Title (m15)', 'Type (m15)', 'Rules (m15)', 'Frame (m15)', 'Border (m15)']],
		['White Power/Toughness', '/data/images/cardImages/m15/m15PTW.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Blue Power/Toughness', '/data/images/cardImages/m15/m15PTU.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Black Power/Toughness', '/data/images/cardImages/m15/m15PTB.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Red Power/Toughness', '/data/images/cardImages/m15/m15PTR.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Green Power/Toughness', '/data/images/cardImages/m15/m15PTG.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Multicolored Power/Toughness', '/data/images/cardImages/m15/m15PTM.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Artifact Power/Toughness', '/data/images/cardImages/m15/m15PTA.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Colorless Power/Toughness', '/data/images/cardImages/m15/m15PTC.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Box Topper Bevel Cutout For Nickname', '/data/images/cardImages/black.png', 87/1500, 233/2100, 1325/1500, 80/2100, ['Full']],
		['Nickname Bevel', '/data/images/cardImages/m15/boxTopper/m15BoxTopperNicknameBevel.png', 87/1500, 233/2100, 1325/1500, 80/2100, ['Full']]
	], 'frameClassM15BoxTopper')
}

if (currentVersion != 'm15/boxTopper') {
	currentVersion = 'm15/boxTopper'
	
	loadTextOptions([
	new cardText('Card Title', '', 126/1500, 188/2100, 1248/1500, 80/2100, 'belerenb', 80/2100, 'black', ['oneLine=true']),
	new cardText('Card Type', '', 126/1500, 1264/2100, 1248/1500, 68/2100, 'belerenb', 68/2100, 'white', ['oneLine=true']),
	new cardText('Rules Text', '', 135/1500, 1370/2100, 1230/1500, 625/2100, 'mplantin', 74/2100, 'black'),
	new cardText('Power/Toughness', '', 1191/1500, 1954/2100, 205/1500, 78/2100, 'belerenbsc', 78/2100, 'black', ['oneLine=true,textAlign="center"'])
	])

	artX = 0
	artY = scaleY(170/2100)
	artWidth = scaleX(1)
	artHeight = scaleY(1115 / 2100)
}

hideFrameImages('frameClassM15BoxTopper')