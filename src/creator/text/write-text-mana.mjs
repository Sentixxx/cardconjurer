export function resolveWriteTextManaColorCode(possibleCode) {
  if (possibleCode === 'manacolordefault') {
    return { manaSymbolColor: null };
  }
  if (possibleCode.includes('manacolor')) {
    return { manaSymbolColor: possibleCode.replace('manacolor', '') || 'white' };
  }
  return null;
}

export function resolveWriteTextKerningCode(possibleCode) {
  if (!possibleCode.includes('kerning')) {
    return null;
  }
  return possibleCode.replace('kerning', '') + 'px';
}

export function applyWriteTextKerningCode(lineContext, letterSpacing) {
  lineContext.letterSpacing = letterSpacing;
  lineContext.font = lineContext.font;
}

export function isSafariUserAgent(userAgent) {
	return /^((?!chrome|android).)*safari/i.test(userAgent);
}

export function shouldUseSafariCombinedManaSymbol(symbolData, isSafari) {
	return isSafari && (symbolData.symbol.image.src?.includes('.svg') || (symbolData.backImage?.src?.includes('.svg')));
}

export function createSafariCombinedManaSymbolCanvas(symbolData) {
	var combinedCanvas = document.createElement('canvas');
	combinedCanvas.width = symbolData.width;
	combinedCanvas.height = symbolData.height;
	var combinedContext = combinedCanvas.getContext('2d');

	if (symbolData.symbol.backs && symbolData.backImage) {
		combinedContext.drawImage(symbolData.backImage, 0, 0, symbolData.width, symbolData.height);
	}
	combinedContext.drawImage(symbolData.symbol.image, 0, 0, symbolData.width, symbolData.height);

	return combinedCanvas;
}

export function getManaSymbolRenderImages(symbolData, isSafari) {
	var imageToUse = symbolData.symbol.image;
	var backImageToUse = symbolData.backImage;
	if (shouldUseSafariCombinedManaSymbol(symbolData, isSafari)) {
		imageToUse = createSafariCombinedManaSymbolCanvas(symbolData);
		backImageToUse = null;
	}
	return {
		imageToUse,
		backImageToUse
	};
}

export function drawManaSymbolImage(targetContext, symbolData, isSafari) {
	const {imageToUse, backImageToUse} = getManaSymbolRenderImages(symbolData, isSafari);

	if (symbolData.radius > 0) {
		if (symbolData.symbol.backs && backImageToUse) {
			targetContext.drawImageArc(
				backImageToUse,
				symbolData.x,
				symbolData.y,
				symbolData.width,
				symbolData.height,
				symbolData.radius,
				symbolData.arcStart,
				symbolData.currentX
			);
		}
		targetContext.drawImageArc(
			imageToUse,
			symbolData.x,
			symbolData.y,
			symbolData.width,
			symbolData.height,
			symbolData.radius,
			symbolData.arcStart,
			symbolData.currentX
		);
	} else if (symbolData.color) {
		targetContext.fillImage(imageToUse, symbolData.x, symbolData.y, symbolData.width, symbolData.height, symbolData.color);
	} else {
		if (symbolData.symbol.backs && backImageToUse) {
			targetContext.drawImage(backImageToUse, symbolData.x, symbolData.y, symbolData.width, symbolData.height);
		}
		targetContext.drawImage(imageToUse, symbolData.x, symbolData.y, symbolData.width, symbolData.height);
	}
}

export function drawManaSymbolOutline(outlineContext, symbolData) {
	if (!symbolData.hasOutline) {return;}
	outlineContext.fillStyle = 'black';
	outlineContext.beginPath();
	var centerX = symbolData.x + symbolData.width / 2;
	var centerY = symbolData.y + symbolData.height / 2;
	var baseRadius = Math.max(symbolData.width, symbolData.height) / 2;
	var outlineRadius = baseRadius + (symbolData.outlineWidth || 0) / 2;
	outlineContext.arc(centerX, centerY + (symbolData.radius ?? 0), outlineRadius, 0, 2 * Math.PI);
	outlineContext.fill();
}

export function copyManaSymbolShadowSettings(targetContext, sourceContext) {
	targetContext.shadowColor = sourceContext.shadowColor;
	targetContext.shadowOffsetX = sourceContext.shadowOffsetX;
	targetContext.shadowOffsetY = sourceContext.shadowOffsetY;
	targetContext.shadowBlur = sourceContext.shadowBlur;
}

export function hasManaSymbolOutlines(manaSymbolQueue) {
	return manaSymbolQueue.some(symbolData => symbolData.hasOutline);
}

export function renderSimpleManaSymbolQueue(lineContext, manaSymbolQueue, isSafari) {
	manaSymbolQueue.forEach(symbolData => drawManaSymbolImage(lineContext, symbolData, isSafari));
}

export function renderOutlinedManaSymbolQueue(lineContext, lineCanvas, manaSymbolQueue, isSafari) {
	var outlineCanvas = lineCanvas.cloneNode();
	var outlineContext = outlineCanvas.getContext('2d');
	var symbolCanvas = lineCanvas.cloneNode();
	var symbolContext = symbolCanvas.getContext('2d');
	copyManaSymbolShadowSettings(symbolContext, lineContext);

	var tempCanvas = lineCanvas.cloneNode();
	var tempContext = tempCanvas.getContext('2d');
	tempContext.drawImage(lineCanvas, 0, 0);
	lineContext.clearRect(0, 0, lineCanvas.width, lineCanvas.height);

	manaSymbolQueue.forEach(symbolData => drawManaSymbolOutline(outlineContext, symbolData));
	lineContext.drawImage(outlineCanvas, 0, 0);
	lineContext.drawImage(tempCanvas, 0, 0);

	manaSymbolQueue.forEach(symbolData => drawManaSymbolImage(symbolContext, symbolData, isSafari));
	lineContext.drawImage(symbolCanvas, 0, 0);
}

export function renderManaSymbolQueue(lineContext, lineCanvas, manaSymbolQueue, userAgent) {
	if (manaSymbolQueue.length === 0) {return manaSymbolQueue;}

	var isSafari = isSafariUserAgent(userAgent);
	if (hasManaSymbolOutlines(manaSymbolQueue)) {
		renderOutlinedManaSymbolQueue(lineContext, lineCanvas, manaSymbolQueue, isSafari);
	} else {
		renderSimpleManaSymbolQueue(lineContext, manaSymbolQueue, isSafari);
	}
	return [];
}
