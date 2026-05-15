if (!loadedVersions.includes('m15/commanderLegends')) {
	loadedVersions.push("m15/commanderLegends")
	loadMaskImages([['Commander Legends Frame (m15)', '/data/images/cardImages/m15/commanderLegends/m15CommanderLegendsMaskFrame.png'], ['Commander Legends Title (m15)', '/data/images/cardImages/m15/commanderLegends/m15CommanderLegendsMaskTitle.png'], ['Commander Legends Type (m15)', '/data/images/cardImages/m15/commanderLegends/m15CommanderLegendsMaskType.png'], ['Commander Legends Textbox (m15)', '/data/images/cardImages/m15/commanderLegends/m15CommanderLegendsMaskTextbox.png']])
	loadFrameImages([
		['White Frame', '/data/images/cardImages/m15/commanderLegends/m15CommanderLegendsFrameW.png', 0, 0, 1, 1, ['Full', 'Commander Legends Frame (m15)', 'Commander Legends Title (m15)', 'Commander Legends Type (m15)', 'Commander Legends Textbox (m15)']],
		['Blue Frame', '/data/images/cardImages/m15/commanderLegends/m15CommanderLegendsFrameU.png', 0, 0, 1, 1, ['Full', 'Commander Legends Frame (m15)', 'Commander Legends Title (m15)', 'Commander Legends Type (m15)', 'Commander Legends Textbox (m15)']],
		['Black Frame', '/data/images/cardImages/m15/commanderLegends/m15CommanderLegendsFrameB.png', 0, 0, 1, 1, ['Full', 'Commander Legends Frame (m15)', 'Commander Legends Title (m15)', 'Commander Legends Type (m15)', 'Commander Legends Textbox (m15)']],
		['Red Frame', '/data/images/cardImages/m15/commanderLegends/m15CommanderLegendsFrameR.png', 0, 0, 1, 1, ['Full', 'Commander Legends Frame (m15)', 'Commander Legends Title (m15)', 'Commander Legends Type (m15)', 'Commander Legends Textbox (m15)']],
		['Green Frame', '/data/images/cardImages/m15/commanderLegends/m15CommanderLegendsFrameG.png', 0, 0, 1, 1, ['Full', 'Commander Legends Frame (m15)', 'Commander Legends Title (m15)', 'Commander Legends Type (m15)', 'Commander Legends Textbox (m15)']],
		['Multicolored Frame', '/data/images/cardImages/m15/commanderLegends/m15CommanderLegendsFrameM.png', 0, 0, 1, 1, ['Full', 'Commander Legends Frame (m15)', 'Commander Legends Title (m15)', 'Commander Legends Type (m15)', 'Commander Legends Textbox (m15)']],
		['Artifact Frame', '/data/images/cardImages/m15/commanderLegends/m15CommanderLegendsFrameA.png', 0, 0, 1, 1, ['Full', 'Commander Legends Frame (m15)', 'Commander Legends Title (m15)', 'Commander Legends Type (m15)', 'Commander Legends Textbox (m15)']],
		['Land Frame', '/data/images/cardImages/m15/commanderLegends/m15CommanderLegendsFrameL.png', 0, 0, 1, 1, ['Full', 'Commander Legends Frame (m15)', 'Commander Legends Title (m15)', 'Commander Legends Type (m15)', 'Commander Legends Textbox (m15)']],
		['White Power/Toughness', '/data/images/cardImages/m15/commanderLegends/m15CommanderLegendsPTW.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Blue Power/Toughness', '/data/images/cardImages/m15/commanderLegends/m15CommanderLegendsPTU.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Black Power/Toughness', '/data/images/cardImages/m15/commanderLegends/m15CommanderLegendsPTB.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Red Power/Toughness', '/data/images/cardImages/m15/commanderLegends/m15CommanderLegendsPTR.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Green Power/Toughness', '/data/images/cardImages/m15/commanderLegends/m15CommanderLegendsPTG.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Multicolored Power/Toughness', '/data/images/cardImages/m15/commanderLegends/m15CommanderLegendsPTM.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Artifact Power/Toughness', '/data/images/cardImages/m15/commanderLegends/m15CommanderLegendsPTA.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Land Power/Toughness', '/data/images/cardImages/m15/commanderLegends/m15CommanderLegendsPTL.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']]
	], 'frameClassM15CommanderLegends')
}

if (currentVersion != 'm15/commanderLegends') {
	currentVersion = 'm15/commanderLegends'
	
	loadTextOptions([
	new cardText('Card Title', '', 126/1500, 188/2100, 1248/1500, 80/2100, 'belerenb', 80/2100, 'white', ['oneLine=true', 'shadow=3']),
	new cardText('Card Type', '', 126/1500, 1264/2100, 1248/1500, 68/2100, 'belerenb', 68/2100, 'white', ['oneLine=true', 'shadow=3']),
	new cardText('Rules Text', '', 140/1500, 1370/2100, 1220/1500, 625/2100, 'mplantin', 74/2100, 'white', ['shadow=3']),
	new cardText('Power/Toughness', '', 1191/1500, 1954/2100, 205/1500, 78/2100, 'belerenbsc', 78/2100, 'white', ['oneLine=true,textAlign="center"'])
	])

	artX = scaleX(115 / 1500)
	artY = scaleY(237 / 2100)
	artWidth = scaleX(1270 / 1500)
	artHeight = scaleY(929 / 2100)
}

hideFrameImages('frameClassM15CommanderLegends')