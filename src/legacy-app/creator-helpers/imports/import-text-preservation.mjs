export function collectTextFieldValues(textFields, fieldNames) {
  var values = {};
  fieldNames.forEach(field => {
    if (textFields[field] && textFields[field].text) {
      values[field] = textFields[field].text;
    }
  });
  return values;
}

export function shouldPreserveImportedReminderText(cardVersion) {
  return cardVersion === 'fuse' || cardVersion === 'room';
}

export function extractImportedReminderText(oracleText) {
  if (!oracleText) {
    return '';
  }

  var reminderMatch = oracleText.match(/\([^)]+\)/);
  return reminderMatch ? reminderMatch[0] : '';
}
