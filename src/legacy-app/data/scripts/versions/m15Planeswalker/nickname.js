if (!loadedVersions.includes('m15Planeswalker/nickname')) {
	loadedVersions.push('m15Planeswalker/nickname')
	loadFrameImages([
        ['White Frame', '/data/images/cardImages/planeswalker/nickname/planeswalkerNicknameFrameW.png', 0, 0, 1, 1, ['Full', 'Pinline (planeswalker)', 'Title (planeswalker)', 'Type (planeswalker)', 'Border (planeswalker)']],
        ['Blue Frame', '/data/images/cardImages/planeswalker/nickname/planeswalkerNicknameFrameU.png', 0, 0, 1, 1, ['Full', 'Pinline (planeswalker)', 'Title (planeswalker)', 'Type (planeswalker)', 'Border (planeswalker)']],
        ['Black Frame', '/data/images/cardImages/planeswalker/nickname/planeswalkerNicknameFrameB.png', 0, 0, 1, 1, ['Full', 'Pinline (planeswalker)', 'Title (planeswalker)', 'Type (planeswalker)', 'Border (planeswalker)']],
        ['Red Frame', '/data/images/cardImages/planeswalker/nickname/planeswalkerNicknameFrameR.png', 0, 0, 1, 1, ['Full', 'Pinline (planeswalker)', 'Title (planeswalker)', 'Type (planeswalker)', 'Border (planeswalker)']],
        ['Green Frame', '/data/images/cardImages/planeswalker/nickname/planeswalkerNicknameFrameG.png', 0, 0, 1, 1, ['Full', 'Pinline (planeswalker)', 'Title (planeswalker)', 'Type (planeswalker)', 'Border (planeswalker)']],
        ['Multicolored Frame', '/data/images/cardImages/planeswalker/nickname/planeswalkerNicknameFrameM.png', 0, 0, 1, 1, ['Full', 'Pinline (planeswalker)', 'Title (planeswalker)', 'Type (planeswalker)', 'Border (planeswalker)']],
        ['Artifact Frame', '/data/images/cardImages/planeswalker/nickname/planeswalkerNicknameFrameA.png', 0, 0, 1, 1, ['Full', 'Pinline (planeswalker)', 'Title (planeswalker)', 'Type (planeswalker)', 'Border (planeswalker)']],
        ['Land Frame', '/data/images/cardImages/planeswalker/nickname/planeswalkerNicknameFrameL.png', 0, 0, 1, 1, ['Full', 'Pinline (planeswalker)', 'Title (planeswalker)', 'Type (planeswalker)', 'Border (planeswalker)']],
        ['White Border', '/data/images/cardImages/white.png', 0, 0, 1, 1, ['Alternative Border', 'Border (planeswalker)']],
        ['Silver Border', '/data/images/cardImages/silver.png', 0, 0, 1, 1, ['Alternative Border', 'Border (planeswalker)']],
        ['Gold Border', '/data/images/cardImages/gold.png', 0, 0, 1, 1, ['Alternative Border', 'Border (planeswalker)']]
    ], 'frameClassPlaneswalkerNickname')
}

if (currentVersion != 'm15Planeswalker/nickname') {
    currentVersion = 'm15Planeswalker/nickname'

    artX = 0
    artY = 0
    artWidth = 1
    artHeight = scaleY(1921 / 2100)

    loadTextOptions([
    new cardText('Card Nickname', '', 130/1500, 157/2100, 1248/1500, 80/2100, 'belerenb', 80/2100, 'white', ['oneLine=true', 'shadow=3']),
    new cardText('Card Title', '', 210/1500, 252/2100, 1080/1500, 48/2100, 'belerenb', 48/2100, 'white', ['oneLine=true', 'textAlign="center"', 'fontStyle="italic "', 'shadow=3']),
    new cardText('Card Type', '', 130/1500, 1258/2100, 1248/1500, 68/2100, 'belerenb', 68/2100, 'white', ['oneLine=true', 'shadow=3']),
    new cardText('Ability 1', '', 270/1500, 1153/2100, 1120/1500, 624/2100, 'mplantin', 74/2100, 'white', ['shadow=3']),
    new cardText('Ability 2', '', 270/1500, 1153/2100, 1120/1500, 624/2100, 'mplantin', 74/2100, 'white', ['shadow=3']),
    new cardText('Ability 3', '', 270/1500, 1153/2100, 1120/1500, 624/2100, 'mplantin', 74/2100, 'white', ['shadow=3']),
    new cardText('Ability 4', '', 270/1500, 1153/2100, 1120/1500, 624/2100, 'mplantin', 74/2100, 'white', ['shadow=3']),
    new cardText('Loyalty', '', 1209/1500, 1954/2100, 210/1500, 78/2100, 'belerenbsc', 78/2100, 'white', ['oneLine=true,textAlign="center"', 'shadow=3'])
    ])

    document.getElementById('inputColorInvert').checked = true
    invertPlaneswalkerColors()
}

planeswalkerTextBoxX = scaleX(179/1500), planeswalkerTextBoxWidth = scaleX(1205/1500), planeswalkerTextBoxY = scaleY(1314/2100), planeswalkerTextBoxHeight = scaleY(607/2100)

hideFrameImages('frameClassPlaneswalkerNickname')