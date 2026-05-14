if (!loadedVersions.includes('short/regular')) {
	loadedVersions.push('short/regular')
	loadMaskImages([['Flipside (short modal)', '/data/images/cardImages/short/modal/shortModalMaskReminder.png'], ['Border (short modal)', '/data/images/cardImages/short/modal/shortModalMaskBorder.png'], ['Pinline (short modal)', '/data/images/cardImages/short/modal/shortModalMaskPinline.png'], ['Title (short modal)', '/data/images/cardImages/short/modal/shortModalMaskTitle.png'], ['Rules (short modal)', '/data/images/cardImages/short/modal/shortModalMaskText.png']])
	loadFrameImages([
		['White Frame (Front)', '/data/images/cardImages/short/modal/shortModalFrameWF.png', 0, 0, 1, 1, ['Full', 'Flipside (short modal)', 'Pinline (short modal)', 'Title (short modal)', 'Type (short)', 'Rules (short modal)', 'Border (short modal)']],
		['Blue Frame (Front)', '/data/images/cardImages/short/modal/shortModalFrameUF.png', 0, 0, 1, 1, ['Full', 'Flipside (short modal)', 'Pinline (short modal)', 'Title (short modal)', 'Type (short)', 'Rules (short modal)', 'Border (short modal)']],
		['Black Frame (Front)', '/data/images/cardImages/short/modal/shortModalFrameBF.png', 0, 0, 1, 1, ['Full', 'Flipside (short modal)', 'Pinline (short modal)', 'Title (short modal)', 'Type (short)', 'Rules (short modal)', 'Border (short modal)']],
		['Red Frame (Front)', '/data/images/cardImages/short/modal/shortModalFrameRF.png', 0, 0, 1, 1, ['Full', 'Flipside (short modal)', 'Pinline (short modal)', 'Title (short modal)', 'Type (short)', 'Rules (short modal)', 'Border (short modal)']],
		['Green Frame (Front)', '/data/images/cardImages/short/modal/shortModalFrameGF.png', 0, 0, 1, 1, ['Full', 'Flipside (short modal)', 'Pinline (short modal)', 'Title (short modal)', 'Type (short)', 'Rules (short modal)', 'Border (short modal)']],
		['White Frame (Back)', '/data/images/cardImages/short/modal/shortModalFrameWB.png', 0, 0, 1, 1, ['Full', 'Flipside (short modal)', 'Pinline (short modal)', 'Title (short modal)', 'Type (short)', 'Rules (short modal)', 'Border (short modal)']],
		['Blue Frame (Back)', '/data/images/cardImages/short/modal/shortModalFrameUB.png', 0, 0, 1, 1, ['Full', 'Flipside (short modal)', 'Pinline (short modal)', 'Title (short modal)', 'Type (short)', 'Rules (short modal)', 'Border (short modal)']],
		['Black Frame (Back)', '/data/images/cardImages/short/modal/shortModalFrameBB.png', 0, 0, 1, 1, ['Full', 'Flipside (short modal)', 'Pinline (short modal)', 'Title (short modal)', 'Type (short)', 'Rules (short modal)', 'Border (short modal)']],
		['Red Frame (Back)', '/data/images/cardImages/short/modal/shortModalFrameRB.png', 0, 0, 1, 1, ['Full', 'Flipside (short modal)', 'Pinline (short modal)', 'Title (short modal)', 'Type (short)', 'Rules (short modal)', 'Border (short modal)']],
		['Green Frame (Back)', '/data/images/cardImages/short/modal/shortModalFrameGB.png', 0, 0, 1, 1, ['Full', 'Flipside (short modal)', 'Pinline (short modal)', 'Title (short modal)', 'Type (short)', 'Rules (short modal)', 'Border (short modal)']],
		['White Power/Toughness', '/data/images/cardImages/m15/m15PTW.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Blue Power/Toughness', '/data/images/cardImages/m15/m15PTU.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Black Power/Toughness', '/data/images/cardImages/m15/m15PTB.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Red Power/Toughness', '/data/images/cardImages/m15/m15PTR.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Green Power/Toughness', '/data/images/cardImages/m15/m15PTG.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']]
	], 'frameClassShortRegular')
}

hideFrameImages('frameClassShortRegular')