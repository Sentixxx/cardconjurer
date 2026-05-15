import { resolveWriteTextConditionalColor } from './write-text-conditional-color.mjs';

export function getWriteTextInitialColor(textObject, frames) {
  let textColor = textObject.color || 'black';
  if (textObject.conditionalColor != undefined) {
    textColor = resolveWriteTextConditionalColor(textColor, textObject.conditionalColor, frames);
  }
  return textColor;
}

export function getWriteTextShadowSettings(textObject) {
  return {
    color: textObject.shadow || 'black',
    offsetX: scaleWidth(textObject.shadowX) || 0,
    offsetY: scaleHeight(textObject.shadowY) || 0,
    blur: scaleHeight(textObject.shadowBlur) || 0,
  };
}

export function isWriteTextBottomInfoBorderField(textObject) {
  return ['midLeft', 'topLeft', 'note', 'bottomLeft', 'wizards', 'bottomRight', 'rarity'].includes(textObject.name);
}

export function getWriteTextOutlineSettings(textObject, cardObject) {
  let outlineWidth = scaleHeight(textObject.outlineWidth) || 0;
  if ((cardObject.hideBottomInfoBorder || false) && isWriteTextBottomInfoBorderField(textObject)) {
    outlineWidth = 0;
  }
  return {
    width: outlineWidth,
    lineCap: textObject.lineCap || 'round',
    lineJoin: textObject.lineJoin || 'round',
    strokeStyle: textObject.outlineColor || 'black',
  };
}

export function applyWriteTextLineContextBaseStyles(lineContext, styleSettings) {
  lineContext.font = styleSettings.font;
  lineContext.fillStyle = styleSettings.fillStyle;
  lineContext.shadowColor = styleSettings.shadow.color;
  lineContext.shadowOffsetX = styleSettings.shadow.offsetX;
  lineContext.shadowOffsetY = styleSettings.shadow.offsetY;
  lineContext.shadowBlur = styleSettings.shadow.blur;
  lineContext.strokeStyle = styleSettings.outline.strokeStyle;
  lineContext.lineWidth = styleSettings.outline.width;
  lineContext.lineCap = styleSettings.outline.lineCap;
  lineContext.lineJoin = styleSettings.outline.lineJoin;
}

export function resolveWriteTextLineStyleCode(possibleCode, lineStyleState) {
  if (possibleCode.includes('outlinecolor')) {
    return {
      strokeStyle: possibleCode.replace('outlinecolor', ''),
      lineWidth: lineStyleState.lineWidth,
      lineCap: lineStyleState.lineCap,
      lineJoin: lineStyleState.lineJoin,
    };
  }
  if (possibleCode.includes('outline')) {
    return {
      strokeStyle: lineStyleState.strokeStyle,
      lineWidth: parseInt(possibleCode.replace('outline', '')),
      lineCap: lineStyleState.lineCap,
      lineJoin: lineStyleState.lineJoin,
    };
  }
  if (possibleCode.includes('linecap')) {
    return {
      strokeStyle: lineStyleState.strokeStyle,
      lineWidth: lineStyleState.lineWidth,
      lineCap: possibleCode.replace('linecap', '').trim(),
      lineJoin: lineStyleState.lineJoin,
    };
  }
  if (possibleCode.includes('linejoin')) {
    return {
      strokeStyle: lineStyleState.strokeStyle,
      lineWidth: lineStyleState.lineWidth,
      lineCap: lineStyleState.lineCap,
      lineJoin: possibleCode.replace('linejoin', '').trim(),
    };
  }
  return null;
}

export function applyWriteTextLineStyleState(lineContext, lineStyleState) {
  lineContext.strokeStyle = lineStyleState.strokeStyle;
  lineContext.lineWidth = lineStyleState.lineWidth;
  lineContext.lineCap = lineStyleState.lineCap;
  lineContext.lineJoin = lineStyleState.lineJoin;
}

export function resolveWriteTextShadowCode(possibleCode, shadowState) {
  if (!possibleCode.includes('shadow')) {
    return null;
  }
  const nextShadowState = {
    color: shadowState.color,
    offsetX: shadowState.offsetX,
    offsetY: shadowState.offsetY,
    blur: shadowState.blur,
  };
  if (possibleCode.includes('color')) {
    nextShadowState.color = possibleCode.replace('shadowcolor', '');
  } else if (possibleCode.includes('blur')) {
    nextShadowState.blur = parseInt(possibleCode.replace('shadowblur', '')) || 0;
  } else if (possibleCode.includes('shadowx')) {
    nextShadowState.offsetX = parseInt(possibleCode.replace('shadowx', '')) || 0;
  } else if (possibleCode.includes('shadowy')) {
    nextShadowState.offsetY = parseInt(possibleCode.replace('shadowy', '')) || 0;
  } else {
    const shadowOffset = parseInt(possibleCode.replace('shadow', '')) || 0;
    nextShadowState.offsetX = shadowOffset;
    nextShadowState.offsetY = shadowOffset;
  }
  return nextShadowState;
}

export function applyWriteTextShadowState(lineContext, shadowState) {
  lineContext.shadowColor = shadowState.color;
  lineContext.shadowOffsetX = shadowState.offsetX;
  lineContext.shadowOffsetY = shadowState.offsetY;
  lineContext.shadowBlur = shadowState.blur;
}

export function resolveWriteTextColorCode(possibleCode, textColor, frames) {
  if (possibleCode.includes('conditionalcolor')) {
    return resolveWriteTextConditionalColor(textColor, possibleCode, frames);
  }
  if (possibleCode.includes('fontcolor')) {
    return possibleCode.replace('fontcolor', '');
  }
  return null;
}

export function applyWriteTextFillColor(lineContext, textColor) {
  lineContext.fillStyle = textColor;
}

export function resolveWriteTextSizeCode(possibleCode, textSize) {
  if (!possibleCode.includes('fontsize')) {
    return null;
  }
  if (possibleCode.slice(-2) === 'pt') {
    return (parseInt(possibleCode.replace('fontsize', '').replace('pt', '')) * 600 / 72) || 0;
  }
  return textSize + (parseInt(possibleCode.replace('fontsize', '')) || 0);
}
