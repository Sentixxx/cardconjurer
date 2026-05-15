export function buildImportedCollectorSetUrl(setCode) {
  return 'https://api.scryfall.com/sets/' + setCode;
}

export function buildScryfallCardUrl(setCode, collectorNumber) {
  if (!setCode || !collectorNumber) return null;
  const safeSetCode = encodeURIComponent(setCode.toLowerCase());
  const safeCollectorNumber = encodeURIComponent(collectorNumber);
  return `https://api.scryfall.com/cards/${safeSetCode}/${safeCollectorNumber}`;
}

export function buildMtgchCardDetailUrl(cardId) {
  if (!cardId) return null;
  const safeCardId = encodeURIComponent(cardId);
  return `https://mtgch.com/api/v1/card/${safeCardId}/`;
}

export function buildMtgchVersionsUrl(cardId) {
  if (!cardId) return null;
  const safeCardId = encodeURIComponent(cardId);
  return `https://mtgch.com/api/v1/versions/${safeCardId}/`;
}

export function buildMtgchSearchUrl(cardName, isUnique) {
  const params = new URLSearchParams({
    q: cardName,
    page: '1',
    order: '-released_at',
    priority_chinese: 'true',
    view: '0',
  });
  if (!isUnique) {
    params.set('unique', 'oracle_id');
  }
  params.set('unique', 'oracle_id');
  return `https://mtgch.com/api/v1/result?${params.toString()}`;
}

export function getScryfallUniqueSearchParam(unique) {
  return unique ? '&unique=' + unique : '';
}

export function buildScryfallSearchUrl(cardName, selectedLanguage, unique = '') {
  const searchQuery = encodeURIComponent(`name="${cardName}" lang:${selectedLanguage}`);
  return `https://api.scryfall.com/cards/search?order=released&include_extras=true${getScryfallUniqueSearchParam(unique)}&q=${searchQuery}`;
}
