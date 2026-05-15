export function normalizeScryfallClipboardLines(text) {
  return text.trim().split("\n").map(item => item.trim()).filter(item => item != "");
}

export function parseScryfallClipboardNameLine(nameLine) {
  var name = nameLine;
  var manaCostStartIndex = nameLine.indexOf("{");
  if (manaCostStartIndex > 0) {
    return {
      name: nameLine.substring(0, manaCostStartIndex).trim(),
      manaCost: nameLine.substring(manaCostStartIndex).trim()
    };
  }
  return {name};
}

export function buildScryfallClipboardBaseCard(nameParts) {
  var cardObject = {
    "name": nameParts.name,
    "lang": "en"
  };

  if (nameParts.manaCost !== undefined) {
    cardObject.mana_cost = nameParts.manaCost;
  }
  return cardObject;
}

export function parseScryfallClipboardPt(line) {
  var regex = /[0-9+\-*]+\/[0-9+*]+/;
  var match = line.match(regex);
  if (!match) {
    return null;
  }
  var pt = match[0].split("/");
  return {
    power: pt[0],
    toughness: pt[1]
  };
}

export function applyScryfallClipboardPt(cardObject, lines) {
  var parsedPt = parseScryfallClipboardPt(lines[lines.length-1]);
  if (parsedPt) {
    cardObject.power = parsedPt.power;
    cardObject.toughness = parsedPt.toughness;
    lines.pop();
    return true;
  }
  return false;
}

export function scryfallCardFromText(text) {
  var lines = normalizeScryfallClipboardLines(text);

  if (lines.length == 0) {
    return {};
  }

  var cardObject = buildScryfallClipboardBaseCard(parseScryfallClipboardNameLine(lines.shift()));

  if (lines.length == 0) {
    return cardObject;
  }

  cardObject.type_line = lines.shift().trim();

  if (lines.length == 0) {
    return cardObject;
  }

  applyScryfallClipboardPt(cardObject, lines);

  if (lines.length == 0) {
    return cardObject;
  }

  cardObject.oracle_text = lines.join("\n");

  return cardObject;
}
