if (!loadedVersions.includes('expedition/regular')) {
	loadedVersions.push('expedition/regular')
	loadFrameImages([
		['Land Frame', '/data/images/cardImages/expedition/expeditionFrameL.png', 0, 0, 1, 1, ['Full', 'Pinline (expedition)', 'Title (m15)', 'Type (m15 textless)', 'Frame (expedition)', 'Rules (expedition)', 'Border (m15)']],
		['White Frame', '/data/images/cardImages/expedition/expeditionFrameW.png', 0, 0, 1, 1, ['Full', 'Pinline (expedition)', 'Title (m15)', 'Type (m15 textless)', 'Frame (expedition)', 'Rules (expedition)', 'Border (m15)']],
		['Blue Frame', '/data/images/cardImages/expedition/expeditionFrameU.png', 0, 0, 1, 1, ['Full', 'Pinline (expedition)', 'Title (m15)', 'Type (m15 textless)', 'Frame (expedition)', 'Rules (expedition)', 'Border (m15)']],
		['Black Frame', '/data/images/cardImages/expedition/expeditionFrameB.png', 0, 0, 1, 1, ['Full', 'Pinline (expedition)', 'Title (m15)', 'Type (m15 textless)', 'Frame (expedition)', 'Rules (expedition)', 'Border (m15)']],
		['Red Frame', '/data/images/cardImages/expedition/expeditionFrameR.png', 0, 0, 1, 1, ['Full', 'Pinline (expedition)', 'Title (m15)', 'Type (m15 textless)', 'Frame (expedition)', 'Rules (expedition)', 'Border (m15)']],
		['Green Frame', '/data/images/cardImages/expedition/expeditionFrameG.png', 0, 0, 1, 1, ['Full', 'Pinline (expedition)', 'Title (m15)', 'Type (m15 textless)', 'Frame (expedition)', 'Rules (expedition)', 'Border (m15)']],
		['Multicolored Frame', '/data/images/cardImages/expedition/expeditionFrameM.png', 0, 0, 1, 1, ['Full', 'Pinline (expedition)', 'Title (m15)', 'Type (m15 textless)', 'Frame (expedition)', 'Rules (expedition)', 'Border (m15)']],
		['Artifact Frame', '/data/images/cardImages/expedition/expeditionFrameA.png', 0, 0, 1, 1, ['Full', 'Pinline (expedition)', 'Title (m15)', 'Type (m15 textless)', 'Frame (expedition)', 'Rules (expedition)', 'Border (m15)']],
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
	], 'frameClassExpeditionRegular')
}

hideFrameImages('frameClassExpeditionRegular')