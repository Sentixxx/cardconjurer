export function getImportedCardOptionName(card) {
  var name = card.printed_name || card.name;
  if (card.flavor_name) {
    name += " (" + card.flavor_name +")";
  } else if (card.printed_name) {
    name += " (" + card.name + ")";
  }
  return name;
}

export function shouldRenderImportedCardOption(cardToImport) {
  return cardToImport.type_line && cardToImport.type_line != 'Card';
}
