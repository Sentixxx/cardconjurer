import { getImportedCollectorLanguage } from './import-card-basics.mjs';

export function shouldImportCollectorInfo(enableImportCollectorInfo) {
  return enableImportCollectorInfo == 'true';
}

export function buildImportedCollectorFields(cardToImport) {
  return {
    number: cardToImport.collector_number || '',
    rarity: (cardToImport.rarity || '')[0].toUpperCase(),
    setCode: (cardToImport.set || '').toUpperCase(),
    language: getImportedCollectorLanguage(cardToImport.lang),
  };
}

export function formatImportedCollectorNumber(number, printedSize, useNewCollectorStyle) {
  var formattedNumber = number;

  if (useNewCollectorStyle) {
    while (formattedNumber.length < 4) {
      formattedNumber = '0' + formattedNumber;
    }
    return formattedNumber;
  }

  if (!printedSize) {
    return null;
  }

  while (formattedNumber.length < 3) {
    formattedNumber = '0' + formattedNumber;
  }

  var formattedPrintedSize = printedSize;
  while (formattedPrintedSize.length < 3) {
    formattedPrintedSize = '0' + formattedPrintedSize;
  }

  if (parseInt(formattedNumber) <= parseInt(formattedPrintedSize)) {
    return formattedNumber + '/' + formattedPrintedSize;
  }
  return formattedNumber;
}

export function buildImportedCollectorNumberUpdate(number, printedSize, useNewCollectorStyle) {
  const formattedNumber = formatImportedCollectorNumber(number, printedSize, useNewCollectorStyle);
  return {
    number: formattedNumber,
    shouldUpdate: formattedNumber !== null,
  };
}

export function buildImportedCollectorNumberUpdateFromSetResponse(number, setResponseText, useNewCollectorStyle) {
  const setObject = JSON.parse(setResponseText);
  return buildImportedCollectorNumberUpdate(number, setObject.printed_size, useNewCollectorStyle);
}

export function buildImportedSetSymbolFields(cardToImport) {
  return {
    code: cardToImport.set,
    rarity: cardToImport.rarity.slice(0, 1),
  };
}

export function buildImportedSetSymbolImportPlan(cardToImport, isCodeLocked, isUrlLocked) {
  const setSymbolFields = buildImportedSetSymbolFields(cardToImport);
  return {
    code: isCodeLocked ? null : setSymbolFields.code,
    rarity: setSymbolFields.rarity,
    shouldFetch: !isUrlLocked,
  };
}

export function buildImportedSpecialLayoutSetSymbolPlan(cardToImport, isCodeLocked, isUrlLocked) {
  const setSymbolFields = buildImportedSetSymbolFields(cardToImport);
  const shouldImport = !isCodeLocked;
  return {
    code: shouldImport ? setSymbolFields.code : null,
    rarity: shouldImport ? setSymbolFields.rarity : null,
    shouldFetch: shouldImport && !isUrlLocked,
  };
}

export function buildImportedArtFields(cardToImport, datasource) {
  return {
    name: cardToImport.name,
    cropUrl: cardToImport.image_uris?.art_crop,
    fetchName: datasource == "scryfall"
      ? cardToImport.name
      : datasource == "mtgch"
        ? cardToImport.en_name
        : null,
  };
}

export function buildImportedArtImportPlan(cardToImport, datasource, importAllPrints, importIndex) {
  const artFields = buildImportedArtFields(cardToImport, datasource);
  return {
    ...artFields,
    artIndex: importAllPrints ? importIndex : null,
  };
}

export function buildImportedSpecialLayoutMediaPlan(cardToImport) {
  return {
    artist: cardToImport.artist,
    cropUrl: cardToImport.image_uris?.art_crop,
  };
}

export function getImportedPrintIdentity(cardToImport) {
  if (cardToImport.set != "plst") {
    return {
      set: cardToImport.set,
      collector_number: cardToImport.collector_number,
    };
  }

  var components = cardToImport.collector_number.split('-');
  return {
    set: components[0],
    collector_number: components[1],
  };
}
