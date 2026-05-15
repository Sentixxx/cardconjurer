if (!loadedVersions.includes('legends/regular')) {
	loadedVersions.push('legends/regular')
	loadFrameImages([
		['Multicolored Frame', '/data/images/cardImages/legends/legendsFrameM.png', 0, 0, 1, 1, ['Full']],
		['Foil Stamp', '/data/images/cardImages/seventh/seventhFoilStamp.png', 81/744, 867/1039, 300/744, 115/1039, ['Full']]
	], 'frameClassLegendsRegular')
}

hideFrameImages('frameClassLegendsRegular')