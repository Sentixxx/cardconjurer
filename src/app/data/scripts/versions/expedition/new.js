if (!loadedVersions.includes('expedition/new')) {
	loadedVersions.push('expedition/new')
	loadMaskImages([['Pinline (expedition new)', '/data/images/cardImages/expedition/new/expeditionNewMaskPinline.png'], ['Type (expedition new)', '/data/images/cardImages/expedition/new/expeditionNewMaskType.png'], ['Frame (expedition new)', '/data/images/cardImages/expedition/new/expeditionNewMaskFrame.png'], ['Text (expedition new)', '/data/images/cardImages/expedition/new/expeditionNewMaskText.png'], ['Border (expedition new)', '/data/images/cardImages/expedition/new/expeditionNewMaskBorder.png']])
	loadFrameImages([
		['White Frame', '/data/images/cardImages/expedition/new/expeditionNewFrameW.png', 0, 0, 1, 1, ['Full', 'Pinline (expedition new)', 'Title (m15)', 'Type (expedition new)', 'Frame (expedition new)', 'Text (expedition new)', 'Border (expedition new)']],
		['Blue Frame', '/data/images/cardImages/expedition/new/expeditionNewFrameU.png', 0, 0, 1, 1, ['Full', 'Pinline (expedition new)', 'Title (m15)', 'Type (expedition new)', 'Frame (expedition new)', 'Text (expedition new)', 'Border (expedition new)']],
		['Black Frame', '/data/images/cardImages/expedition/new/expeditionNewFrameB.png', 0, 0, 1, 1, ['Full', 'Pinline (expedition new)', 'Title (m15)', 'Type (expedition new)', 'Frame (expedition new)', 'Text (expedition new)', 'Border (expedition new)']],
		['Red Frame', '/data/images/cardImages/expedition/new/expeditionNewFrameR.png', 0, 0, 1, 1, ['Full', 'Pinline (expedition new)', 'Title (m15)', 'Type (expedition new)', 'Frame (expedition new)', 'Text (expedition new)', 'Border (expedition new)']],
		['Green Frame', '/data/images/cardImages/expedition/new/expeditionNewFrameG.png', 0, 0, 1, 1, ['Full', 'Pinline (expedition new)', 'Title (m15)', 'Type (expedition new)', 'Frame (expedition new)', 'Text (expedition new)', 'Border (expedition new)']],
		['Multicolored Frame', '/data/images/cardImages/expedition/new/expeditionNewFrameM.png', 0, 0, 1, 1, ['Full', 'Pinline (expedition new)', 'Title (m15)', 'Type (expedition new)', 'Frame (expedition new)', 'Text (expedition new)', 'Border (expedition new)']],
		['Land Frame', '/data/images/cardImages/expedition/new/expeditionNewFrameL.png', 0, 0, 1, 1, ['Full', 'Pinline (expedition new)', 'Title (m15)', 'Type (expedition new)', 'Frame (expedition new)', 'Text (expedition new)', 'Border (expedition new)']],
		['Colorless Frame', '/data/images/cardImages/expedition/new/expeditionNewFrameC.png', 0, 0, 1, 1, ['Full', 'Pinline (expedition new)', 'Title (m15)', 'Type (expedition new)', 'Frame (expedition new)', 'Text (expedition new)', 'Border (expedition new)']],
		['White Power/Toughness', '/data/images/cardImages/m15/m15PTW.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Blue Power/Toughness', '/data/images/cardImages/m15/m15PTU.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Black Power/Toughness', '/data/images/cardImages/m15/m15PTB.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Red Power/Toughness', '/data/images/cardImages/m15/m15PTR.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Green Power/Toughness', '/data/images/cardImages/m15/m15PTG.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Multicolored Power/Toughness', '/data/images/cardImages/m15/m15PTM.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Artifact Power/Toughness', '/data/images/cardImages/m15/m15PTA.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Colorless Power/Toughness', '/data/images/cardImages/m15/m15PTC.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']]
	], 'frameClassExpeditionNew')
}

if (currentVersion != 'expedition/new') {
	currentVersion = 'expedition/new'

	artX = scaleX(60 / 1500)
	artY = scaleY(140 / 2100)
	artWidth = scaleX(1380 / 1500)
	artHeight = scaleY(1572 / 2100)

	setSymbolX = [scaleX(1419/1500), 'right']
	setSymbolY = [scaleY(1772/2100), 'center']
	setSymbolWidth = scaleX(180/1500)
	setSymbolHeight = scaleY(80/2100)

	loadTextOptions([
	new cardText('Card Title', '', 126/1500, 188/2100, 1248/1500, 80/2100, 'belerenb', 80/2100, 'black', ['oneLine=true']),
	new cardText('Card Type', '', 126/1500, 1795/2100, 1248/1500, 68/2100, 'belerenb', 68/2100, 'black', ['oneLine=true']),
	new cardText('Rules Text', '', 150/1500, 1205/2100, 1200/1500, 600/2100, 'mplantin', 74/2100, 'black'),
	new cardText('Power/Toughness', '', 1191/1500, 1954/2100, 205/1500, 78/2100, 'belerenbsc', 78/2100, 'black', ['oneLine=true,textAlign="center"'])
	])
}

hideFrameImages('frameClassExpeditionNew')