export function getImportedUniqueLayouts() {
  return ['leveler', 'prototype', 'mutate', 'vanguard'];
}

export function isImportedUniqueLayout(layout, cardVersion) {
  const uniqueLayouts = getImportedUniqueLayouts();
  return uniqueLayouts.includes(layout) && uniqueLayouts.includes(cardVersion);
}
