if (!loadedVersions.includes('bleedEdge/version')) {
	loadedVersions.push('bleedEdge/version')
}

if (currentVersion != 'bleedEdge/version') {
	currentVersion = 'bleedEdge/version'

	var totalShift = [11/250, 1/35]

	if (artWidth == cardWidth) {
		artWidth += scaleX(11/250)
	}
	if (artHeight == cardHeight) {
		artHeight += scaleY(1/35)
	}
	if (artX == 0) {
		artX -= scaleX(11/250)
		artWidth += scaleX(11/250)
	}
	if (artY == 0) {
		artY -= scaleY(1/35)
		artHeight += scaleY(1/35)
	}

	mainCanvas.width = cardWidth * 136/125
	mainCanvas.height = cardHeight * 37/35
	frameMasksCanvas.width = cardWidth * 136/125
	frameMasksCanvas.height = cardHeight * 37/35

	if (cardArt.src != '') {
		cardArt.onload()
	} else if (skipResizeCardArt > 0) {
		skipResizeCardArt -= 1
	}

	bottomInfoUpdated()
}

loadFramePackOptions([['regular', 'Regular']])