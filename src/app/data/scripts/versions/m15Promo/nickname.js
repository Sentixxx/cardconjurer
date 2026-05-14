if (!loadedVersions.includes('m15Promo/nickname')) {
	loadedVersions.push("m15Promo/nickname")
	loadMaskImages([['Nickname Legend Crown (m15)', '/data/images/cardImages/m15/m15MaskNicknameLegendCrownStrokeless.png'], ['Nickname Title (m15)', '/data/images/cardImages/m15/m15MaskNicknameTitleStrokeless.png'], ['Nickname True Name (m15)', '/data/images/cardImages/m15/nickname/m15NicknameMaskTrueName.png']])
	loadFrameImages([
		['White Nickname Frame', '/data/images/cardImages/m15Promo/m15PromoNicknameFrameW.png', 0, 0, 1, 1, ['Full', 'Pinline (m15 Promo)', 'Type (m15 Promo)', 'Rules (m15 Promo)', 'Border (m15)']],
		['Blue Nickname Frame', '/data/images/cardImages/m15Promo/m15PromoNicknameFrameU.png', 0, 0, 1, 1, ['Full', 'Pinline (m15 Promo)', 'Type (m15 Promo)', 'Rules (m15 Promo)', 'Border (m15)']],
		['Black Nickname Frame', '/data/images/cardImages/m15Promo/m15PromoNicknameFrameB.png', 0, 0, 1, 1, ['Full', 'Pinline (m15 Promo)', 'Type (m15 Promo)', 'Rules (m15 Promo)', 'Border (m15)']],
		['Red Nickname Frame', '/data/images/cardImages/m15Promo/m15PromoNicknameFrameR.png', 0, 0, 1, 1, ['Full', 'Pinline (m15 Promo)', 'Type (m15 Promo)', 'Rules (m15 Promo)', 'Border (m15)']],
		['Green Nickname Frame', '/data/images/cardImages/m15Promo/m15PromoNicknameFrameG.png', 0, 0, 1, 1, ['Full', 'Pinline (m15 Promo)', 'Type (m15 Promo)', 'Rules (m15 Promo)', 'Border (m15)']],
		['Multicolored Nickname Frame', '/data/images/cardImages/m15Promo/m15PromoNicknameFrameM.png', 0, 0, 1, 1, ['Full', 'Pinline (m15 Promo)', 'Type (m15 Promo)', 'Rules (m15 Promo)', 'Border (m15)']],
		['Artifact Nickname Frame', '/data/images/cardImages/m15Promo/m15PromoNicknameFrameA.png', 0, 0, 1, 1, ['Full', 'Pinline (m15 Promo)', 'Type (m15 Promo)', 'Rules (m15 Promo)', 'Border (m15)']],
		['Land Nickname Frame', '/data/images/cardImages/m15Promo/m15PromoNicknameFrameL.png', 0, 0, 1, 1, ['Full', 'Pinline (m15 Promo)', 'Type (m15 Promo)', 'Rules (m15 Promo)', 'Border (m15)']],
		['White Nickname Title', '/data/images/cardImages/m15/m15NicknameTitleW.png', 74/1500, 85/2100, 1352/1500, 221/2100, ['Full', 'Nickname Title (m15)', 'Title (m15)', 'Nickname True Name (m15)']],
		['Blue Nickname Title', '/data/images/cardImages/m15/m15NicknameTitleU.png', 74/1500, 85/2100, 1352/1500, 221/2100, ['Full', 'Nickname Title (m15)', 'Title (m15)', 'Nickname True Name (m15)']],
		['Black Nickname Title', '/data/images/cardImages/m15/m15NicknameTitleB.png', 74/1500, 85/2100, 1352/1500, 221/2100, ['Full', 'Nickname Title (m15)', 'Title (m15)', 'Nickname True Name (m15)']],
		['Red Nickname Title', '/data/images/cardImages/m15/m15NicknameTitleR.png', 74/1500, 85/2100, 1352/1500, 221/2100, ['Full', 'Nickname Title (m15)', 'Title (m15)', 'Nickname True Name (m15)']],
		['Green Nickname Title', '/data/images/cardImages/m15/m15NicknameTitleG.png', 74/1500, 85/2100, 1352/1500, 221/2100, ['Full', 'Nickname Title (m15)', 'Title (m15)', 'Nickname True Name (m15)']],
		['Multicolored Nickname Title', '/data/images/cardImages/m15/m15NicknameTitleM.png', 74/1500, 85/2100, 1352/1500, 221/2100, ['Full', 'Nickname Title (m15)', 'Title (m15)', 'Nickname True Name (m15)']],
		['Artifact Nickname Title', '/data/images/cardImages/m15/m15NicknameTitleA.png', 74/1500, 85/2100, 1352/1500, 221/2100, ['Full', 'Nickname Title (m15)', 'Title (m15)', 'Nickname True Name (m15)']],
		['Land Nickname Title', '/data/images/cardImages/m15/m15NicknameTitleL.png', 74/1500, 85/2100, 1352/1500, 221/2100, ['Full', 'Nickname Title (m15)', 'Title (m15)', 'Nickname True Name (m15)']],
		['White Nickname Legend Crown', '/data/images/cardImages/m15/m15NicknameCrownW.png', 36/1500, 36/2100, 1428/1500, 270/2100, ['Full', 'Nickname Legend Crown (m15)', 'Title (m15)', 'Nickname True Name (m15)']],
		['Blue Nickname Legend Crown', '/data/images/cardImages/m15/m15NicknameCrownU.png', 36/1500, 36/2100, 1428/1500, 270/2100, ['Full', 'Nickname Legend Crown (m15)', 'Title (m15)', 'Nickname True Name (m15)']],
		['Black Nickname Legend Crown', '/data/images/cardImages/m15/m15NicknameCrownB.png', 36/1500, 36/2100, 1428/1500, 270/2100, ['Full', 'Nickname Legend Crown (m15)', 'Title (m15)', 'Nickname True Name (m15)']],
		['Red Nickname Legend Crown', '/data/images/cardImages/m15/m15NicknameCrownR.png', 36/1500, 36/2100, 1428/1500, 270/2100, ['Full', 'Nickname Legend Crown (m15)', 'Title (m15)', 'Nickname True Name (m15)']],
		['Green Nickname Legend Crown', '/data/images/cardImages/m15/m15NicknameCrownG.png', 36/1500, 36/2100, 1428/1500, 270/2100, ['Full', 'Nickname Legend Crown (m15)', 'Title (m15)', 'Nickname True Name (m15)']],
		['Multicolored Nickname Legend Crown', '/data/images/cardImages/m15/m15NicknameCrownM.png', 36/1500, 36/2100, 1428/1500, 270/2100, ['Full', 'Nickname Legend Crown (m15)', 'Title (m15)', 'Nickname True Name (m15)']],
		['Artifact Nickname Legend Crown', '/data/images/cardImages/m15/m15NicknameCrownA.png', 36/1500, 36/2100, 1428/1500, 270/2100, ['Full', 'Nickname Legend Crown (m15)', 'Title (m15)', 'Nickname True Name (m15)']],
		['Land Nickname Legend Crown', '/data/images/cardImages/m15/m15NicknameCrownL.png', 36/1500, 36/2100, 1428/1500, 270/2100, ['Full', 'Nickname Legend Crown (m15)', 'Title (m15)', 'Nickname True Name (m15)']],
		['White Nickname Power/Toughness', '/data/images/cardImages/m15/m15NicknamePTW.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Blue Nickname Power/Toughness', '/data/images/cardImages/m15/m15NicknamePTU.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Black Nickname Power/Toughness', '/data/images/cardImages/m15/m15NicknamePTB.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Red Nickname Power/Toughness', '/data/images/cardImages/m15/m15NicknamePTR.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Green Nickname Power/Toughness', '/data/images/cardImages/m15/m15NicknamePTG.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Multicolored Nickname Power/Toughness', '/data/images/cardImages/m15/m15NicknamePTM.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Artifact Nickname Power/Toughness', '/data/images/cardImages/m15/m15NicknamePTA.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Colorless Nickname Power/Toughness', '/data/images/cardImages/m15/m15NicknamePTC.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Nickname Frame Textboxes', '/data/images/cardImages/m15Promo/m15PromoNicknameTextboxes.png', 0, 0, 1, 1, ['Full', 'Title (m15)', 'Type (m15 Promo)', 'Rules (m15 Promo)']]
	], 'frameClassM15PromoNickname')
}

if (currentVersion != 'm15Promo/nickname') {
	currentVersion = 'm15Promo/nickname'

	loadTextOptions([
	new cardText('Card Nickname', '', 126/1500, 188/2100, 1248/1500, 80/2100, 'belerenb', 80/2100, 'white', ['oneLine=true', 'shadow=3']),
	new cardText('Card Title', '', 210/1500, 276/2100, 1080/1500, 48/2100, 'belerenb', 48/2100, 'white', ['oneLine=true', 'textAlign="center"', 'fontStyle="italic "', 'shadow=3']),
	new cardText('Card Type', '', 126/1500, 1439/2100, 1248/1500, 68/2100, 'belerenb', 68/2100, 'white', ['oneLine=true', 'shadow=3']),
	new cardText('Rules Text', '', 135/1500, 1545/2100, 1230/1500, 450/2100, 'mplantin', 74/2100, 'white', ['shadow=3']),
	new cardText('Power/Toughness', '', 1191/1500, 1954/2100, 205/1500, 78/2100, 'belerenbsc', 78/2100, 'white', ['oneLine=true,textAlign="center"'])
	])
}

hideFrameImages('frameClassM15PromoNickname')
