export function resolveWriteTextOverflow(wordToWrite, wordWidth, currentX, textWidth, textArcRadius, textOneLine, startingTextSize) {
  if (!(wordToWrite && wordWidth + currentX >= textWidth && textArcRadius == 0)) {
    return null;
  }
  if (textOneLine && startingTextSize > 1) {
    return {
      newLine: false,
      startingTextSize: startingTextSize - 1,
      retryOuterLoop: true,
    };
  }
  return {
    newLine: true,
    startingTextSize,
    retryOuterLoop: false,
  };
}

export function resolveWriteTextHeightOverflow(currentY, textHeight, textBounded, textOneLine, startingTextSize, textArcRadius) {
  if (currentY > textHeight && textBounded && !textOneLine && startingTextSize > 1 && textArcRadius == 0) {
    return {
      startingTextSize: startingTextSize - 1,
      retryOuterLoop: true,
    };
  }
  return null;
}

export function resolveWriteTextLineHorizontalAdjust(textAlign, textWidth, currentX) {
  if (textAlign == 'center') {
    return (textWidth - currentX) / 2;
  }
  if (textAlign == 'right') {
    return textWidth - currentX;
  }
  return 0;
}

export function resolveWriteTextFinalHorizontalAdjust(textJustify, textAlign, textWidth, widestLineWidth) {
  const horizontalAdjustUnit = (textWidth - widestLineWidth) / 2;
  if (textJustify == 'right' && textAlign != 'right') {
    if (textAlign == 'center') {
      return horizontalAdjustUnit;
    }
    return 2 * horizontalAdjustUnit;
  }
  if (textJustify == 'center' && textAlign != 'center') {
    if (textAlign == 'right') {
      return - horizontalAdjustUnit;
    }
    return horizontalAdjustUnit;
  }
  return 0;
}

export function resolveWriteTextVerticalAdjust(noVerticalCenter, textHeight, currentY, textSize) {
  if (noVerticalCenter) {
    return 0;
  }
  return (textHeight - currentY + textSize * 0.15) / 2;
}

export function shouldWriteTextWord(wordToWrite, currentX, startingCurrentX, textManaCost) {
  return Boolean(wordToWrite && (currentX != startingCurrentX || wordToWrite != ' ') && !textManaCost);
}

export function getWriteTextJustifySettings() {
  return {
    maxSpaceSize: 6,
    minSpaceSize: 0,
  };
}

export function measureWriteTextWordAdvance(lineContext, wordToWrite, fillJustify, justifyWidth, justifySettings) {
  if (fillJustify) {
    return lineContext.measureJustifiedText(wordToWrite, justifyWidth, justifySettings);
  }
  return lineContext.measureText(wordToWrite).width;
}

export function resolveWriteTextFinalTargetContext(targetContext, drawToPrePTCanvas, prePTContext) {
  if (drawToPrePTCanvas) {
    return prePTContext;
  }
  return targetContext;
}

export function drawWriteTextFinalParagraph(targetContext, paragraphCanvas, drawState) {
  if (drawState.textRotation) {
    targetContext.save();
    targetContext.translate(drawState.textX + drawState.ptShift[0], drawState.textY + drawState.ptShift[1]);
    targetContext.rotate(Math.PI * drawState.textRotation / 180);
    targetContext.drawImage(
      paragraphCanvas,
      drawState.permaShift[0] - drawState.canvasMargin + drawState.finalHorizontalAdjust,
      drawState.verticalAdjust - drawState.canvasMargin + drawState.permaShift[1],
    );
    targetContext.restore();
    return;
  }
  targetContext.drawImage(
    paragraphCanvas,
    drawState.textX - drawState.canvasMargin + drawState.ptShift[0] + drawState.permaShift[0] + drawState.finalHorizontalAdjust,
    drawState.textY - drawState.canvasMargin + drawState.verticalAdjust + drawState.ptShift[1] + drawState.permaShift[1],
  );
}
