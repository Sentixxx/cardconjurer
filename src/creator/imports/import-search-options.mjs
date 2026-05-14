export function buildImportSearchOptions(importAllPrints, datasource, cardName) {
  return {
    cardName,
    datasource,
    unique: importAllPrints ? 'prints' : ''
  };
}

export function getImportedCardFetchUnique(importOptions) {
  return importOptions.datasource === "local" ? true : importOptions.unique;
}
