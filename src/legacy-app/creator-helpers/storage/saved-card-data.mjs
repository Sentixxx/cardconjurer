export function getCreatorStorageCard(globalObject = globalThis) {
  return globalObject.card;
}

export function cloneCardForStorage(cardToClone = getCreatorStorageCard()) {
  const cardToSave = JSON.parse(JSON.stringify(cardToClone));
  cardToSave.frames.forEach((frame) => {
    delete frame.image;
    frame.masks.forEach((mask) => delete mask.image);
  });
  return cardToSave;
}

export function createSavedCardsExportText(savedCards) {
  return JSON.stringify(savedCards);
}

export function parseSavedCardsImport(savedCardsText) {
  return JSON.parse(savedCardsText);
}

export function getVersionedSavedCardKey(cardKey, cardKeys) {
  let resolvedCardKey = cardKey;
  let cardKeyNumber = 1;
  while (cardKeys.includes(resolvedCardKey)) {
    resolvedCardKey = `${cardKey} (${cardKeyNumber})`;
    cardKeyNumber += 1;
  }
  return resolvedCardKey;
}

export function addSavedCardKey(cardKey, cardKeys) {
  if (!cardKeys.includes(cardKey)) {
    cardKeys.push(cardKey);
    cardKeys.sort();
    return true;
  }
  return false;
}
