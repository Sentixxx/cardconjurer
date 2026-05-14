if (!loadedVersions.includes('ixalan/regular')) {
	loadedVersions.push('ixalan/regular')
	loadFrameImages([
		['White Frame', '/data/images/cardImages/ixalan/ixalanFrameW.png', 0, 0, 1, 1, ['Full']],
		['Blue Frame', '/data/images/cardImages/ixalan/ixalanFrameU.png', 0, 0, 1, 1, ['Full']],
		['Black Frame', '/data/images/cardImages/ixalan/ixalanFrameB.png', 0, 0, 1, 1, ['Full']],
		['Red Frame', '/data/images/cardImages/ixalan/ixalanFrameR.png', 0, 0, 1, 1, ['Full']],
		['Green Frame', '/data/images/cardImages/ixalan/ixalanFrameG.png', 0, 0, 1, 1, ['Full']],
		['Multicolored Frame', '/data/images/cardImages/ixalan/ixalanFrameM.png', 0, 0, 1, 1, ['Full']],
		['Land Frame', '/data/images/cardImages/ixalan/ixalanFrameL.png', 0, 0, 1, 1, ['Full']],
		['Artifact Icon', '/data/images/cardImages/ixalan/ixalanIconArtifact.png', 90/1500, 105/2100, 100/1500, 101/2100, ['Full']],
		['Creature Icon', '/data/images/cardImages/ixalan/ixalanIconCreature.png', 90/1500, 105/2100, 100/1500, 101/2100, ['Full']],
		['Enchantment Icon', '/data/images/cardImages/ixalan/ixalanIconEnchantment.png', 90/1500, 105/2100, 100/1500, 101/2100, ['Full']],
		['Instant Icon', '/data/images/cardImages/ixalan/ixalanIconInstant.png', 90/1500, 105/2100, 100/1500, 101/2100, ['Full']],
		['Multitype Icon', '/data/images/cardImages/ixalan/ixalanIconMulti.png', 90/1500, 105/2100, 100/1500, 101/2100, ['Full']],
		['Sorcery Icon', '/data/images/cardImages/ixalan/ixalanIconSorcery.png', 90/1500, 105/2100, 100/1500, 101/2100, ['Full']],
		['White Border', '/data/images/cardImages/white.png', 0, 0, 1, 1, ['Alternative Border', 'Alternative Border (Crown)', 'Border (m15)']],
		['Silver Border', '/data/images/cardImages/silver.png', 0, 0, 1, 1, ['Alternative Border', 'Alternative Border (Crown)', 'Border (m15)']],
		['Gold Border', '/data/images/cardImages/gold.png', 0, 0, 1, 1, ['Alternative Border', 'Alternative Border (Crown)', 'Border (m15)']]
	], 'frameClassIxalanRegular')
}

hideFrameImages('frameClassIxalanRegular')