export function normalizeWriteTextConditionalToken(token) {
  return token.replace(/_/g, ' ').toLowerCase();
}

export function parseWriteTextConditionalColorParts(conditionalColor) {
  const codeParams = conditionalColor.split(':');
  if (codeParams[0].includes('conditionalcolor')) {
    return {
      tagParts: codeParams[1].split(','),
      colorToApply: codeParams[2],
    };
  }
  return {
    tagParts: codeParams[0].split(','),
    colorToApply: codeParams[1],
  };
}

export function parseWriteTextConditionalFrameRule(part) {
  const [rawFrameName, ...maskRuleParts] = part.split('*');
  const positiveMasks = [];
  const negativeMasks = [];

  maskRuleParts.forEach((rule) => {
    if (!rule) {
      return;
    }
    if (rule.startsWith('!')) {
      negativeMasks.push(normalizeWriteTextConditionalToken(rule.substring(1)));
    } else {
      positiveMasks.push(normalizeWriteTextConditionalToken(rule));
    }
  });

  return {
    frameName: normalizeWriteTextConditionalToken(rawFrameName),
    positiveMasks,
    negativeMasks,
  };
}

export function matchesWriteTextConditionalFrameRule(frame, frameRule) {
  if (!frame.name.toLowerCase().includes(frameRule.frameName)) {
    return false;
  }
  const masks = frame.masks || [];
  if (masks.length === 0) {
    return true;
  }
  const maskNames = masks.map((mask) => mask.name.toLowerCase());
  const passesPositive = frameRule.positiveMasks.length === 0 || frameRule.positiveMasks.every((pos) =>
    maskNames.some((mask) => mask.includes(pos))
  );
  const passesNegative = frameRule.negativeMasks.length === 0 || frameRule.negativeMasks.every((neg) =>
    !maskNames.some((mask) => mask.includes(neg))
  );
  return passesPositive && passesNegative;
}

export function resolveWriteTextConditionalColor(textColor, conditionalColor, frames) {
  const conditionalParts = parseWriteTextConditionalColorParts(conditionalColor);
  conditionalParts.tagParts.forEach((part) => {
    const frameRule = parseWriteTextConditionalFrameRule(part);
    if (frames.some((frame) => matchesWriteTextConditionalFrameRule(frame, frameRule))) {
      textColor = conditionalParts.colorToApply;
    }
  });
  return textColor;
}
