if (!loadedVersions.includes('m15Saga/regular')) {
	loadedVersions.push('m15Saga/regular')
	loadFrameImages([
        ['White Frame', '/data/images/cardImages/saga/sagaFrameW.png', 0, 0, 1, 1, ['Full','Pinline (saga)', 'Frame (saga)', 'Banner (saga)', 'Title (m15)', 'Type (saga)', 'Rules Text (saga)', 'Border (saga)']],
        ['Blue Frame', '/data/images/cardImages/saga/sagaFrameU.png', 0, 0, 1, 1, ['Full','Pinline (saga)', 'Frame (saga)', 'Banner (saga)', 'Title (m15)', 'Type (saga)', 'Rules Text (saga)', 'Border (saga)']],
        ['Black Frame', '/data/images/cardImages/saga/sagaFrameB.png', 0, 0, 1, 1, ['Full','Pinline (saga)', 'Frame (saga)', 'Banner (saga)', 'Title (m15)', 'Type (saga)', 'Rules Text (saga)', 'Border (saga)']],
        ['Red Frame', '/data/images/cardImages/saga/sagaFrameR.png', 0, 0, 1, 1, ['Full','Pinline (saga)', 'Frame (saga)', 'Banner (saga)', 'Title (m15)', 'Type (saga)', 'Rules Text (saga)', 'Border (saga)']],
        ['Green Frame', '/data/images/cardImages/saga/sagaFrameG.png', 0, 0, 1, 1, ['Full','Pinline (saga)', 'Frame (saga)', 'Banner (saga)', 'Title (m15)', 'Type (saga)', 'Rules Text (saga)', 'Border (saga)']],
        ['Multicolored Frame', '/data/images/cardImages/saga/sagaFrameM.png', 0, 0, 1, 1, ['Full','Pinline (saga)', 'Frame (saga)', 'Banner (saga)', 'Title (m15)', 'Type (saga)', 'Rules Text (saga)', 'Border (saga)']],
        ['White Border', '/data/images/cardImages/white.png', 0, 0, 1, 1, ['Alternative Border', 'Border (saga)']],
        ['Silver Border', '/data/images/cardImages/silver.png', 0, 0, 1, 1, ['Alternative Border', 'Border (saga)']],
        ['Gold Border', '/data/images/cardImages/gold.png', 0, 0, 1, 1, ['Alternative Border', 'Border (saga)']]
    ], 'frameClassSagaRegular')
}

hideFrameImages('frameClassSagaRegular')