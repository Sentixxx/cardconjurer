if (!loadedVersions.includes('m15/devoid')) {
	loadedVersions.push("m15/devoid")
	loadFrameImages([
		['White Devoid Frame', '/data/images/cardImages/m15/devoid/m15DevoidFrameW.png', 0, 0, 1, 1, ['Full', 'Pinline (m15)', 'Title (m15)', 'Type (m15)', 'Rules (m15)', 'Frame (m15)', 'Border (m15)', 'Pinline Super (m15)']],
		['Blue Devoid Frame', '/data/images/cardImages/m15/devoid/m15DevoidFrameU.png', 0, 0, 1, 1, ['Full', 'Pinline (m15)', 'Title (m15)', 'Type (m15)', 'Rules (m15)', 'Frame (m15)', 'Border (m15)', 'Pinline Super (m15)']],
		['Black Devoid Frame', '/data/images/cardImages/m15/devoid/m15DevoidFrameB.png', 0, 0, 1, 1, ['Full', 'Pinline (m15)', 'Title (m15)', 'Type (m15)', 'Rules (m15)', 'Frame (m15)', 'Border (m15)', 'Pinline Super (m15)']],
		['Red Devoid Frame', '/data/images/cardImages/m15/devoid/m15DevoidFrameR.png', 0, 0, 1, 1, ['Full', 'Pinline (m15)', 'Title (m15)', 'Type (m15)', 'Rules (m15)', 'Frame (m15)', 'Border (m15)', 'Pinline Super (m15)']],
		['Green Devoid Frame', '/data/images/cardImages/m15/devoid/m15DevoidFrameG.png', 0, 0, 1, 1, ['Full', 'Pinline (m15)', 'Title (m15)', 'Type (m15)', 'Rules (m15)', 'Frame (m15)', 'Border (m15)', 'Pinline Super (m15)']],
		['Multicolored Devoid Frame', '/data/images/cardImages/m15/devoid/m15DevoidFrameM.png', 0, 0, 1, 1, ['Full', 'Pinline (m15)', 'Title (m15)', 'Type (m15)', 'Rules (m15)', 'Frame (m15)', 'Border (m15)', 'Pinline Super (m15)']],
		['Artifact Devoid Frame', '/data/images/cardImages/m15/devoid/m15DevoidFrameA.png', 0, 0, 1, 1, ['Full', 'Pinline (m15)', 'Title (m15)', 'Type (m15)', 'Rules (m15)', 'Frame (m15)', 'Border (m15)', 'Pinline Super (m15)']],
		['Land Devoid Frame', '/data/images/cardImages/m15/devoid/m15DevoidFrameL.png', 0, 0, 1, 1, ['Full', 'Pinline (m15)', 'Title (m15)', 'Type (m15)', 'Rules (m15)', 'Frame (m15)', 'Border (m15)', 'Pinline Super (m15)']],
		['Devoid Power/Toughness', '/data/images/cardImages/m15/m15NicknamePTC.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']]
	], 'frameClassM15Devoid')
}

if (currentVersion != 'm15/devoid') {
	currentVersion = 'm15/devoid'

	artX = scaleX(60 / 1500)
	artY = scaleY(218 / 2100)
	artWidth = scaleX(1380 / 1500)
	artHeight = scaleY(1720 / 2100)

	if (skipResizeCardArt > 0) {
		skipResizeCardArt -= 1
	}
	if (skipLoadTextList > 0) {
		skipLoadTextList -= 1
	}
}

hideFrameImages('frameClassM15Devoid')