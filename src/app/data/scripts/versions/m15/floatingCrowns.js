if (!loadedVersions.includes('m15/floatingCrowns')) {
	loadedVersions.push("m15/floatingCrowns")
	loadFrameImages([
		['Lower Crown Cutout', '/data/images/cardImages/black.png', 110/1500, 230/2100, 1280/1500, 30/2100, ['Full']],
		['White Floating Legend Crown', '/data/images/cardImages/m15/m15CrownFloatingW.png', 46/1500, 40/2100, 1408/1500, 215/2100, ['Full']],
		['Blue Floating Legend Crown', '/data/images/cardImages/m15/m15CrownFloatingU.png', 46/1500, 40/2100, 1408/1500, 215/2100, ['Full']],
		['Black Floating Legend Crown', '/data/images/cardImages/m15/m15CrownFloatingB.png', 46/1500, 40/2100, 1408/1500, 215/2100, ['Full']],
		['Red Floating Legend Crown', '/data/images/cardImages/m15/m15CrownFloatingR.png', 46/1500, 40/2100, 1408/1500, 215/2100, ['Full']],
		['Green Floating Legend Crown', '/data/images/cardImages/m15/m15CrownFloatingG.png', 46/1500, 40/2100, 1408/1500, 215/2100, ['Full']],
		['Multicolored Floating Legend Crown', '/data/images/cardImages/m15/m15CrownFloatingM.png', 46/1500, 40/2100, 1408/1500, 215/2100, ['Full']],
		['Artifact Floating Legend Crown', '/data/images/cardImages/m15/m15CrownFloatingA.png', 46/1500, 40/2100, 1408/1500, 215/2100, ['Full']],
		['Land Floating Legend Crown', '/data/images/cardImages/m15/m15CrownFloatingL.png', 46/1500, 40/2100, 1408/1500, 215/2100, ['Full']],
		['Upper Crown Border Cover', '/data/images/cardImages/black.png', 59/1500, 58/2100, 1384/1500, 37/2100, ['Full']],
		['Floating Crown Outline', '/data/images/cardImages/m15/m15CrownFloatingOutline.png', 42/1500, 36/2100, 1416/1500, 223/2100, ['Full']]
	], 'frameClassM15FloatingCrowns')
}

hideFrameImages('frameClassM15FloatingCrowns')