if (!loadedVersions.includes('m15Planeswalker/regular')) {
	loadedVersions.push('m15Planeswalker/regular')
	loadFrameImages([
        ['White Frame', '/data/images/cardImages/planeswalker/planeswalkerFrameW.png', 0, 0, 1, 1, ['Full', 'Pinline (planeswalker)', 'Title (planeswalker)', 'Type (planeswalker)', 'Frame (planeswalker)', 'Border (planeswalker)']],
        ['Blue Frame', '/data/images/cardImages/planeswalker/planeswalkerFrameU.png', 0, 0, 1, 1, ['Full', 'Pinline (planeswalker)', 'Title (planeswalker)', 'Type (planeswalker)', 'Frame (planeswalker)', 'Border (planeswalker)']],
        ['Black Frame', '/data/images/cardImages/planeswalker/planeswalkerFrameB.png', 0, 0, 1, 1, ['Full', 'Pinline (planeswalker)', 'Title (planeswalker)', 'Type (planeswalker)', 'Frame (planeswalker)', 'Border (planeswalker)']],
        ['Red Frame', '/data/images/cardImages/planeswalker/planeswalkerFrameR.png', 0, 0, 1, 1, ['Full', 'Pinline (planeswalker)', 'Title (planeswalker)', 'Type (planeswalker)', 'Frame (planeswalker)', 'Border (planeswalker)']],
        ['Green Frame', '/data/images/cardImages/planeswalker/planeswalkerFrameG.png', 0, 0, 1, 1, ['Full', 'Pinline (planeswalker)', 'Title (planeswalker)', 'Type (planeswalker)', 'Frame (planeswalker)', 'Border (planeswalker)']],
        ['Multicolored Frame', '/data/images/cardImages/planeswalker/planeswalkerFrameM.png', 0, 0, 1, 1, ['Full', 'Pinline (planeswalker)', 'Title (planeswalker)', 'Type (planeswalker)', 'Frame (planeswalker)', 'Border (planeswalker)']],
        ['Artifact Frame', '/data/images/cardImages/planeswalker/planeswalkerFrameA.png', 0, 0, 1, 1, ['Full', 'Pinline (planeswalker)', 'Title (planeswalker)', 'Type (planeswalker)', 'Frame (planeswalker)', 'Border (planeswalker)']],
        ['White Border', '/data/images/cardImages/white.png', 0, 0, 1, 1, ['Alternative Border', 'Border (planeswalker)']],
        ['Silver Border', '/data/images/cardImages/silver.png', 0, 0, 1, 1, ['Alternative Border', 'Border (planeswalker)']],
        ['Gold Border', '/data/images/cardImages/gold.png', 0, 0, 1, 1, ['Alternative Border', 'Border (planeswalker)']]
    ], 'frameClassPlaneswalkerRegular')
}

planeswalkerTextBoxX = scaleX(179/1500), planeswalkerTextBoxWidth = scaleX(1205/1500), planeswalkerTextBoxY = scaleY(1314/2100), planeswalkerTextBoxHeight = scaleY(607/2100)

hideFrameImages('frameClassPlaneswalkerRegular')