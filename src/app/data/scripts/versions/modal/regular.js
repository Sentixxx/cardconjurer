if (!loadedVersions.includes('modal/regular')) {
	loadedVersions.push('modal/regular')
	loadFrameImages([
		['Front Icon', '/data/images/cardImages/modal/modalIconFront.png', 109/1500, 130/2100, 60/1500, 50/2100, ['Full']],
		['White Frame (Front)', '/data/images/cardImages/modal/modalFrameW.png', 0, 0, 1, 1, ['Full', 'Flipside (modal)', 'Pinline (modal)', 'Title (modal)', 'Type (m15)', 'Rules (modal)', 'Frame (modal)', 'Border (modal)']],
		['Blue Frame (Front)', '/data/images/cardImages/modal/modalFrameU.png', 0, 0, 1, 1, ['Full', 'Flipside (modal)', 'Pinline (modal)', 'Title (modal)', 'Type (m15)', 'Rules (modal)', 'Frame (modal)', 'Border (modal)']],
		['Black Frame (Front)', '/data/images/cardImages/modal/modalFrameB.png', 0, 0, 1, 1, ['Full', 'Flipside (modal)', 'Pinline (modal)', 'Title (modal)', 'Type (m15)', 'Rules (modal)', 'Frame (modal)', 'Border (modal)']],
		['Red Frame (Front)', '/data/images/cardImages/modal/modalFrameR.png', 0, 0, 1, 1, ['Full', 'Flipside (modal)', 'Pinline (modal)', 'Title (modal)', 'Type (m15)', 'Rules (modal)', 'Frame (modal)', 'Border (modal)']],
		['Green Frame (Front)', '/data/images/cardImages/modal/modalFrameG.png', 0, 0, 1, 1, ['Full', 'Flipside (modal)', 'Pinline (modal)', 'Title (modal)', 'Type (m15)', 'Rules (modal)', 'Frame (modal)', 'Border (modal)']],
		['Multicolored Frame (Front)', '/data/images/cardImages/modal/modalFrameM.png', 0, 0, 1, 1, ['Full', 'Flipside (modal)', 'Pinline (modal)', 'Title (modal)', 'Type (m15)', 'Rules (modal)', 'Frame (modal)', 'Border (modal)']],
		['Artifact Frame (Front)', '/data/images/cardImages/modal/modalFrameA.png', 0, 0, 1, 1, ['Full', 'Flipside (modal)', 'Pinline (modal)', 'Title (modal)', 'Type (m15)', 'Rules (modal)', 'Frame (modal)', 'Border (modal)']],
		['Land Frame (Front)', '/data/images/cardImages/modal/modalFrameL.png', 0, 0, 1, 1, ['Full', 'Flipside (modal)', 'Pinline (modal)', 'Title (modal)', 'Type (m15)', 'Rules (modal)', 'Frame (modal)', 'Border (modal)']],
		['Vehicle Frame (Front)', '/data/images/cardImages/modal/modalFrameV.png', 0, 0, 1, 1, ['Full', 'Flipside (modal)', 'Pinline (modal)', 'Title (modal)', 'Type (m15)', 'Rules (modal)', 'Frame (modal)', 'Border (modal)']],
		['White Power/Toughness', '/data/images/cardImages/m15/m15PTW.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Blue Power/Toughness', '/data/images/cardImages/m15/m15PTU.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Black Power/Toughness', '/data/images/cardImages/m15/m15PTB.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Red Power/Toughness', '/data/images/cardImages/m15/m15PTR.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Green Power/Toughness', '/data/images/cardImages/m15/m15PTG.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Multicolored Power/Toughness', '/data/images/cardImages/m15/m15PTM.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Artifact Power/Toughness', '/data/images/cardImages/m15/m15PTA.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Colorless Power/Toughness', '/data/images/cardImages/m15/m15PTC.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']]
	], 'frameClassModalRegular')
}

hideFrameImages('frameClassModalRegular')