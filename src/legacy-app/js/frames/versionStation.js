//=====================================
// SHARED INITIALIZATION FUNCTION
//=====================================

function waitForStationFrameReady() {
	if (window.stationPreFrameContext) return Promise.resolve();
	
	return new Promise(resolve => {
		const checkLoaded = () => {
			if (window.stationPreFrameContext && typeof stationEdited === 'function') {
				resolve();
			} else {
				setTimeout(checkLoaded, 50);
			}
		};
		checkLoaded();
	});
}

async function initializeStationFrame(frameType = 'regular', preservedData = null) {
	
	// Initialize station canvases
	sizeCanvas('stationPreFrame');
	sizeCanvas('stationPostFrame');

	// Preserve existing station data AND current colors if they exist (for reloads)
	const existingStation = preservedData || card.station || {};
	// Only preserve colors if NOT in auto mode (let auto mode regenerate from mana)
	const isAutoMode = existingStation.colorModes?.[1] === 'auto' || !existingStation.colorModes?.[1];
	
	// Always preserve disableFirstAbility regardless of color mode
	const preservedDisableFirstAbility = existingStation.disableFirstAbility;
	
	const preservedColors = (existingStation.squares && !isAutoMode) ? {
		square1Color: existingStation.squares[1]?.color,
		square2Color: existingStation.squares[2]?.color,
		square1Opacity: existingStation.squares[1]?.opacity,
		square2Opacity: existingStation.squares[2]?.opacity,
		colorModes: existingStation.colorModes || {},
		badgeValues: existingStation.badgeValues || ['', '', '']
	} : null;
	
	// Wait for script to be loaded
	await waitForStationFrameReady();

	// Handle station data restoration and frame-specific settings
	if (existingStation && Object.keys(existingStation).length > 0) {
		// Merge the existing data back after version file loads
		card.station = {
			...card.station, // Keep the initialized defaults
			...existingStation // Restore any existing customizations
		};
		
		// Restore preserved colors if they existed
		if (preservedColors && card.station.squares) {
			if (preservedColors.square1Color) {
				card.station.squares[1].color = preservedColors.square1Color;
				card.station.squares[1].opacity = preservedColors.square1Opacity;
			}
			if (preservedColors.square2Color) {
				card.station.squares[2].color = preservedColors.square2Color;
				card.station.squares[2].opacity = preservedColors.square2Opacity;
			}
			if (preservedColors.colorModes) {
				card.station.colorModes = preservedColors.colorModes;
			}
			if (preservedColors.badgeValues) {
				card.station.badgeValues = preservedColors.badgeValues;
			}
		}
		
		// Always restore disableFirstAbility regardless of color mode
		if (preservedDisableFirstAbility !== undefined) {
			card.station.disableFirstAbility = preservedDisableFirstAbility;
		}
	}
	
	if (card.station && card.station.squares) {
		applyStationFrameSizing(frameType);
	}
	
	// Update UI to reflect correct values
	if (typeof fixStationInputs === 'function') {
		fixStationInputs();
	}
	
	// Only reset if we don't have preserved colors
	if (!preservedColors && typeof resetStationSettings === 'function') {
		resetStationSettings();
	}
	
	// Only trigger color updates if we don't have preserved colors
	if (!preservedColors) {
		// Trigger color updates based on current mana
		if (card.text?.mana?.text && typeof updateBadgeImageFromMana === 'function') {
			updateBadgeImageFromMana();
			updatePTImageFromMana();
			updateSquareColorsFromMana();
		}
	}
	
	// Trigger redraw
	if (typeof stationEdited === 'function') {
		setTimeout(() => {
			stationEdited();
		}, 50);
	}
	
	return true;
}

//=====================================
// INITIALIZATION AND SETUP
//=====================================

if (!loadedVersions.includes('/js/frames/versionStation.js')) {
	loadedVersions.push('/js/frames/versionStation.js');
	
	sizeCanvas('stationPreFrame');
	sizeCanvas('stationPostFrame');
	
	initializeStationImages();
	initializeStationDefaults();
	setupStationUI();
	
	// Set up property watchers
	setupStationListeners();
	
	fixStationInputs(stationEdited);
} else {
	// Clear existing watchers before setting up new ones
	clearStationListeners();
	
	// Set up fresh watchers
	setupStationListeners();
	
	// Just refresh the UI inputs
	fixStationInputs(stationEdited);
}

// Override textEdited function to handle station-specific updates
if (typeof window.originalTextEdited === 'undefined' && typeof textEdited === 'function') {
	window.originalTextEdited = textEdited;
	window.textEdited = function() {
		// Call the original function
		window.originalTextEdited();
		
		// Add station-specific handling
		if (typeof updateBadgeImageFromMana === 'function' && typeof updatePTImageFromMana === 'function') {
			const textKey = Object.keys(card.text)[selectedTextIndex];
			if (textKey === 'mana') {
				// Mana cost changed - update badge, PT image, and square colors
				updateBadgeImageFromMana();
				updatePTImageFromMana();
				updateSquareColorsFromMana();
				if (typeof stationEdited === 'function') stationEdited();
			} else if (textKey === 'pt') {
				// P/T changed - update text positions
				if (typeof updateStationTextPositions === 'function') updateStationTextPositions();
				if (typeof stationEdited === 'function') stationEdited();
			}
		}
	};
}

//=====================================
// UTILITY FUNCTIONS
//=====================================

function applyStationFrameSizing(frameType) {
	const isBorderless = frameType === 'borderless';
	const squareWidth = isBorderless ? 1712 : 1714;
	const squareX = isBorderless ? 1 : 0;
	
	card.station.borderlessXOffset = isBorderless ? 1 : 0;
	card.station.squares[1].width = squareWidth;
	card.station.squares[1].x = squareX;
	card.station.squares[2].width = squareWidth;
	card.station.squares[2].x = squareX;
}

function setupStationImage(imageName, imagePath) {
	const image = new Image();
	image.crossOrigin = 'anonymous';
	
	const cachedImage = document.querySelector(`img[data-station-cache="${imageName}"]`);
	if (cachedImage) return cachedImage;
	
	image.onload = () => {
		image.setAttribute('data-station-cache', imageName);
		stationEdited();
	};
	
	setImageUrl(image, imagePath);
	return image;
}

function setInputValues(inputMap) {
	Object.entries(inputMap).forEach(([selector, value]) => {
		const element = document.querySelector(selector);
		if (element) element.value = value;
	});
}

function syncStationSquareColorModeControls(mode, colorPicker, opacity2Container, opacity1Label) {
	const isAuto = mode === 'auto';
	
	if (colorPicker) colorPicker.classList.toggle('hidden', mode !== 'custom');
	if (opacity2Container) opacity2Container.classList.toggle('hidden', isAuto);
	if (opacity1Label) opacity1Label.textContent = isAuto ? 'Square Opacity:' : 'First Square Opacity:';
}

function extractManaSymbols(manaText) {
	const matches = manaText.match(/\{([wubrg])\}/gi);
	if (!matches) return [];
	
	const colorSymbols = new Set();
	matches.forEach(match => {
		const symbol = match.replace(/[{}]/g, '').toLowerCase();
		if (['w', 'u', 'b', 'r', 'g'].includes(symbol)) {
			colorSymbols.add(symbol);
		}
	});
	
	return Array.from(colorSymbols);
}

function getStationManaColorKey(manaText, fallback = 'default') {
	const manaSymbols = extractManaSymbols(manaText || '');
	
	if (manaSymbols.length === 1) return manaSymbols[0];
	if (manaSymbols.length > 1) return 'm';
	return fallback;
}

function setupDrawingContext(context, settings = {}) {
	context.globalCompositeOperation = settings.compositeOp || 'source-over';
	context.globalAlpha = settings.alpha || 1;
	context.fillStyle = settings.fillStyle || 'white';
	context.font = settings.font || scaleHeight(card.station.badgeSettings.fontSize) + 'px belerenbsc';
	context.textAlign = settings.textAlign || 'center';
	context.textBaseline = settings.textBaseline || 'middle';
}

//=====================================
// INITIALIZATION FUNCTIONS
//=====================================

function initializeStationImages() {
	window.stationBadgeImage = setupStationImage('badge', '/img/frames/station/badges/a.png');
	window.stationPTImage = setupStationImage('pt', '/img/frames/station/pt/a.png');
}

function createStationImportSettings() {
	return {
		singleAbility: {
			yOffset: -250,
			height1: 550,
		},
		versionOverrides: {
			'stationRegular': {
				yOffset: -275,
				height1: 525,
				minDistanceFromBottom: 163
			},
			'stationBorderless': {
				yOffset: -275,
				height1: 525,
				minDistanceFromBottom: 163
			}
		}
	};
}

function createStationBadgeSettings() {
	return {
		fontSize: 0.0245,
		width: 162,
		height: 162,
		x: -94,
		y: 0
	};
}

function createStationSquares() {
	return {
		1: { width: 1714, height: 300, x: 0, y: 76, enabled: true, color: '#e6ecf2', opacity: 0.2 },
		2: { width: 1714, height: 250, x: 0, y: 0, enabled: true, color: '#e6ecf2', opacity: 0.4 }
	};
}

function createStationBaseTextPositions() {
	return {
		ability1: {x: 0.18, y: 0.7},
		ability2: {x: 0.18, y: 0.83}
	};
}

function createStationTextOffsets() {
	return {
		1: { x: 85, y: 15 },
		2: { x: 85, y: 12 }
	};
}

function createStationPTSettings() {
	return {
		fontSize: 0.0320,
		width: 306,
		height: 148,
		x: 0,
		y: 0
	};
}

function createStationDefaultState() {
	return {
		abilityCount: 3,
		x: 0.1167,
		width: 0.8094,
		badgeX: 0.066,
		badgeValues: ['', '', ''],
		disableFirstAbility: false,
		disabledTextX: 0.087,
		disabledTextWidth: 0.825,
		importSettings: createStationImportSettings(),
		badgeSettings: createStationBadgeSettings(),
		squares: createStationSquares(),
		minDistanceFromBottom: 150,
		baseTextPositions: createStationBaseTextPositions(),
		textOffsets: createStationTextOffsets(),
		ptSettings: createStationPTSettings()
	};
}

function createStationColorSettings() {
	return {
		default: { square1: '#e6ecf2', square2: '#e6ecf2', square2OpacityOffset: 0.20 },
		w: { square1: '#4a4a4a', square2: '#4a4a4a', square2OpacityOffset: 0.20 },
		u: { square1: '#0075be', square2: '#0075be', square2OpacityOffset: 0.20 },
		b: { square1: '#272624', square2: '#272624', square2OpacityOffset: 0.15 },
		r: { square1: '#ef3827', square2: '#ef3827', square2OpacityOffset: 0.20 },
		g: { square1: '#007b43', square2: '#007b43', square2OpacityOffset: 0.45 },
		m: { square1: '#bc932e', square2: '#bc932e', square2OpacityOffset: 0.25 },
		a: { square1: '#416c77', square2: '#416c77', square2OpacityOffset: 0.20 },
		l: { square1: '#7c5439', square2: '#7c5439', square2OpacityOffset: 0.20 }
	};
}

function createStationPackDefaults() {
	return {
		ability: { x: 175/2010, y: 1775/2814, width: 1660/2010, height: 280/2814 }
	};
}

function createStationMissingDefaults() {
	return {
		badgeValues: ['', '', ''],
		badgeSettings: { fontSize: 0.0250, width: 162, height: 162 },
		colorModes: { 1: 'auto', 2: 'auto' },
		ptColorMode: 'auto',
		badgeColorMode: 'auto',
		colorSettings: createStationColorSettings(),
		packDefaults: createStationPackDefaults()
	};
}

function applyStationMissingDefaults(defaults) {
	Object.entries(defaults).forEach(([key, value]) => {
		if (!card.station[key]) card.station[key] = value;
	});
}

function initializeStationDefaults() {
	if (!card.station) {
		card.station = createStationDefaultState();
	}
	
	applyStationMissingDefaults(createStationMissingDefaults());
}

//=====================================
// UI SETUP
//=====================================

const stationBaseColorModeOptions = [
	{value: 'auto', label: 'Auto (Based on Mana Cost)'},
	{value: 'white', label: 'White'},
	{value: 'blue', label: 'Blue'},
	{value: 'black', label: 'Black'},
	{value: 'red', label: 'Red'},
	{value: 'green', label: 'Green'},
	{value: 'multi', label: 'Multicolored'},
	{value: 'colorless', label: 'Colorless'}
];

const stationSquareColorModeOptions = stationBaseColorModeOptions.concat([
	{value: 'artifact', label: 'Artifact'},
	{value: 'land', label: 'Land'},
	{value: 'custom', label: 'Custom'}
]);

function renderStationColorModeOptions(options) {
	return options.map(({value, label}) => `<option value='${value}'>${label}</option>`).join('');
}

function renderStationDivider() {
	return `<div style='border-top: 1px solid #ccc; padding-top: 15px; margin-top: 15px;'></div>`;
}

function renderStationBadgeSettingsControls() {
	return `
		<h5 class='padding margin-bottom input-description'>Station Badge Settings:</h5>
		<div class='padding input-grid margin-bottom'>
			<div><h5 class='padding margin-bottom input-description' style='font-style: normal;'>Badge Color Mode:</h5>
				<select id='station-badge-color-mode' class='input' onchange='updateBadgeColorMode();'>
					${renderStationColorModeOptions(stationBaseColorModeOptions)}
				</select>
			</div>
			<div><h5 class='padding margin-bottom input-description' style='font-style: normal;'>First Ability Badge Value:</h5><input id='station-badge-value-1' type='text' class='input' oninput='stationEdited();' placeholder='Badge Text'></div>
			<div><h5 class='padding margin-bottom input-description' style='font-style: normal;'>Second Ability Badge Value:</h5><input id='station-badge-value-2' type='text' class='input' oninput='stationEdited();' placeholder='Badge Text'></div>
		</div>`;
}

function renderStationPTSettingsControls() {
	return `
		<h5 class='padding margin-bottom input-description'>Station PT Box Settings:</h5>
		<div class='padding input-grid margin-bottom'>
			<div><h5 class='padding margin-bottom input-description' style='font-style: normal;'>PT Color Mode:</h5>
				<select id='station-pt-color-mode' class='input' onchange='updatePTColorMode();'>
					${renderStationColorModeOptions(stationBaseColorModeOptions)}
				</select>
			</div>
			<div><h5 class='padding margin-bottom input-description' style='font-style: normal;'>PT X Offset:</h5><input id='station-pt-x-offset' type='number' class='input' oninput='stationEdited();' placeholder='PT X Offset'></div>
			<div><h5 class='padding margin-bottom input-description' style='font-style: normal;'>PT Y Offset:</h5><input id='station-pt-y-offset' type='number' class='input' oninput='stationEdited();' placeholder='PT Y Offset'></div>
		</div>`;
}

function renderStationSquareSettingsControls() {
	return `
		<h5 class='padding margin-bottom input-description'>Station Square Settings:</h5>

		<div class='padding input-grid margin-bottom'>
			<div><h5 class='padding margin-bottom input-description' style='font-style: normal;'>Square Width (Both Squares):</h5><input id='station-square-width' type='number' class='input' oninput='stationEdited();' min='0' placeholder='Square Width'></div>
			<div><h5 class='padding margin-bottom input-description' style='font-style: normal;'>Square X Offset (Both Squares):</h5><input id='station-square-x' type='number' class='input' oninput='stationEdited();' placeholder='Square X Offset'></div>
			<div><h5 class='padding margin-bottom input-description' style='font-style: normal;'>Square Y Offset (Starting point of first square):</h5><input id='station-square-y' type='number' class='input' oninput='stationEdited();' placeholder='Square Y Offset'></div>
		</div>

		<div class='padding input-grid margin-bottom'>
			<div><h5 class='padding margin-bottom input-description' style='font-style: normal;'>First Square Height:</h5><input id='station-square-height-1' type='number' class='input' oninput='stationEdited();' min='0' placeholder='First Square Height'></div>
			<div><h5 class='padding margin-bottom input-description' style='font-style: normal;'>Second Square Height (Set to bottom of text box automatically from bottom of first square):</h5><input id='station-square-height-2' type='number' class='input' oninput='stationEdited();' min='0' placeholder='Second Square Height'></div>
		</div>

		<div class='padding input-grid'>
			<label class='checkbox-container input'>Disable First Square Color (First square becomes transparent. Second square gets first squares base opacity for each color on auto. Set to a color mode to get independent opacity)
				<input id='station-disable-first-ability' type='checkbox' onchange='stationEdited();'>
				<span class='checkmark'></span>
			</label>
		</div>

		<div class='padding input-grid margin-bottom'>
			<div><h5 class='padding margin-bottom input-description' style='font-style: normal;'>Square Color Mode:</h5>
				<select id='station-square-color-mode' class='input' onchange='toggleSquareColorPicker();'>
					${renderStationColorModeOptions(stationSquareColorModeOptions)}
				</select>
			</div>
			<div id='station-square-color-picker' class='hidden'><h5 class='padding margin-bottom input-description' style='font-style: normal;'>Square Color:</h5><input id='station-square-color' type='color' class='input' value='#e6ecf2' onchange='stationEdited();'></div>
		</div>
		<div class='padding input-grid margin-bottom'>
			<div><h5 id='station-square-opacity-1-label' class='padding margin-bottom input-description' style='font-style: normal;'>Square Opacity:</h5><input id='station-square-opacity-1' type='range' class='input' min='0' max='1' step='0.05' value='0.7' oninput='stationEdited();'></div>
			<div id='station-square-opacity-2-container'><h5 class='padding margin-bottom input-description' style='font-style: normal;'>Second Square Opacity:</h5><input id='station-square-opacity-2' type='range' class='input' min='0' max='1' step='0.05' value='0.7' oninput='stationEdited();'></div>
		</div>`;
}

function renderStationResetControls() {
	return `
		<div class='padding margin-bottom' style='text-align: center; border-top: 1px solid #ccc; padding-top: 20px;'>
			<button id='station-reset-button' class='input' onclick='resetStationSettings();' style='background-color:rgb(51, 51, 51); color: white; padding: 10px 20px; font-weight: bold;'>
				Reset Station Settings to Defaults
			</button>
		</div>`;
}

function renderStationControlsHTML() {
	return `
	<div class='readable-background padding'>
		<h5 class='padding margin-bottom input-description'>Station Card Controls - Adjust text box heights and colored square backgrounds for each ability</h5>
		${renderStationBadgeSettingsControls()}
		${renderStationDivider()}
		${renderStationPTSettingsControls()}
		${renderStationDivider()}
		${renderStationSquareSettingsControls()}
		${renderStationResetControls()}
	</div>`;
}

function setupStationUI() {
	document.querySelector('#creator-menu-tabs').innerHTML += '<h3 class="selectable readable-background" onclick="toggleCreatorTabs(event, `station`)">Station</h3>';

	const newHTML = document.createElement('div');
	newHTML.id = 'creator-menu-station';
	newHTML.classList.add('hidden');
	newHTML.innerHTML = renderStationControlsHTML();

	document.querySelector('#creator-menu-sections').appendChild(newHTML);
}

//=====================================
// LISTENER SETUP
//=====================================

function setupStationListeners() {
	// Only set up if not already done
	if (window.stationListenersInitialized) return;
	
	// Set up property watchers for mana and PT text changes
	setupManaPropertyWatcher();
	setupPTPropertyWatcher();
	
	window.stationListenersInitialized = true;
}

function setupStationTextPropertyWatcher(textKey, warningMessage, timeoutKey, onChange) {
	const textBox = card.text?.[textKey];
	if (!textBox) {
		console.warn(warningMessage);
		return;
	}
	
	if (textBox._stationWatcherActive) {
		return;
	}
	
	const currentValue = textBox.text || '';
	
	delete textBox.text;
	
	Object.defineProperty(textBox, 'text', {
		get: function() {
			return this._textValue || '';
		},
		set: function(newValue) {
			const oldValue = this._textValue || '';
			this._textValue = newValue || '';
			
			if (oldValue !== this._textValue) {
				clearTimeout(this[timeoutKey]);
				this[timeoutKey] = setTimeout(onChange, 50);
			}
		},
		enumerable: true,
		configurable: true
	});
	
	textBox._textValue = currentValue;
	textBox._stationWatcherActive = true;
}

function setupManaPropertyWatcher() {
	setupStationTextPropertyWatcher('mana', 'Mana text object not found for property watcher', '_stationManaUpdateTimeout', () => {
		updateBadgeImageFromMana();
		updatePTImageFromMana();
		updateSquareColorsFromMana();
		stationEdited();
	});
}

function setupPTPropertyWatcher() {
	setupStationTextPropertyWatcher('pt', 'PT text object not found for property watcher', '_stationPTUpdateTimeout', () => {
		updateStationTextPositions();
		stationEdited();
	});
}

function clearStationTextPropertyWatcher(textKey, timeoutKey) {
	const textBox = card.text?.[textKey];
	if (!textBox?._stationWatcherActive) return;
	
	const currentValue = textBox._textValue;
	delete textBox.text;
	delete textBox._textValue;
	delete textBox._stationWatcherActive;
	delete textBox[timeoutKey];
	
	textBox.text = currentValue;
}

function clearStationListeners() {
	// Clear property watchers by restoring original text properties
	clearStationTextPropertyWatcher('mana', '_stationManaUpdateTimeout');
	clearStationTextPropertyWatcher('pt', '_stationPTUpdateTimeout');
	
	window.stationListenersInitialized = false;
}

//=====================================
// COLOR MODE FUNCTIONS
//=====================================

const stationImageColorSuffixes = {
	white: 'w',
	blue: 'u',
	black: 'b',
	red: 'r',
	green: 'g',
	multi: 'm',
	colorless: 'a',
	artifact: 'a',
	land: 'l'
};

function getStationImageColorSuffix(mode) {
	return stationImageColorSuffixes[mode] || 'a';
}

function handleStationAutoColorMode(type) {
	if (type === 'square') updateSquareColorsFromMana();
	else if (type === 'badge') updateBadgeImageFromMana();
	else if (type === 'pt') updatePTImageFromMana();
}

function updateStationImageColorMode(type, mode) {
	const folderName = type === 'badge' ? 'badges' : type;
	const imagePath = `/img/frames/station/${folderName}/${getStationImageColorSuffix(mode)}.png`;
	const image = type === 'badge' ? stationBadgeImage : stationPTImage;
	setImageUrl(image, imagePath);
}

function handleColorMode(type, mode) {
	if (mode === 'auto') {
		handleStationAutoColorMode(type);
		return;
	}
	
	if (type !== 'square') {
		updateStationImageColorMode(type, mode);
		return;
	}
	
	applyStationSquareColorMode(mode);
}

function updateStationColorModeFromInput(selector, colorModeProp, type) {
	const mode = document.querySelector(selector)?.value;
	if (mode) {
		card.station[colorModeProp] = mode;
		handleColorMode(type, mode);
		stationEdited();
	}
}

function updateBadgeColorMode() {
	updateStationColorModeFromInput('#station-badge-color-mode', 'badgeColorMode', 'badge');
}

function updatePTColorMode() {
	updateStationColorModeFromInput('#station-pt-color-mode', 'ptColorMode', 'pt');
}

function updateImageFromMana(imageType, imageProp, colorModeProp) {
	if (card.station[colorModeProp] !== 'auto' || !card.text?.mana) return;
	
	const suffix = getStationManaColorKey(card.text.mana.text, 'a');
	const imagePath = `/img/frames/station/${imageType}/${suffix}.png`;
	const image = window[imageProp];
	
	if (image && !image.src.endsWith(imagePath)) {
		setImageUrl(image, imagePath);
	}
}

function updateBadgeImageFromMana() {
	updateImageFromMana('badges', 'stationBadgeImage', 'badgeColorMode');
	updateSquareColorsFromMana();
}

function updatePTImageFromMana() {
	updateImageFromMana('pt', 'stationPTImage', 'ptColorMode');
}

//=====================================
// INPUT MANAGEMENT
//=====================================

function getStationInputValueMap() {
	const borderlessOffset = card.station.borderlessXOffset || 0;
	
	return {
		'#station-badge-value-1': card.station.badgeValues[1] || '',
		'#station-badge-value-2': card.station.badgeValues[2] || '',
		'#station-badge-color-mode': card.station.badgeColorMode || 'auto',
		'#station-pt-x-offset': card.station.ptSettings.x || 0,
		'#station-pt-y-offset': card.station.ptSettings.y || 0,
		'#station-pt-color-mode': card.station.ptColorMode || 'auto',
		'#station-square-width': card.station.squares[1].width,
		'#station-square-height-1': card.station.squares[1].height,
		'#station-square-height-2': card.station.squares[2].height,
		'#station-square-x': card.station.squares[1].x - borderlessOffset, // Subtract offset for UI display
		'#station-square-y': card.station.squares[1].y - 76,
		'#station-square-color': card.station.squares[1].color || '#e6ecf2',
		'#station-square-opacity-1': card.station.squares[1].opacity || 0.7,
		'#station-square-opacity-2': card.station.squares[2].opacity || 0.7
	};
}

function syncStationDisableFirstAbilityInput() {
	const disableCheckbox = document.querySelector('#station-disable-first-ability');
	if (disableCheckbox) disableCheckbox.checked = card.station.disableFirstAbility || false;
}

function syncStationSquareColorModeInput() {
	const colorMode = document.querySelector('#station-square-color-mode');
	const colorPicker = document.querySelector('#station-square-color-picker');
	const opacity2Container = document.querySelector('#station-square-opacity-2-container');
	const opacity1Label = document.querySelector('#station-square-opacity-1-label');
	
	if (colorMode) {
		colorMode.value = card.station.colorModes[1] || 'auto';
		syncStationSquareColorModeControls(colorMode.value, colorPicker, opacity2Container, opacity1Label);
	}
}

function fixStationInputs(callback) {
	syncStationDisableFirstAbilityInput();
	setInputValues(getStationInputValueMap());
	syncStationSquareColorModeInput();
	
	if (callback) callback();
}

//=====================================
// POSITION AND LAYOUT MANAGEMENT
//=====================================

function ensureStationTextOffsets(square) {
	if (card.station.textOffsets) return;
	
	card.station.textOffsets = {
		1: { x: square.width * 0.05, y: square.height * 0.05 },
		2: { x: square.width * 0.05, y: square.height * 0.05 }
	};
}

function applyStationTextPosition(textBox, position) {
	if (textBox.x === position.x && textBox.y === position.y &&
		textBox.width === position.width && textBox.height === position.height) {
		return false;
	}
	
	Object.assign(textBox, position);
	return true;
}

function updateStationAbilityOneTextPosition() {
	if (!(card.text?.ability1 && card.station.squares[1])) return false;
	
	const square = card.station.squares[1];
	const basePos = card.station.baseTextPositions.ability1;
	
	ensureStationTextOffsets(square);
	
	let textWidth = (square.width * 0.9) / card.width;
	const textHeight = (square.height * 0.9) / card.height;
	let textX, textY;
	
	if (card.station.disableFirstAbility) {
		textX = card.station.disabledTextX || 0.087; // Use completely separate X position and width when disabled
		textWidth = card.station.disabledTextWidth || 0.825; // Use separate width setting instead of square calculation
		textY = basePos.y + (square.y + card.station.textOffsets[1].y) / card.height;
	} else {
		// Use normal calculation when enabled
		textX = basePos.x + (square.x + card.station.textOffsets[1].x - 214) / card.width;
		textY = basePos.y + (square.y + card.station.textOffsets[1].y) / card.height;
	}
	
	return applyStationTextPosition(card.text.ability1, { x: textX, y: textY, width: textWidth, height: textHeight });
}

function updateStationAbilityTwoTextPosition() {
	if (!(card.text?.ability2 && card.station.squares[2])) return false;
	
	const square = card.station.squares[2];
	const basePos = card.station.baseTextPositions.ability2;
	
	ensureStationTextOffsets(square);
	
	let textWidth = (square.width * 0.9) / card.width;
	const textHeight = (square.height * 0.9) / card.height;
	
	const hasPT = card.text?.pt?.text?.trim();
	if (hasPT) textWidth *= 0.865;
	
	const textX = basePos.x + (square.x + card.station.textOffsets[2].x - 214) / card.width;
	const textY = basePos.y + (square.y + card.station.textOffsets[2].y) / card.height;
	
	return applyStationTextPosition(card.text.ability2, { x: textX, y: textY, width: textWidth, height: textHeight });
}

function scheduleStationTextPositionRedraw() {
	setTimeout(() => { if (typeof textEdited === 'function') textEdited(); }, 10);
	setTimeout(() => { if (typeof drawCard === 'function') drawCard(); }, 20);
}

function updateStationTextPositions() {
	if (!card.station?.baseTextPositions) return;
	
	const abilityOneChanged = updateStationAbilityOneTextPosition();
	const abilityTwoChanged = updateStationAbilityTwoTextPosition();
	
	if (abilityOneChanged || abilityTwoChanged) scheduleStationTextPositionRedraw();
}

//=====================================
// MAIN DRAWING AND EDITING FUNCTIONS
//=====================================

const stationInputTargetSetters = {
	'card.station.badgeValues[1]': value => { card.station.badgeValues[1] = value; },
	'card.station.badgeValues[2]': value => { card.station.badgeValues[2] = value; },
	'card.station.disableFirstAbility': value => { card.station.disableFirstAbility = value; },
	'card.station.ptSettings.x': value => { card.station.ptSettings.x = value; },
	'card.station.ptSettings.y': value => { card.station.ptSettings.y = value; },
	'card.station.squares[1].height': value => { card.station.squares[1].height = value; },
	'card.station.squares[2].height': value => { card.station.squares[2].height = value; },
	'card.station.squares[1].y': value => { card.station.squares[1].y = value; },
	'card.station.squares[1].opacity': value => { card.station.squares[1].opacity = value; },
	'card.station.squares[2].opacity': value => { card.station.squares[2].opacity = value; }
};

const stationInputValueReaders = {
	checked: element => element.checked,
	int: element => parseInt(element.value) || 0,
	'int-offset-76': element => (parseInt(element.value) || 0) + 76,
	float: element => parseFloat(element.value),
	value: element => element.value
};

const stationInputElementConfigs = [
	{id: '#station-badge-value-1', target: 'card.station.badgeValues[1]', type: 'value'},
	{id: '#station-badge-value-2', target: 'card.station.badgeValues[2]', type: 'value'},
	{id: '#station-disable-first-ability', target: 'card.station.disableFirstAbility', type: 'checked'},
	{id: '#station-pt-x-offset', target: 'card.station.ptSettings.x', type: 'int'},
	{id: '#station-pt-y-offset', target: 'card.station.ptSettings.y', type: 'int'},
	{id: '#station-square-width', target: 'both-squares.width', type: 'int'},
	{id: '#station-square-x', target: 'both-squares.x', type: 'int'},
	{id: '#station-square-height-1', target: 'card.station.squares[1].height', type: 'int'},
	{id: '#station-square-height-2', target: 'card.station.squares[2].height', type: 'int'},
	{id: '#station-square-y', target: 'card.station.squares[1].y', type: 'int-offset-76'},
	{id: '#station-square-opacity-1', target: 'card.station.squares[1].opacity', type: 'float'},
	{id: '#station-square-opacity-2', target: 'card.station.squares[2].opacity', type: 'float'}
];

const stationPresetColorKeys = {
	white: 'w',
	blue: 'u',
	black: 'b',
	red: 'r',
	green: 'g',
	multi: 'm',
	colorless: 'default',
	artifact: 'a',
	land: 'l'
};

function setStationInputTarget(target, value) {
	const setter = stationInputTargetSetters[target];
	if (!setter) throw new Error(`Unhandled station input target: ${target}`);
	setter(value);
}

function readStationInputValue(element, type) {
	const reader = stationInputValueReaders[type] || stationInputValueReaders.value;
	return reader(element);
}

function setStationBothSquareWidth(value) {
	card.station.squares[1].width = value;
	card.station.squares[2].width = value;
}

function setStationBothSquareX(value) {
	const borderlessOffset = card.station.borderlessXOffset || 0;
	card.station.squares[1].x = value + borderlessOffset;
	card.station.squares[2].x = value + borderlessOffset;
}

function applyStationInputValue(target, value) {
	if (target === 'both-squares.width') {
		setStationBothSquareWidth(value);
		return;
	}
	
	if (target === 'both-squares.x') {
		setStationBothSquareX(value);
		return;
	}
	
	setStationInputTarget(target, value);
}

function getStationInputElements() {
	return stationInputElementConfigs;
}

function syncStationInputValues() {
	getStationInputElements().forEach(({id, target, type}) => {
		const element = document.querySelector(id);
		if (!element) return;
		
		const value = readStationInputValue(element, type);
		applyStationInputValue(target, value);
	});
}

function syncStationSecondOpacityInput(value = card.station.squares[2].opacity) {
	const opacityInput = document.querySelector('#station-square-opacity-2');
	if (opacityInput) opacityInput.value = value;
}

function getStationSecondSquareOpacity(baseOpacity, opacityOffset = 0.2) {
	return card.station.disableFirstAbility ? 
		baseOpacity : 
		Math.min(1.0, baseOpacity + opacityOffset);
}

function getStationMinDistanceFromBottom() {
	let minDistanceFromBottom = card.station.minDistanceFromBottom || 300;
	
	if (card.station.importSettings?.versionOverrides?.[card.version]?.minDistanceFromBottom) {
		minDistanceFromBottom = card.station.importSettings.versionOverrides[card.version].minDistanceFromBottom;
	}
	
	if (card.margins) {
		minDistanceFromBottom += 60;
	}
	
	return minDistanceFromBottom;
}

function getStationSecondSquareY(basePos1, basePos2) {
	const square1Bottom = scaleY(basePos1.y) + card.station.squares[1].y + card.station.squares[1].height;
	return square1Bottom - scaleY(basePos2.y);
}

function getStationSecondSquareHeight(basePos2) {
	const scaledMinDistance = scaleHeight(getStationMinDistanceFromBottom() / 2100);
	const canvasHeight = stationPreFrameCanvas.height;
	const maxAllowedBottom = canvasHeight - scaledMinDistance;
	const maxHeight = maxAllowedBottom - (scaleY(basePos2.y) + card.station.squares[2].y);
	
	return Math.max(50, maxHeight);
}

function syncStationSecondHeightInput() {
	const heightInput = document.querySelector('#station-square-height-2');
	if (heightInput) {
		heightInput.value = card.station.squares[2].height;
	}
}

function updateStationSecondSquareLayout() {
	const basePos1 = card.station.baseTextPositions.ability1;
	const basePos2 = card.station.baseTextPositions.ability2;
	
	card.station.squares[2].y = getStationSecondSquareY(basePos1, basePos2);
	card.station.squares[2].height = getStationSecondSquareHeight(basePos2);
	
	syncStationSecondHeightInput();
}

function applyStationCustomSquareColor() {
	const colorInput = document.querySelector('#station-square-color');
	if (!colorInput || card.station.colorModes[1] !== 'custom') return;
	
	card.station.squares[1].color = colorInput.value;
	card.station.squares[2].color = colorInput.value;
}

function syncStationAutoModeOpacity(mode1, mode2) {
	if (mode1 !== 'auto' || mode2 !== 'auto') return;
	
	const colorKey = getStationManaColorKey(card.text?.mana?.text);
	const colorSet = card.station.colorSettings[colorKey];
	if (!colorSet) return;
	
	const opacityOffset = colorSet.square2OpacityOffset || 0.2;
	const newSecondOpacity = getStationSecondSquareOpacity(card.station.squares[1].opacity, opacityOffset);
	
	card.station.squares[2].opacity = newSecondOpacity;
	syncStationSecondOpacityInput(newSecondOpacity);
}

function handleStationDisableStateChange(previousDisableState, mode2) {
	if (previousDisableState === card.station.disableFirstAbility) return;
	
	if (mode2 === 'auto') {
		updateSquareColorsFromMana();
		return;
	}
	
	if (mode2 !== 'custom') {
		applyPresetColor(2, mode2);
		return;
	}
	
	const newOpacity = getStationSecondSquareOpacity(card.station.squares[1].opacity);
	card.station.squares[2].opacity = newOpacity;
	syncStationSecondOpacityInput(newOpacity);
}

function clearStationFrameContexts() {
	[stationPreFrameContext, stationPostFrameContext].forEach(ctx => 
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height));
}

function drawStationSquares() {
	if (!card.station.disableFirstAbility) {
		drawStationSquare(1);
	}
	drawStationSquare(2);
}

function redrawStationFrame() {
	clearStationFrameContexts();
	drawStationSquares();
	
	setupDrawingContext(stationPreFrameContext, {alpha: 1});
	drawStationBadges();
	drawCard();
}

function ensureStationBaseTextPositions() {
	if (card.station.baseTextPositions) return;
	
	card.station.baseTextPositions = {
		ability1: {x: 0.18, y: 0.7},
		ability2: {x: 0.18, y: 0.83}
	};
}

function stationEdited() {
	if (!stationPreFrameContext || !stationPostFrameContext) return;
	
	ensureStationBaseTextPositions();
	
	const previousDisableState = card.station.disableFirstAbility;
	syncStationInputValues();
	applyStationCustomSquareColor();
	
	// Handle auto mode opacity linking - ADD THIS SECTION
	const mode1 = card.station.colorModes[1];
	const mode2 = card.station.colorModes[2];
	syncStationAutoModeOpacity(mode1, mode2);
	handleStationDisableStateChange(previousDisableState, mode2);
	
	updateStationSecondSquareLayout();
	updateStationTextPositions();
	redrawStationFrame();
}

//=====================================
// DRAWING FUNCTIONS
//=====================================

function getStationSquareDrawPosition(index, textKey = `ability${index}`) {
	const square = card.station.squares[index];
	const basePos = card.station.baseTextPositions[textKey];
	
	return {
		square,
		squareX: scaleX(basePos.x) + (square.x - 214),
		squareY: scaleY(basePos.y) + square.y
	};
}

function drawStationSquare(index) {
	const square = card.station.squares[index];
	const abilityName = `ability${index}`;
	
	// For square 1, check if it's disabled
	if (index === 1 && card.station.disableFirstAbility) {
		// Don't draw the square (make it transparent) but keep all other properties
		return;
	}
	
	if (square.enabled && card.text?.[abilityName]) {
		const { squareX, squareY } = getStationSquareDrawPosition(index, abilityName);
		
		stationPreFrameContext.fillStyle = square.color;
		stationPreFrameContext.globalAlpha = square.opacity;
		stationPreFrameContext.fillRect(squareX, squareY, square.width, square.height);
	}
}

function getStationBadgeElements() {
	return [
		{type: 'badge', index: 1, key: 'ability1', image: stationBadgeImage, 
		 settings: card.station.badgeSettings, 
		 hasValue: () => card.station.badgeValues?.[1]?.trim() && /\d/.test(card.station.badgeValues[1])},
		{type: 'badge', index: 2, key: 'ability2', image: stationBadgeImage, 
		 settings: card.station.badgeSettings,
		 hasValue: () => card.station.badgeValues?.[2]?.trim() && /\d/.test(card.station.badgeValues[2])},
		{type: 'pt', index: 2, key: 'ability2', image: stationPTImage, 
		 settings: card.station.ptSettings,
		 hasValue: () => card.text?.pt?.text?.trim()}
	];
}

function drawStationBadgeElement(element) {
	if (element.type === 'pt') {
		stationPostFrameContext.font = scaleHeight(element.settings.fontSize) + 'px belerenbsc';
	}
	drawStationElement(element.type, element.index, element.key, element.image, element.settings, element.hasValue);
}

function drawStationBadges() {
	setupDrawingContext(stationPostFrameContext);
	getStationBadgeElements().forEach(drawStationBadgeElement);
}

function getStationElementPosition(elementType, square, squareX, squareY, settings) {
	return {
		elementX: elementType === 'pt' ? 
			squareX + square.width + (settings.x - 266) : 
			squareX + (settings.x || -81),
		elementY: squareY + (square.height / 2) + (settings.y || 0)
	};
}

function getStationElementTextPosition(elementType, elementX, elementY, width) {
	const textXOffset = 3;
	const textYOffset = elementType === 'pt' ? 7 : 5;
	
	return {
		textX: elementX + (width / 2) + textXOffset,
		textY: elementY + textYOffset
	};
}

function getStationElementTextValue(elementType, index) {
	return elementType === 'pt' ? 
		card.text.pt.text : 
		card.station.badgeValues[index];
}

function drawStationElement(elementType, index, textKey, image, settings, hasValue) {
	if (!hasValue()) return;
	
	const { square, squareX, squareY } = getStationSquareDrawPosition(index, textKey);
	
	const width = settings.width;
	const height = settings.height;
	const { elementX, elementY } = getStationElementPosition(elementType, square, squareX, squareY, settings);
	
	if (image?.complete && image.naturalWidth > 0) {
		stationPostFrameContext.drawImage(image, elementX, elementY - (height / 2), width, height);
	}
	
	const { textX, textY } = getStationElementTextPosition(elementType, elementX, elementY, width);
	const textValue = getStationElementTextValue(elementType, index);
	
	stationPostFrameContext.fillText(textValue, textX, textY);
}

//=====================================
// COLOR AND SQUARE MANAGEMENT
//=====================================

function syncStationFirstSquareColorFromMana(colorSet) {
	if (card.station.colorModes[1] === 'auto' && card.station.squares[1].color !== colorSet.square1) {
		card.station.squares[1].color = colorSet.square1;
	}
}

function syncStationSecondSquareColorFromMana(colorSet) {
	if (card.station.colorModes[2] !== 'auto') return;
	
	const opacityOffset = colorSet.square2OpacityOffset || 0.2;
	const newOpacity = getStationSecondSquareOpacity(card.station.squares[1].opacity, opacityOffset);
	
	if (card.station.squares[2].color !== colorSet.square1 || 
		Math.abs(card.station.squares[2].opacity - newOpacity) > 0.01) {
		
		card.station.squares[2].color = colorSet.square1;
		card.station.squares[2].opacity = newOpacity;
		
		syncStationSecondOpacityInput();
	}
}

function updateSquareColorsFromMana() {
	if (!card.text?.mana || !card.station.colorSettings) return;
	
	const mode1 = card.station.colorModes[1];
	const mode2 = card.station.colorModes[2];
	
	if (mode1 !== 'auto' && mode2 !== 'auto') return;
	
	const colorKey = getStationManaColorKey(card.text.mana.text);
	const colorSet = card.station.colorSettings[colorKey];
	if (!colorSet) return;
	
	syncStationFirstSquareColorFromMana(colorSet);
	syncStationSecondSquareColorFromMana(colorSet);
}

function resetStationSquareOpacitiesForColorMode() {
	card.station.squares[1].opacity = 0.2;
	card.station.squares[2].opacity = 0.4;
	
	const opacity1Input = document.querySelector('#station-square-opacity-1');
	if (opacity1Input) opacity1Input.value = card.station.squares[1].opacity;
	syncStationSecondOpacityInput();
}

function applyStationSquareColorMode(mode) {
	applyPresetColor(1, mode);
	applyPresetColor(2, mode);
}

function toggleSquareColorPicker() {
	const modeSelect = document.querySelector('#station-square-color-mode');
	const colorPickerDiv = document.querySelector('#station-square-color-picker');
	const opacity2Container = document.querySelector('#station-square-opacity-2-container');
	const opacity1Label = document.querySelector('#station-square-opacity-1-label');
	
	if (!modeSelect || !colorPickerDiv) return;
	
	const mode = modeSelect.value;
	card.station.colorModes[1] = mode;
	card.station.colorModes[2] = mode;
	
	colorPickerDiv.classList.toggle('hidden', mode !== 'custom');
	
	if (mode !== 'custom') {
		resetStationSquareOpacitiesForColorMode();
		applyStationSquareColorMode(mode);
	}
	
	syncStationSquareColorModeControls(mode, null, opacity2Container, opacity1Label);
	stationEdited();
}

function getStationPresetColorSet(mode) {
	const colorSettings = card.station.colorSettings;
	const colorKey = stationPresetColorKeys[mode];
	
	return colorSettings[colorKey] || colorSettings.default;
}

function applyPresetColor(index, mode) {
	if (mode === 'auto') {
		updateSquareColorsFromMana();
		return;
	}
	
	const colorSet = getStationPresetColorSet(mode);
	const color = colorSet.square1;
	const opacityOffset = colorSet.square2OpacityOffset || 0.2;
	
	card.station.squares[index].color = color;
	
	if (index === 2) {
		card.station.squares[2].opacity = getStationSecondSquareOpacity(0.2, opacityOffset);
		syncStationSecondOpacityInput();
	}
}

//=====================================
// RESET FUNCTIONALITY
//=====================================

function refreshStationAfterReset() {
	if (card.text?.mana?.text) {
		setTimeout(() => {
			updateBadgeImageFromMana();
			updatePTImageFromMana();
			updateSquareColorsFromMana();
			stationEdited();
		}, 100);
	} else {
		stationEdited();
	}
}

function getStationResetState() {
	return {
		badgeValues: card.station?.badgeValues ? [...card.station.badgeValues] : ['', '', ''],
		disableFirstAbility: card.station?.disableFirstAbility
	};
}

function restoreStationResetState(resetState) {
	card.station.badgeValues = resetState.badgeValues;
	
	if (resetState.disableFirstAbility !== undefined) {
		card.station.disableFirstAbility = resetState.disableFirstAbility;
	}
}

function resetStationSettings() {
	const resetState = getStationResetState();
	
	clearStationListeners();
	
	delete card.station;
	initializeStationDefaults();
	restoreStationResetState(resetState);
	
	setupStationListeners();
	
	fixStationInputs(refreshStationAfterReset);
}
