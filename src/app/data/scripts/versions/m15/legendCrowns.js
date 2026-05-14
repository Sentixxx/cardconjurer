if (!loadedVersions.includes('m15/legendCrowns')) {
	loadedVersions.push("m15/legendCrowns")
	loadFrameImages([
		['White Legend Crown', '/data/images/cardImages/m15/m15CrownW.png', 41/1500, 40/2100, 1418/1500, 350/2100, ['Full', 'Legend Crown (m15)', 'Legend Crown W/ Pinline (m15)']],
		['Blue Legend Crown', '/data/images/cardImages/m15/m15CrownU.png', 41/1500, 40/2100, 1418/1500, 350/2100, ['Full', 'Legend Crown (m15)', 'Legend Crown W/ Pinline (m15)']],
		['Black Legend Crown', '/data/images/cardImages/m15/m15CrownB.png', 41/1500, 40/2100, 1418/1500, 350/2100, ['Full', 'Legend Crown (m15)', 'Legend Crown W/ Pinline (m15)']],
		['Red Legend Crown', '/data/images/cardImages/m15/m15CrownR.png', 41/1500, 40/2100, 1418/1500, 350/2100, ['Full', 'Legend Crown (m15)', 'Legend Crown W/ Pinline (m15)']],
		['Green Legend Crown', '/data/images/cardImages/m15/m15CrownG.png', 41/1500, 40/2100, 1418/1500, 350/2100, ['Full', 'Legend Crown (m15)', 'Legend Crown W/ Pinline (m15)']],
		['Multicolored Legend Crown', '/data/images/cardImages/m15/m15CrownM.png', 41/1500, 40/2100, 1418/1500, 350/2100, ['Full', 'Legend Crown (m15)', 'Legend Crown W/ Pinline (m15)']],
		['Artifact Legend Crown', '/data/images/cardImages/m15/m15CrownA.png', 41/1500, 40/2100, 1418/1500, 350/2100, ['Full', 'Legend Crown (m15)', 'Legend Crown W/ Pinline (m15)']],
		['Land Legend Crown', '/data/images/cardImages/m15/m15CrownL.png', 41/1500, 40/2100, 1418/1500, 350/2100, ['Full', 'Legend Crown (m15)', 'Legend Crown W/ Pinline (m15)']],
		['Legend Crown Border Cover', '/data/images/cardImages/black.png', 59/1500, 58/2100, 1382/1500, 37/2100, ['Full']]
	], 'frameClassM15LegendCrowns')
}

hideFrameImages('frameClassM15LegendCrowns')