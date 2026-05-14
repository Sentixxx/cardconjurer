export function shouldApplyImportedStationLayout(cardToImport, cardObject) {
  return cardToImport.oracle_text && cardToImport.oracle_text.includes('Station') && cardObject.version.includes('station');
}
