if (!loadedVersions.includes('bleedEdge/regular')) {
	loadedVersions.push('bleedEdge/regular')
	loadFrameImages([
		['Black Border Extension', '/data/images/cardImages/bleedEdge/blackBorderExtension.png', -11/250, -1/35, 136/125, 37/35, ['Full']],
		['Box Topper Border Extension', '/data/images/cardImages/bleedEdge/boxTopperBorderExtension.png', -11/250, -1/35, 136/125, 37/35, ['Full']],
		['Borderless Border Extension', '/data/images/cardImages/bleedEdge/borderlessBorderExtension.png', -11/250, -1/35, 136/125, 37/35, ['Full']],
	], 'frameClassBleedEdgeRegular')
}

hideFrameImages('frameClassBleedEdgeRegular')