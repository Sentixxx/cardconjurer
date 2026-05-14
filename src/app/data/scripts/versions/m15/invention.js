if (!loadedVersions.includes('m15/invention')) {
	loadedVersions.push("m15/invention")
	loadFrameImages([
		['Invention Frame', '/data/images/cardImages/m15/invention/m15InventionFrameA.png', 0, 0, 1, 1, ['Full', 'Pinline Super (m15)', 'Title (m15)', 'Type (m15)', 'Rules (m15)', 'Frame (m15)', 'Border (m15)']],
		['Invention Power/Toughness', '/data/images/cardImages/m15/invention/inventionPT.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']]
	], 'frameClassM15Invention')
}

if (currentVersion != 'm15/invention') {
	currentVersion = 'm15/invention'

	artX = scaleX(60 / 1500)
	artY = scaleY(60 / 2100)
	artWidth = scaleX(1380 / 1500)
	artHeight = scaleY(1878 / 2100)

	if (skipResizeCardArt > 0) {
		skipResizeCardArt -= 1
	}
	if (skipLoadTextList > 0) {
		skipLoadTextList -= 1
	}
}

hideFrameImages('frameClassM15Invention')