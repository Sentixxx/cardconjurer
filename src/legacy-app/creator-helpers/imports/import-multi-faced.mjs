export function isImportedMultiFacedLayout(layout, cardVersion) {
  const importLayouts = ['flip', 'modal_dfc', 'transform', 'split', 'adventure'];
  const frameVersions = ['flip', 'split', 'fuse', 'aftermath', 'adventure', 'omen', 'room', 'battle', 'transform', 'modal'];
  return importLayouts.includes(layout) && frameVersions.some(keyword => cardVersion.toLowerCase().includes(keyword));
}

export function isImportedTransformVersion(cardVersion) {
  return cardVersion.includes('transform') || cardVersion.includes('Transform');
}

export function shouldImportBackType(typeLine) {
  return !typeLine?.toLowerCase().includes('room');
}

export function shouldImportBackPtToFrontPt2(cardVersion) {
  return cardVersion === 'battle' || isImportedTransformVersion(cardVersion);
}

export function shouldUseBackPtAsReminder(cardVersion, backPt) {
  return isImportedTransformVersion(cardVersion) && Boolean(backPt);
}

export function buildImportedFrontStatFields(cardVersion, faceData) {
  if (cardVersion === 'battle') {
    return {defense: faceData.defense || ''};
  }
  return {pt: faceData.pt || ''};
}

export function buildImportedFaceData(face) {
  return {
    name: face.name || '',
    type: face.type_line || '',
    rules: face.oracle_text || '',
    mana: face.mana_cost || '',
    pt: face.power ? `${face.power}/${face.toughness}` : '',
    defense: face.defense || '',
    flavor: face.flavor_text || '',
  };
}

export function formatImportedFaceRules(faceData, textPrefix) {
  var rules = textPrefix + faceData.rules;
  if (faceData.flavor) {
    rules += '{flavor}' + curlyQuotes(faceData.flavor.replace('\n', '{lns}'));
  }
  return rules;
}

export function buildImportedFaceTextFields(faceData, textPrefix) {
  return {
    title: textPrefix + faceData.name,
    type: textPrefix + faceData.type,
    rules: formatImportedFaceRules(faceData, textPrefix),
    mana: faceData.mana || '',
    pt: faceData.pt || '',
  };
}
