if (!loadedVersions.includes('future/regular')) {
	loadedVersions.push('future/regular')
	loadFrameImages([
		['White Frame', '/data/images/cardImages/future/futureFrameW.png', 0, 0, 1, 1, ['Full', 'Border (future)']],
		['Blue Frame', '/data/images/cardImages/future/futureFrameU.png', 0, 0, 1, 1, ['Full', 'Border (future)']],
		['Black Frame', '/data/images/cardImages/future/futureFrameB.png', 0, 0, 1, 1, ['Full', 'Border (future)']],
		['Red Frame', '/data/images/cardImages/future/futureFrameR.png', 0, 0, 1, 1, ['Full', 'Border (future)']],
		['Green Frame', '/data/images/cardImages/future/futureFrameG.png', 0, 0, 1, 1, ['Full', 'Border (future)']],
		['Multicolored Frame', '/data/images/cardImages/future/futureFrameM.png', 0, 0, 1, 1, ['Full', 'Border (future)']],
		['Artifact Frame', '/data/images/cardImages/future/futureFrameA.png', 0, 0, 1, 1, ['Full', 'Border (future)']],
		['Clear Frame', '/data/images/cardImages/future/futureFrameC.png', 0, 0, 1, 1, ['Full', 'Border (future)']],
		['Land Frame', '/data/images/cardImages/future/futureFrameL.png', 0, 0, 1, 1, ['Full', 'Border (future)']],
		['White Power/Toughness', '/data/images/cardImages/future/futurePTW.png', 567/744, 918/1039, 129/744, 81/1039, ['Full']],
		['Blue Power/Toughness', '/data/images/cardImages/future/futurePTU.png', 567/744, 918/1039, 129/744, 81/1039, ['Full']],
		['Black Power/Toughness', '/data/images/cardImages/future/futurePTB.png', 567/744, 918/1039, 129/744, 81/1039, ['Full']],
		['Red Power/Toughness', '/data/images/cardImages/future/futurePTR.png', 567/744, 918/1039, 129/744, 81/1039, ['Full']],
		['Green Power/Toughness', '/data/images/cardImages/future/futurePTG.png', 567/744, 918/1039, 129/744, 81/1039, ['Full']],
		['Multicolored Power/Toughness', '/data/images/cardImages/future/futurePTM.png', 567/744, 918/1039, 129/744, 81/1039, ['Full']],
		['Artifact Power/Toughness', '/data/images/cardImages/future/futurePTA.png', 567/744, 918/1039, 129/744, 81/1039, ['Full']],
		['Clear Power/Toughness', '/data/images/cardImages/future/futurePTC.png', 567/744, 918/1039, 129/744, 81/1039, ['Full']],
		['Land Power/Toughness', '/data/images/cardImages/future/futurePTL.png', 567/744, 918/1039, 129/744, 81/1039, ['Full']],
		['White Icon', '/data/images/cardImages/future/futureWhite.png', 49/744, 49/1039, 32/744, 32/1039, ['Artifact Icon (future)', 'Creature Icon (future)', 'Enchantment Icon (future)', 'Instant Icon (future)', 'Land Icon (future)', 'Multitype Icon (future)', 'Sorcery Icon (future)']],
		['Gray Icon', '/data/images/cardImages/future/futureGray.png', 49/744, 49/1039, 32/744, 32/1039, ['Artifact Icon (future)', 'Creature Icon (future)', 'Enchantment Icon (future)', 'Instant Icon (future)', 'Land Icon (future)', 'Multitype Icon (future)', 'Sorcery Icon (future)']]
	], 'frameClassFutureRegular')
}

hideFrameImages('frameClassFutureRegular')