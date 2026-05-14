if (!loadedVersions.includes('m15Token/holoStamps')) {
	loadedVersions.push("m15Token/holoStamps")
	loadFrameImages([
		['White Holo Stamp', '/data/images/cardImages/m15/holoStamps/m15HoloStampW.png', 654/1500, 1897/2100, 192/1500, 96/2100, ['Full']],
		['Blue Holo Stamp', '/data/images/cardImages/m15/holoStamps/m15HoloStampU.png', 654/1500, 1897/2100, 192/1500, 96/2100, ['Full']],
		['Black Holo Stamp', '/data/images/cardImages/m15/holoStamps/m15HoloStampB.png', 654/1500, 1897/2100, 192/1500, 96/2100, ['Full']],
		['Red Holo Stamp', '/data/images/cardImages/m15/holoStamps/m15HoloStampR.png', 654/1500, 1897/2100, 192/1500, 96/2100, ['Full']],
		['Green Holo Stamp', '/data/images/cardImages/m15/holoStamps/m15HoloStampG.png', 654/1500, 1897/2100, 192/1500, 96/2100, ['Full']],
		['Multicolored Holo Stamp', '/data/images/cardImages/m15/holoStamps/m15HoloStampM.png', 654/1500, 1897/2100, 192/1500, 96/2100, ['Full']],
		['Artifact 1 Holo Stamp', '/data/images/cardImages/m15/holoStamps/m15HoloStampA.png', 654/1500, 1897/2100, 192/1500, 96/2100, ['Full']],
		['Artifact 2 Holo Stamp', '/data/images/cardImages/m15/holoStamps/m15HoloStampA2.png', 654/1500, 1897/2100, 192/1500, 96/2100, ['Full']],
		['Artifact 3 Holo Stamp', '/data/images/cardImages/m15/holoStamps/m15HoloStampA3.png', 654/1500, 1897/2100, 192/1500, 96/2100, ['Full']],
		['Land Holo Stamp', '/data/images/cardImages/m15/holoStamps/m15HoloStampL.png', 654/1500, 1897/2100, 192/1500, 96/2100, ['Full']],
	], 'frameClassM15TokenHoloStamps')
}

hideFrameImages('frameClassM15TokenHoloStamps')