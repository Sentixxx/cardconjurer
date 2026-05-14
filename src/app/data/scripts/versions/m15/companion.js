if (!loadedVersions.includes('m15/companion')) {
	loadedVersions.push('m15/companion')
	loadFrameImages([
		['White Companion Legend Crown', '/data/images/cardImages/m15/m15InnerCrownWCompanion.png', 246/1500, 50/2100, 1008/1500, 50/2100, ['Full']],
		['Blue Companion Legend Crown', '/data/images/cardImages/m15/m15InnerCrownUCompanion.png', 246/1500, 50/2100, 1008/1500, 50/2100, ['Full']],
		['Black Companion Legend Crown', '/data/images/cardImages/m15/m15InnerCrownBCompanion.png', 246/1500, 50/2100, 1008/1500, 50/2100, ['Full']],
		['Red Companion Legend Crown', '/data/images/cardImages/m15/m15InnerCrownRCompanion.png', 246/1500, 50/2100, 1008/1500, 50/2100, ['Full']],
		['Green Companion Legend Crown', '/data/images/cardImages/m15/m15InnerCrownGCompanion.png', 246/1500, 50/2100, 1008/1500, 50/2100, ['Full']],
		['Multicolored Companion Legend Crown', '/data/images/cardImages/m15/m15InnerCrownMCompanion.png', 246/1500, 50/2100, 1008/1500, 50/2100, ['Full']],
		['Artifact Companion Legend Crown', '/data/images/cardImages/m15/m15InnerCrownACompanion.png', 246/1500, 50/2100, 1008/1500, 50/2100, ['Full']]
	], 'frameClassM15Companion')
}

hideFrameImages('frameClassM15Companion')