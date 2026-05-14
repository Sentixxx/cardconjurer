//URL Params
var params = new URLSearchParams(window.location.search);
const debugging = params.get('debug') != null;
if (debugging) {
	alert('debugging - 4.0');
	document.querySelectorAll('.debugging').forEach(element => element.classList.remove('hidden'));
}

// Creator compatibility helpers are generated into dist/js/creator-23.js from
// src/creator/* modules by scripts/build.mjs.
function setImageUrl(image, source) {
	image.crossOrigin = 'anonymous';
	image.src = fixUri(source);
}
function createAnonymousImage(source) {
	const image = new Image();
	setImageUrl(image, source);
	return image;
}
function createImageWithLoadHandler(source, onload) {
	const image = new Image();
	image.onload = onload;
	image.src = source;
	return image;
}

const baseWidth = 1500;
const baseHeight = 2100;
const highResScale = 1.34;
// function getStandardWidth() {
// 	var value = baseWidth;
// 	if (localStorage.getItem('high-res') == 'true') {
// 		value *= highResScale;
// 	}
// 	return value;
// }
// function getStandardHeight() {
// 	var value = baseHeight;
// 	if (localStorage.getItem('high-res') == 'true') {
// 		value *= highResScale;
// 	}
// 	return value;
// }
function getStandardWidth() {
	return 2010;
}
function getStandardHeight() {
	return 2814;
}

function isTrackableImageSource(src) {
	return Boolean(src) && !src.includes('blank.png');
}

function createTrackedImagePromise(src) {
	return new Promise((resolve) => {
		const img = new Image();
		img.crossOrigin = 'anonymous';
		// Resolve the promise on load.
		img.onload = () => resolve(img);
		// Also resolve on error to prevent Promise.all from failing on a single broken image.
		// The app's own error handlers will manage displaying a blank image.
		img.onerror = () => {
			console.warn(`Could not load tracked image: ${src}`);
			resolve(null);
		};
		img.src = src;
	});
}
const frameAssetPreloadTimeoutMs = 30000;
const frameAssetSlowNoticeMs = 3000;
const frameAssetVerySlowNoticeMs = 10000;
const frameAssetPreloadPromises = new Map();
let frameAssetAddBusy = false;
function preloadFrameAsset(src, timeoutMs = frameAssetPreloadTimeoutMs) {
	const fixedSrc = fixUri(src);
	if (!isFrameAssetPreloadable(fixedSrc)) {
		return Promise.resolve(null);
	}
	if (frameAssetPreloadPromises.has(fixedSrc)) {
		return frameAssetPreloadPromises.get(fixedSrc);
	}

	const promise = new Promise((resolve, reject) => {
		const image = new Image();
		let settled = false;
		const timeout = setTimeout(() => {
			if (settled) {
				return;
			}
			settled = true;
			reject(new Error(`Timed out loading frame asset: ${fixedSrc}`));
		}, timeoutMs);

		image.crossOrigin = 'anonymous';
		image.onload = () => {
			if (settled) {
				return;
			}
			settled = true;
			clearTimeout(timeout);
			resolve(image);
		};
		image.onerror = () => {
			if (settled) {
				return;
			}
			settled = true;
			clearTimeout(timeout);
			reject(new Error(`Failed to load frame asset: ${fixedSrc}`));
		};
		image.src = fixedSrc;
	});

	frameAssetPreloadPromises.set(fixedSrc, promise);
	promise.catch(() => frameAssetPreloadPromises.delete(fixedSrc));
	return promise;
}
function setFrameAddControlsBusy(isBusy) {
	frameAssetAddBusy = isBusy;
	['addToFull', 'addToRightHalf', 'addToLeftHalf', 'addToMiddleThird', 'addToTopHalf', 'addToBottomHalf'].forEach(id => {
		const button = document.getElementById(id);
		if (!button) {
			return;
		}
		if (!button.dataset.idleText) {
			button.dataset.idleText = button.textContent;
		}
		button.disabled = isBusy;
		button.textContent = isBusy ? '正在加载素材...' : button.dataset.idleText;
	});
}
async function waitForFrameAssetsReady(frame, showFeedback = false) {
	const sources = collectFrameAssetSources(frame);
	if (sources.length === 0) {
		return;
	}

	let slowNotice = null;
	let verySlowNotice = null;
	if (showFeedback) {
		setFrameAddControlsBusy(true);
		slowNotice = setTimeout(() => {
			notify('正在加载高清牌框素材，首次加载可能需要几秒。', 5);
		}, frameAssetSlowNoticeMs);
		verySlowNotice = setTimeout(() => {
			notify('牌框素材仍在加载。网络较慢时可以稍等，失败后可再次点击重试。', 8);
		}, frameAssetVerySlowNoticeMs);
	}

	try {
		await Promise.all(sources.map(source => preloadFrameAsset(source)));
	} catch (error) {
		console.warn(error);
		if (showFeedback) {
			notify('牌框素材加载失败。请检查网络后再次点击添加。', 8);
		}
		throw error;
	} finally {
		clearTimeout(slowNotice);
		clearTimeout(verySlowNotice);
		if (showFeedback) {
			setFrameAddControlsBusy(false);
		}
	}
}
function shouldWarmFrameAssets() {
	return !(navigator.connection && navigator.connection.saveData);
}
function warmSelectedFrameAssets() {
	if (!shouldWarmFrameAssets()) {
		return;
	}
	const frame = availableFrames[selectedFrameIndex];
	if (!frame) {
		return;
	}
	const selectedMask = selectedMaskIndex > 0 ? frame.masks?.[selectedMaskIndex - 1] : null;
	const sources = collectFrameAssetSources({
		src: frame.src,
		masks: selectedMask ? [selectedMask] : [],
	});
	sources.forEach(source => {
		preloadFrameAsset(source).catch(error => console.warn(error));
	});
}

// Trackers for bulk download
window.ImageLoadTracker = {
    promises: [],
    isTracking: false,

    // Call this to start a new tracking session.
    start: function() {
        this.promises = [];
        this.isTracking = true;
    },

    // Call this to end the session.
    stop: function() {
        this.isTracking = false;
        this.promises = [];
    },

    /**
     * Creates a promise that resolves when the image from 'src' is loaded.
     * Adds this promise to the tracking array.
     * @param {string} src - The source URL of the image to load.
     */
    track: function(src) {
        // Only track if a session is active and the src is valid.
        if (!this.isTracking || !isTrackableImageSource(src)) {
            return;
        }

        this.promises.push(createTrackedImagePromise(src));
    },

    /**
     * Returns a single promise that resolves when all tracked images have finished loading.
     */
    waitForAll: function() {
        return Promise.all(this.promises);
    }
};
window.FontLoadTracker = {
    fonts: new Set(),
    isTracking: false,

    // Call this to start a new font tracking session.
    start: function() {
        this.fonts.clear();
        this.isTracking = true;
    },

    // Call this to end the session.
    stop: function() {
        this.isTracking = false;
        this.fonts.clear();
    },

    /**
     * Adds a font family to the set of required fonts for the current card.
     * @param {string} fontFamily - The name of the font family to track (e.g., 'belerenbsc').
     */
    track: function(fontFamily) {
        if (this.isTracking && fontFamily) {
            this.fonts.add(fontFamily);
        }
    },

    /**
     * Uses the document.fonts API to wait for all tracked fonts to be loaded and ready.
     * @returns {Promise} A promise that resolves when all fonts in the set are available.
     */
    waitForAll: function() {
        if (this.fonts.size === 0) {
            return Promise.resolve(); // No fonts to wait for.
        }

        console.log('Waiting for fonts to load:', Array.from(this.fonts));
        return ensureFontsReady(this.fonts);
    }
};
async function ensureFontsReady(fonts) {
	if (!document.fonts || !fonts) {
		return;
	}

	const uniqueFonts = normalizeFontFamilies(fonts);
	await Promise.all(uniqueFonts.map(font => document.fonts.load(fontLoadDeclaration(font)).catch(error => {
		console.warn(`Font failed to load: ${font}`, error);
		return null;
	})));
}
async function ensureTextFontsReady(textObjects = []) {
	await ensureFontsReady(collectTextObjectsFonts(textObjects));
}
const jsZipScriptUrl = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';

//card object
var card = {width:getStandardWidth(), height:getStandardHeight(), marginX:0, marginY:0, frames:[], artSource:fixUri('/img/blank.png'), artX:0, artY:0, artZoom:1, artRotate:0, setSymbolSource:fixUri('/img/blank.png'), setSymbolX:0, setSymbolY:0, setSymbolZoom:1, watermarkSource:fixUri('/img/blank.png'), watermarkX:0, watermarkY:0, watermarkZoom:1, watermarkLeft:'none', watermarkRight:'none', watermarkOpacity:0.4, version:'', manaSymbols:[]};
window.cardDrawingPromiseResolver = null;
//core images/masks
const black = createAnonymousImage('/img/black.png');
const blank = createAnonymousImage('/img/blank.png');
const right = createAnonymousImage('/img/frames/maskRightHalf.png');
const middle = createAnonymousImage('/img/frames/maskMiddleThird.png');
const corner = createAnonymousImage('/img/frames/cornerCutout.png');
const serial = createAnonymousImage('/img/frames/serial.png');
//art
art = createAnonymousImage(blank.src);
art.onerror = function() {if (!this.src.includes('/img/blank.png')) {this.src = fixUri('/img/blank.png');}}
art.onload = artEdited;
//set symbol
setSymbol = createAnonymousImage(blank.src);
setSymbol.onerror = function() {
	if (this.src.includes('gatherer.wizards.com')) {
		notify('<a target="_blank" href="http' + this.src.split('http')[2] + '">Loading the set symbol from Gatherer failed. Please check this link to see if it exists. If it does, it may be necessary to manually download and upload the image.</a>', 5);
	}
	if (!this.src.includes('/img/blank.png')) {this.src = fixUri('/img/blank.png');}
}
setSymbol.onload = setSymbolEdited;
//watermark
watermark = createAnonymousImage(blank.src);
watermark.onerror = function() {if (!this.src.includes('/img/blank.png')) {this.src = fixUri('/img/blank.png');}}
watermark.onload = watermarkEdited;
//preview canvas
var previewCanvas = document.querySelector('#previewCanvas');
var previewContext = previewCanvas.getContext('2d');
var canvasList = [];
//frame/mask picker stuff
var availableFrames = [];
var selectedFrame = null;
var selectedFrameIndex = 0;
var selectedMaskIndex = 0;
var selectedTextIndex = 0;
var replacementMasks = {};
var customCount = 0;
var lastFrameClick = null;
var lastMaskClick = null;
//for imports
var scryfallArt;
var scryfallCard;
//for text
var drawTextBetweenFrames = false;
var redrawFrames = false;
var savedTextXPosition = 0;
var savedTextXPosition2 = 0;
var savedRollYPosition = null;
var savedFont = null;
var savedTextContents = {};
//for misc
var date = new Date();
card.infoYear = date.getFullYear();
document.querySelector("#info-year").value = card.infoYear;
//to avoid rerunning special scripts (planeswalker, saga, etc...)

var loadedVersions = [];
//Card Object managament
async function resetCardIrregularities({canvas = [getStandardWidth(), getStandardHeight(), 0, 0], resetOthers = true} = {}) {
	//misc details
	card.margins = false;
	card.bottomInfoTranslate = {x:0, y:0};
	card.bottomInfoRotate = 0;
	card.bottomInfoZoom = 1;
	card.bottomInfoColor = 'white';
	replacementMasks = {};
	//rotation
	if (card.landscape) {
		// previewContext.scale(card.width/card.height, card.height/card.width);
		// previewContext.rotate(Math.PI / 2);
		// previewContext.translate(0, -card.width / 2);
		previewContext.setTransform(1, 0, 0, 1, 0, 0);
		card.landscape = false;
	}
	//card size
	card.width = canvas[0];
	card.height = canvas[1];
	card.marginX = canvas[2];
	card.marginY = canvas[3];
	//canvases
	canvasList.forEach(name => {
		if (window[name + 'Canvas'].width != card.width * (1 + card.marginX) || window[name + 'Canvas'].height != card.height * (1 + card.marginY)) {
			sizeCanvas(name);
		}
	});
	if (resetOthers) {
		setBottomInfoStyle();
		//onload
		card.onload = null;

		card.hideBottomInfoBorder = false;
		card.showsFlavorBar = true;
	}
}
async function setBottomInfoStyle() {
	if (document.querySelector('#enableNewCollectorStyle').checked) {
			await loadBottomInfo({
				midLeft: {text:'{elemidinfo-set} \u2022 {elemidinfo-language}  {savex}{fontbelerenbsc}{fontsize' + scaleHeight(0.001) + '}{upinline' + scaleHeight(0.0005) + '}\uFFEE{savex2}{elemidinfo-artist}', x:0.0647, y:0.9548, width:0.8707, height:0.0171, oneLine:true, font:'gothammedium', size:0.0171, color:card.bottomInfoColor, outlineWidth:0.003},
				topLeft: {text:'{elemidinfo-rarity} {kerning3}{elemidinfo-number}{kerning0}', x:0.0647, y:0.9377, width:0.8707, height:0.0171, oneLine:true, font:'gothammedium', size:0.0171, color:card.bottomInfoColor, outlineWidth:0.003},
				note: {text:'{loadx}{elemidinfo-note}', x:0.0647, y:0.9377, width:0.8707, height:0.0171, oneLine:true, font:'gothammedium', size:0.0171, color:card.bottomInfoColor, outlineWidth:0.003},
				bottomLeft: {text:'NOT FOR SALE', x:0.0647, y:0.9719, width:0.8707, height:0.0143, oneLine:true, font:'gothammedium', size:0.0143, color:card.bottomInfoColor, outlineWidth:0.003},
				wizards: {name:'wizards', text:'{ptshift0,0.0172}\u2122 & \u00a9 {elemidinfo-year} Wizards of the Coast', x:0.0647, y:0.9377, width:0.8707, height:0.0167, oneLine:true, font:'mplantin', size:0.0162, color:card.bottomInfoColor, align:'right', outlineWidth:0.003},
				bottomRight: {text:'{ptshift0,0.0172}CardConjurer.com', x:0.0647, y:0.9548, width:0.8707, height:0.0143, oneLine:true, font:'mplantin', size:0.0143, color:card.bottomInfoColor, align:'right', outlineWidth:0.003}
			});
		} else {
			await loadBottomInfo({
				midLeft: {text:'{elemidinfo-set} \u2022 {elemidinfo-language}  {savex}{fontbelerenbsc}{fontsize' + scaleHeight(0.001) + '}{upinline' + scaleHeight(0.0005) + '}\uFFEE{savex2}{elemidinfo-artist}', x:0.0647, y:0.9548, width:0.8707, height:0.0171, oneLine:true, font:'gothammedium', size:0.0171, color: card.bottomInfoColor, outlineWidth:0.003},
				topLeft: {text:'{elemidinfo-number}', x:0.0647, y:0.9377, width:0.8707, height:0.0171, oneLine:true, font:'gothammedium', size:0.0171, color:card.bottomInfoColor, outlineWidth:0.003},
				note: {text:'{loadx2}{elemidinfo-note}', x:0.0647, y:0.9377, width:0.8707, height:0.0171, oneLine:true, font:'gothammedium', size:0.0171, color:card.bottomInfoColor, outlineWidth:0.003},
				rarity: {text:'{loadx}{elemidinfo-rarity}', x:0.0647, y:0.9377, width:0.8707, height:0.0171, oneLine:true, font:'gothammedium', size:0.0171, color:card.bottomInfoColor, outlineWidth:0.003},
				bottomLeft: {text:'NOT FOR SALE', x:0.0647, y:0.9719, width:0.8707, height:0.0143, oneLine:true, font:'gothammedium', size:0.0143, color:card.bottomInfoColor, outlineWidth:0.003},
				wizards: {name:'wizards', text:'{ptshift0,0.0172}\u2122 & \u00a9 {elemidinfo-year} Wizards of the Coast', x:0.0647, y:0.9377, width:0.8707, height:0.0167, oneLine:true, font:'mplantin', size:0.0162, color:card.bottomInfoColor, align:'right', outlineWidth:0.003},
				bottomRight: {text:'{ptshift0,0.0172}card.sentixx.top', x:0.0647, y:0.9548, width:0.8707, height:0.0143, oneLine:true, font:'mplantin', size:0.0143, color:card.bottomInfoColor, align:'right', outlineWidth:0.003}
			});
		}
}
//Canvas management
function sizeCanvas(name, width = Math.round(card.width * (1 + 2 * card.marginX)), height = Math.round(card.height * (1 + 2 * card.marginY))) {
	if (!window[name + 'Canvas']) {
		window[name + 'Canvas'] = document.createElement('canvas');
		window[name + 'Context'] = window[name + 'Canvas'].getContext('2d');
		canvasList[canvasList.length] = name;
	}
	window[name + 'Canvas'].width = width;
	window[name + 'Canvas'].height = height;
	if (name == 'line') { //force true to view all canvases - must restore to name == 'line' for proper kerning adjustments
		window[name + 'Canvas'].style = 'width: 20rem; height: 28rem; border: 1px solid red;';
		const label = document.createElement('div');
		label.innerHTML = name + '<br>If you can see this and don\'t want to, please clear your cache.';
		label.appendChild(window[name + 'Canvas']);
		label.classList = 'fake-hidden'; //Comment this out to view canvases
		document.body.appendChild(label);
	}
}
//create main canvases
sizeCanvas('card');
sizeCanvas('frame');
sizeCanvas('frameMasking');
sizeCanvas('frameCompositing');
sizeCanvas('text');
sizeCanvas('paragraph');
sizeCanvas('line');
sizeCanvas('watermark');
sizeCanvas('bottomInfo');
sizeCanvas('guidelines');
sizeCanvas('prePT');
//Scaling
function scaleX(input) {
	return Math.round((input + card.marginX) * card.width);
}
function scaleWidth(input) {
	return Math.round(input * card.width);
}
function scaleY(input) {
	return Math.round((input + card.marginY) * card.height);
}
function scaleHeight(input) {
	return Math.round(input * card.height);
}
//Other nifty functions
function getElementIndex(element) {
	return Array.prototype.indexOf.call(element.parentElement.children, element);
}
function getCardName() {
	if (card.text == undefined || card.text.title == undefined) {
		return 'unnamed';
	}
	var imageName = card.text.title.text || 'unnamed';
	if (card.text.nickname) {
		imageName += ' (' + card.text.nickname.text + ')';
	}
	return imageName.replace(/\{[^}]+\}/g, '');
}
function getInlineCardName() {
	if (card.text == undefined || card.text.title == undefined) {
		return 'unnamed';
	}
	var imageName = card.text.title.text || 'unnamed';
	if (card.text.nickname) {
		imageName = card.text.nickname.text;
	}
	return imageName.replace(/\{[^}]+\}/g, '');
}
//UI
function toggleCreatorTabs(event, target) {
	Array.from(document.querySelector('#creator-menu-sections').children).forEach(element => element.classList.add('hidden'));
	document.querySelector('#creator-menu-' + target).classList.remove('hidden');
	selectSelectable(event);
}
function selectSelectable(event) {
	var eventTarget = event.target.closest('.selectable');
	Array.from(eventTarget.parentElement.children).forEach(element => element.classList.remove('selected'));
	eventTarget.classList.add('selected');
}
function dragStart(event) {
	Array.from(document.querySelectorAll('.dragging')).forEach(element => element.classList.remove('dragging'));
	event.target.closest('.draggable').classList.add('dragging');
}
function dragEnd(event) {
	Array.from(document.querySelectorAll('.dragging')).forEach(element => element.classList.remove('dragging'));
}
function touchMove(event) {
	if (event.target.nodeName != 'H4') {
		event.preventDefault();
	}
	var clientX = event.touches[0].clientX;
	var clientY = event.touches[0].clientY;
	Array.from(document.querySelector('.dragging').parentElement.children).forEach(element => {
		var elementBounds = element.getBoundingClientRect();
		if (clientY > elementBounds.top && clientY < elementBounds.bottom) {
			dragOver(element, false);
		}
	})
}
function dragOver(event, drag=true) {
	var eventTarget;
	if (drag) {
		eventTarget = event.target.closest('.draggable');
	} else {
		eventTarget = event;
	}
	var movingElement = document.querySelector('.dragging');
	if (document.querySelector('.dragging') && !eventTarget.classList.contains('dragging') && eventTarget.parentElement == movingElement.parentElement) {
		var parentElement = eventTarget.parentElement;
		var elements = document.createDocumentFragment();
		var movingElementPassed = false;
		var movingElementOldIndex = -1;
		var movingElementNewIndex = -1;
		Array.from(parentElement.children).forEach((element, index) => {
			if (element == eventTarget) {
				movingElementNewIndex = index;
				if(movingElementPassed) {
					elements.appendChild(element.cloneNode(true));
					elements.appendChild(movingElement.cloneNode(true));
				} else {
					elements.appendChild(movingElement.cloneNode(true));
					elements.appendChild(element.cloneNode(true));
				}
			} else if(element != movingElement) {
				elements.appendChild(element.cloneNode(true));
			} else {
				movingElementOldIndex = index;
				movingElementPassed = true;
			}
		});
		Array.from(elements.children).forEach(element => {
			element.ondragstart = dragStart;
			element.ontouchstart = dragStart;
			element.ondragend = dragEnd;
			element.ontouchend = dragEnd;
			element.ondragover = dragOver;
			element.ontouchmove = touchMove;
			element.onclick = frameElementClicked;
			element.children[3].onclick = removeFrame;
		})
		parentElement.innerHTML = null;
		parentElement.appendChild(elements);
		if (movingElementNewIndex >= 0) {
			var originalMovingElement = card.frames[movingElementOldIndex];
			card.frames.splice(movingElementOldIndex, 1);
			card.frames.splice(movingElementNewIndex, 0, originalMovingElement);
			drawFrames();
		}
	}
}
//Set Symbols
const setSymbolAliases = new Map([
	["anb", "ana"],
	["tsb", "tsp"],
	["pmei", "sld"],
]);
//Mana Symbols
const mana = new Map();
// var manaSymbols = [];
loadManaSymbols(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
				 'w', 'u', 'b', 'r', 'g', 'c', 'x', 'y', 'z', 't', 'untap', 's', 'oldtap', 'originaltap', 'purple', "inf", "alchemy"]);
loadManaSymbols(true, ['e', 'a', 'p']);
loadManaSymbols(['wu', 'wb', 'ub', 'ur', 'br', 'bg', 'rg', 'rw', 'gw', 'gu', '2w', '2u', '2b', '2r', '2g', 'wp', 'up', 'bp', 'rp', 'gp', 'h',
				 'wup', 'wbp', 'ubp', 'urp', 'brp', 'bgp', 'rgp', 'rwp', 'gwp', 'gup', 'purplew', 'purpleu', 'purpleb', 'purpler', 'purpleg',
				 '2purple', 'purplep', 'cw', 'cu', 'cb', 'cr', 'cg'], [1.2, 1.2]);
loadManaSymbols(['bar.png', 'whitebar.png']);
loadManaSymbols(['brush', 'whitebrush'], [2.85, 2.85]);
loadManaSymbols(['xxbgw', 'xxbrg', 'xxgub', 'xxgwu', 'xxrgw', 'xxrwu', 'xxubr', 'xxurg', 'xxwbr', 'xxwub'], [1.2, 1.2]);
loadManaSymbols(true, ['chaos'], [1.2, 1]);
loadManaSymbols(true, ['tk'], [0.8, 1]);
loadManaSymbols(true, ['planeswalker'], [0.6, 1.2]);
loadManaSymbols(true, ['+1', '+2', '+3', '+4', '+5', '+6', '+7', '+8', '+9', '-1', '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '+0'], [1.6, 1]);
function loadManaSymbols(matchColor, manaSymbolPaths, size = [1, 1]) {
	if (typeof matchColor === 'object') {
		// Hacky way to add a default argument for matchColor without breaking the function call from other places
		size = manaSymbolPaths || [1,1];
		manaSymbolPaths = matchColor;
		matchColor = false;
	}

	manaSymbolPaths.forEach(item => {
		var manaSymbol = {};
		if (typeof item == 'string') {
			manaSymbol.name = item.split('.')[0];
			manaSymbol.path = item;
		} else {
			manaSymbol.name = item[0].split('.')[0];
			manaSymbol.path = item[0];
		}
		if (manaSymbol.name.includes('/')) {
			manaSymbol.name = manaSymbol.name.split('/');
			manaSymbol.name = manaSymbol.name[manaSymbol.name.length - 1];
		}
		if (typeof item != 'string') {
			manaSymbol.back = item[1];
			manaSymbol.backs = item[2];
			for (var i = 0; i < item[2]; i ++) {
				loadManaSymbols([manaSymbol.path.replace(manaSymbol.name, 'back' + i + item[1])])
			}
		}

		manaSymbol.matchColor = matchColor;

		manaSymbol.width = size[0];
		manaSymbol.height = size[1];
		var manaSymbolPath = '/img/manaSymbols/' + manaSymbol.path;
		// aliyun + -> ' '
		if (!manaSymbolPath.includes('.png')) {
			manaSymbolPath += '.svg';
		}
		manaSymbol.image = createAnonymousImage(manaSymbolPath);
		mana.set(manaSymbol.name, manaSymbol);
		// manaSymbols.push(manaSymbol);
	});
}
function findManaSymbolIndex(string) {
	return mana.get(key) || -1;
}
function getManaSymbol(key) {
	return mana.get(key);
}
//FRAME TAB
function drawFrames() {
	frameContext.clearRect(0, 0, frameCanvas.width, frameCanvas.height);
	var frameToDraw = card.frames.slice().reverse();
	var haveDrawnPrePTCanvas = false;
	frameToDraw.forEach(item => {
		if (item.image) {
			if (!haveDrawnPrePTCanvas && drawTextBetweenFrames && item.name.includes('Power/Toughness')) {
				haveDrawnPrePTCanvas = true;
				frameContext.globalCompositeOperation = 'source-over';
				frameContext.globalAlpha = 1;
				frameContext.drawImage(prePTCanvas, 0, 0, frameCanvas.width, frameCanvas.height);
			}
			frameContext.globalCompositeOperation = item.mode || 'source-over';
			frameContext.globalAlpha = item.opacity / 100 || 1;
			if (item.opacity == 0) {
				frameContext.globalAlpha = 0;
			}
			var bounds = item.bounds || {};
			var ogBounds = item.ogBounds || bounds;
			frameX = Math.round(scaleX(bounds.x || 0));
			frameY = Math.round(scaleY(bounds.y || 0));
			frameWidth = Math.round(scaleWidth(bounds.width || 1));
			frameHeight = Math.round(scaleHeight(bounds.height || 1));
			frameMaskingContext.globalCompositeOperation = 'source-over';
			frameMaskingContext.drawImage(black, 0, 0, frameMaskingCanvas.width, frameMaskingCanvas.height);
			frameMaskingContext.globalCompositeOperation = 'source-in';
			item.masks.forEach(mask => frameMaskingContext.drawImage(mask.image, scaleX((bounds.x || 0) - (ogBounds.x || 0) - ((ogBounds.x || 0) * ((bounds.width || 1) / (ogBounds.width || 1) - 1))), scaleY((bounds.y || 0) - (ogBounds.y || 0) - ((ogBounds.y || 0) * ((bounds.height || 1) / (ogBounds.height || 1) - 1))), scaleWidth((bounds.width || 1) / (ogBounds.width || 1)), scaleHeight((bounds.height || 1) / (ogBounds.height || 1))));
			if (item.preserveAlpha) { //preserves alpha, and blends colors using an alpha that only cares about the mask(s), and the user-set opacity value
				//draw the image onto a separate canvas to view its unaltered state
				frameCompositingContext.clearRect(0, 0, frameCanvas.width, frameCanvas.height);
				frameCompositingContext.drawImage(item.image, frameX, frameY, frameWidth, frameHeight);
				//create pixel arrays for the existing image, new image, and alpha mask
				var existingData = frameContext.getImageData(0, 0, frameCanvas.width, frameCanvas.height)
				var existingPixels = existingData.data;
				var newPixels = frameCompositingContext.getImageData(0, 0, frameCanvas.width, frameCanvas.height).data;
				var maskPixels = frameMaskingContext.getImageData(0, 0, frameCanvas.width, frameCanvas.height).data;
				const functionalAlphaMultiplier = frameContext.globalAlpha / 255;
				//manually blends colors, basing blending-alpha on the masks and desired draw-opacity, but preserving alpha
				for (var i = 0; i < existingPixels.length; i += 4) {
					const functionalAlpha = maskPixels[i + 3] * functionalAlphaMultiplier //functional alpha = alpha ignoring source image
					if (newPixels[i + 3] > 0) { //Only blend if the new image has alpha
						existingPixels[  i  ] = existingPixels[  i  ] * (1 - functionalAlpha) + newPixels[  i  ] * functionalAlpha; //RED
						existingPixels[i + 1] = existingPixels[i + 1] * (1 - functionalAlpha) + newPixels[i + 1] * functionalAlpha; //GREEN
						existingPixels[i + 2] = existingPixels[i + 2] * (1 - functionalAlpha) + newPixels[i + 2] * functionalAlpha; //BLUE
					}
				}
				frameContext.putImageData(existingData, 0, 0);
			} else {
				//mask the image
				frameMaskingContext.drawImage(item.image, frameX, frameY, frameWidth, frameHeight);
				//color overlay
				if (item.colorOverlayCheck) {frameMaskingContext.globalCompositeOperation = 'source-in'; frameMaskingContext.fillStyle = item.colorOverlay; frameMaskingContext.fillRect(0, 0, frameMaskingCanvas.width, frameMaskingCanvas.height);}
				//HSL adjustments
				if (item.hslHue || item.hslSaturation || item.hslLightness) {
					hsl(frameMaskingCanvas, item.hslHue || 0, item.hslSaturation || 0, item.hslLightness || 0);
				}
				//erase mode
				if (item.erase) {frameContext.globalCompositeOperation = 'destination-out';}
				frameContext.drawImage(frameMaskingCanvas, 0, 0, frameCanvas.width, frameCanvas.height);
			}
		}
	});
	if (!haveDrawnPrePTCanvas && drawTextBetweenFrames) {
		haveDrawnPrePTCanvas = true;
		frameContext.globalCompositeOperation = 'source-over';
		frameContext.globalAlpha = 1;
		frameContext.drawImage(prePTCanvas, 0, 0, frameCanvas.width, frameCanvas.height);
	}
	drawCard();
}
function loadFramePacks(framePackOptions = []) {
	document.querySelector('#selectFramePack').innerHTML = null;
	framePackOptions.forEach(item => {
		var framePackOption = document.createElement('option');
		framePackOption.innerHTML = item.name;
		if (item.value == 'disabled') {
			framePackOption.disabled = true;
		} else {
			framePackOption.value = item.value;
		}
		document.querySelector('#selectFramePack').appendChild(framePackOption);
	});
	loadScript("/js/frames/pack" + document.querySelector('#selectFramePack').value + ".js");
}
function loadFramePack(frameOptions = availableFrames) {
	resetDoubleClick();
	document.querySelector('#frame-picker').innerHTML = null;
	frameOptions.forEach(item => {
		var frameOption = document.createElement('div');
		frameOption.classList = 'frame-option hidden';
		frameOption.onclick = frameOptionClicked;
		var frameOptionImage = document.createElement('img');
		frameOption.appendChild(frameOptionImage);
		frameOptionImage.onload = function() {
			this.parentElement.classList.remove('hidden');
		}
		if (!item.noThumb && !item.src.includes('/img/black.png')) {
			frameOptionImage.src = fixUri(item.src.replace('.png', 'Thumb.png').replace('.svg', 'Thumb.png'));
		} else {
			frameOptionImage.src = fixUri(item.src);
		}
		document.querySelector('#frame-picker').appendChild(frameOption);

	})
	document.querySelector('#mask-picker').innerHTML = '';
	document.querySelector('#frame-picker').children[0].click();
	if (localStorage.getItem('autoLoadFrameVersion') == 'true') {
		document.querySelector('#loadFrameVersion').click();
	}
}
function autoLoadFrameVersion() {
	localStorage.setItem('autoLoadFrameVersion', document.querySelector('#autoLoadFrameVersion').checked);
}
function frameOptionClicked(event) {
	const button = doubleClick(event, 'frame');
	const clickedFrameOption = event.target.closest('.frame-option');
	const newFrameIndex = getElementIndex(clickedFrameOption);
	if (newFrameIndex != selectedFrameIndex || document.querySelector('#mask-picker').innerHTML == '') {
		resetDoubleClick();
		Array.from(document.querySelectorAll('.frame-option.selected')).forEach(element => element.classList.remove('selected'));
		clickedFrameOption.classList.add('selected');
		selectedFrameIndex = newFrameIndex;
		if (!availableFrames[selectedFrameIndex].noDefaultMask) {
			document.querySelector('#mask-picker').innerHTML = '<div class="mask-option" onclick="maskOptionClicked(event)"><img src="' + black.src + '"><p>No Mask</p></div>';
		} else {
			document.querySelector('#mask-picker').innerHTML = '';
		}
		document.querySelector('#selectedPreview').innerHTML = '(Selected: ' + availableFrames[selectedFrameIndex].name + ', No Mask)';
		if (availableFrames[selectedFrameIndex].masks) {
			availableFrames[selectedFrameIndex].masks.forEach(item => {
				const maskOption = document.createElement('div');
				maskOption.classList = 'mask-option hidden';
				maskOption.onclick = maskOptionClicked;
				const maskOptionImage = document.createElement('img');
				maskOption.appendChild(maskOptionImage);
				maskOptionImage.onload = function() {
					this.parentElement.classList.remove('hidden');
				}
				maskOptionImage.src = fixUri(item.src.replace('.png', 'Thumb.png').replace('.svg', 'Thumb.png'));
				const maskOptionLabel = document.createElement('p');
				maskOptionLabel.innerHTML = item.name;
				maskOption.appendChild(maskOptionLabel);
				document.querySelector('#mask-picker').appendChild(maskOption);
			});
		}
		const firstChild = document.querySelector('#mask-picker').firstChild;
		firstChild.classList.add('selected');
		firstChild.click();
	} else if (button) { button.click(); resetDoubleClick(); }
}
function maskOptionClicked(event) {
	var button = doubleClick(event, 'mask');
	const clickedMaskOption = event.target.closest('.mask-option');
	(document.querySelector('.mask-option.selected').classList || document.querySelector('body').classList).remove('selected');
	clickedMaskOption.classList.add('selected');
	const newMaskIndex = getElementIndex(clickedMaskOption)
	if (newMaskIndex != selectedMaskIndex) { button = null; }
	selectedMaskIndex = newMaskIndex;
	var selectedMaskName = 'No Mask'
	if (selectedMaskIndex > 0) {selectedMaskName = availableFrames[selectedFrameIndex].masks[selectedMaskIndex - 1].name;}
	document.querySelector('#selectedPreview').innerHTML = '(Selected: ' + availableFrames[selectedFrameIndex].name + ', ' + selectedMaskName + ')';
	warmSelectedFrameAssets();
	if (button) { button.click(); resetDoubleClick(); }
}
function resetDoubleClick() {
	lastFrameClick, lastMaskClick = null, null;
}
function doubleClick(event, maskOrFrame) {
	const currentClick = (new Date()).getTime();
	var lastClick = null;
	if (maskOrFrame == 'mask') {
		lastClick = lastMaskClick;
		lastMaskClick = currentClick;
	} else {
		lastClick = lastFrameClick + 0;
		lastFrameClick = currentClick + 0;
	}
	if (lastClick && lastClick + 500 > currentClick) {
		var buttonID = null;
		if (event.shiftKey) {
			buttonID = '#addToRightHalf';
		} else if (event.ctrlKey) {
			buttonID = '#addToLeftHalf';
		} else if (event.altKey) {
			buttonID = '#addToMiddleThird';
		} else {
			buttonID = '#addToFull';
		}
		return document.querySelector(buttonID);
	}
	return null;
}
function cardFrameProperties(colors, manaCost, typeLine, power, style) {
	var colors = colors.map(color => color.toUpperCase())
	if ([
			['U', 'W'],
			['B', 'W'],
			['R', 'B'],
			['G', 'B'],
			['B', 'U'],
			['R', 'U'],
			['G', 'R'],
			['W', 'R'],
			['W', 'G'],
			['U', 'G']
		].map(arr => JSON.stringify(arr) === JSON.stringify(colors)).includes(true)) {
		colors.reverse();
	}

	var isHybrid = manaCost.includes('/');
	var isDevoid = colors.includes('D');
	colors = colors.filter(color => color != 'D');
	var rules;
	if (style == 'Seventh') {
		if (typeLine.includes('Land') || typeLine.includes("地")) {
			if (colors.length == 0 || colors.length > 2) {
				rules = 'L';
			} else {
				rules = colors[0] + 'L';
			}
		} else {
			if (colors.length == 1) {
				rules = colors[0];
			} else if (colors.length >=2 ) {
				rules = 'M';
			} else if (typeLine.includes("Artifact") || typeLine.includes("神器")) {
				rules = 'A';
			} else {
				rules = 'C';
			}
		}

	} else {
		if (typeLine.includes('Land') || typeLine.includes("地")) {
			if (colors.length == 0) {
				rules = 'L';
			} else if (colors.length > 2) {
				rules = 'ML';
			} else {
				rules = colors[0] + 'L';
			}
		} else if (colors.length > 2) {
			if (style == 'Etched' && (typeLine.includes('Artifact')|| typeLine.includes("神器"))) {
				rules = 'A';
			} else {
				rules = 'M';
			}
		} else if (colors.length != 0) {
			rules = colors[0];
		} else if (style == 'Borderless' && !typeLine.includes('Artifact') && !typeLine.includes("神器")) {
			rules = 'C';
		} else {
			rules = 'A';
		}
	}

	var rulesRight;
	if (colors.length == 2) {
		if (typeLine.includes('Land') || typeLine.includes("地")) {
			rulesRight = colors[1] + 'L';
		} else if (style != 'Seventh') {
			rulesRight = colors[1];
		}
	}

	var pinline = rules;
	var pinlineRight = rulesRight;

	if (style == 'Seventh' && (typeLine.includes('Land') || typeLine.includes("地")) && colors.length >= 2) {
		pinline = 'L';
		pinlineRight = null;
	}

	var typeTitle;
	if (colors.length >= 2) {
		if (isHybrid || typeLine.includes('Land') || typeLine.includes("地")) {
			if (colors.length >= 3) {
				typeTitle = 'M';
			} else {
				typeTitle = 'L';
			}
		} else {
			typeTitle = 'M';
		}
	} else if (typeLine.includes('Land') || typeLine.includes("地")) {
		if (colors.length == 0) {
			typeTitle = 'L';
		} else if (style == 'Etched') {
			if (colors.length > 2) {
				typeTitle = 'M';
			} else if (colors.length == 1) {
				typeTitle = colors[0];
			} else {
				typeTitle = 'L';
			}
		} else {
			typeTitle = colors[0] + 'L';
		}
	} else if (colors.length == 1) {
		typeTitle = colors[0];
	} else if (style == 'Borderless' && !typeLine.includes('Artifact') && !typeLine.includes("神器")) {
		typeTitle = 'C';
	} else {
		typeTitle = 'A';
	}

	var pt;
	if (power) {
		if (typeLine.includes('Vehicle') || typeLine.includes("载具")) {
			pt = 'V';
		} else if (typeTitle == 'L') {
			pt = 'C';
		} else {
			pt = typeTitle;
		}
	}

	var frame;
	if (style == 'Seventh') {
		if (typeLine.includes('Land') || typeLine.includes("地")) {
			frame = 'L'
		} else {
			frame = pinline;
		}
	} else if (typeLine.includes('Land') || typeLine.includes("地")) {
		if (style == 'Etched') {
			if (colors.length > 2) {
				frame = 'M';
			} else if (colors.length > 0) {
				frame = colors[0];
			} else {
				frame = 'L';
			}
		} else {
			frame = 'L';
		}
	} else if (typeLine.includes('Vehicle') || typeLine.includes("载具")) {
		frame = 'V';
	} else if (typeLine.includes('Artifact') || (typeLine.includes("神器") && !typeLine.includes("神器师"))) {
		frame = 'A';
	} else if (colors.length > 2) {
		frame = 'M';
	} else if (colors.length == 2) {
		if (isHybrid || style == 'Etched') {
			frame = colors[0];
		} else {
			frame = 'M';
		}
	} else if (colors.length == 1) {
		frame = colors[0];
	} else {
		frame = 'L';
	}

	var frameRight;
	if (!(typeLine.includes('Vehicle') || typeLine.includes('Artifact')|| typeLine.includes("神器"))) {
		if (colors.length == 2 && (isHybrid || style == 'Etched')) {
			frameRight = colors[1];
		}
	}
	if(isDevoid) {
		colors = colors.filter(color => color != 'D');
		pinline = 'C';
		pinlineRight = null;
		rules = 'C';
		rulesRight = null;
		if(power)
			pt = 'C';
		frame = 'C';
		frameRight = null; 
		// console.log(pinline, pinlineRight, rules, rulesRight, pt, frame, frameRight)
	}

	return {
		'pinline': pinline,
		'pinlineRight': pinlineRight,
		'rules': rules,
		'rulesRight': rulesRight,
		'typeTitle': typeTitle,
		'pt': pt,
		'frame': frame,
		'frameRight': frameRight
	}
}

function setAutoframeNyx(value) {
	localStorage.setItem('autoframe-always-nyx', document.querySelector('#autoframe-always-nyx').checked);
	setAutoFrame();
}

var autoFramePack;
function autoFrame() {
	var frame = document.querySelector('#autoFrame').value;
	if (frame == 'false') { autoFramePack = null; return; }
	var colors = [];
	var types = card.text.type.text.toLowerCase();
	var rules = card.text.rules.text.toLowerCase();
	var name = card.text.title.text.toLowerCase();
	if(name != "") {
		for(var i = 0; i < rules.length - name.length; i++) {
			//replace cardname with CARDNAME in rules
			if (rules.slice(i, i + name.length) == name) {
				rules = rules.slice(0, i) + '{CARDNAME}' + rules.slice(i + name.length);
				i += 7;
			}
		}
	}
	if (card.text.type.text.toLowerCase().includes('land')) {
		var flavorIndex = rules.indexOf('{flavor}');
		if (flavorIndex == -1) {
			flavorIndex = rules.indexOf('{oldflavor}');
		}
		if (flavorIndex != -1) {
			rules = rules.substring(0, flavorIndex);
		}


		var lines = rules.split('\n');

		lines.forEach(function(line) {
			var addIndex = line.indexOf('Add');
			var length = 3;
			if (addIndex == -1) {
				addIndex = line.toLowerCase().indexOf(' add');
				length = 4;
			}
			if (addIndex != -1) {
				var upToAdd = line.substring(addIndex+length).toLowerCase();
              	['W', 'U', 'B', 'R', 'G'].forEach(function (color) {
					if (upToAdd.includes('{' + color.toLowerCase() + '}')) {
                  		colors.push(color);
                	}
                });
			}
		});
		var cslines = rules.split('\n');
		cslines.forEach(function(line) {
			var addIndex = line.indexOf('加');
			var length = 1;
			if (addIndex != -1) {
				var upToAdd = line.substring(addIndex+length).toLowerCase();
				// console.log(upToAdd);
              	['W', 'U', 'B', 'R', 'G'].forEach(function (color) {
					if (upToAdd.includes('{' + color.toLowerCase() + '}')) {
                  		colors.push(color);
                	}
                });
			}
		});
		//console.log("pre:" + colors);
		if (!colors.includes('W') && (rules.toLowerCase().includes('plains') || types.includes('plains') || rules.toLowerCase().includes('平原') || types.includes('平原'))) {
			colors.push('W');
		}
		if (!colors.includes('U') && (rules.toLowerCase().includes('island') || types.includes('island') || rules.toLowerCase().includes('海岛') || types.includes('海岛'))) {
			colors.push('U');
		}
		if (!colors.includes('B') && (rules.toLowerCase().includes('swamp') || types.includes('swamp') || rules.toLowerCase().includes('沼泽') || types.includes('沼泽'))) {
			colors.push('B');
		}
		if (!colors.includes('R') && (rules.toLowerCase().includes('mountain') || types.includes('mountain') || rules.toLowerCase().includes('山脉') || types.includes('山脉'))) {
			colors.push('R');
		}
		if (!colors.includes('G') && (rules.toLowerCase().includes('forest') || types.includes('forest') || rules.toLowerCase().includes('树林') || types.includes('树林'))) {
			colors.push('G');
		}
		// console.log("color:" + colors);
		if ((rules.toLowerCase().includes('search') || rules.toLowerCase().includes('搜寻')) && colors.length == 0) {
			// TODO: This doesn't match Bog Wreckage
			if ((rules.includes('into your hand') || rules.includes('置于你手上')) || 
			(
				(rules.includes('tapped') && !(rules.toLowerCase().includes('enters the battlefield tapped')) && !(rules.toLowerCase().includes('untap'))) || 
				(rules.includes('横置') && !(rules.toLowerCase().includes('横置进入战场')) && !(rules.toLowerCase().includes('重置')))
			)) {
				colors = [];
			} else if (colors.length == 0) {
				colors = ['W', 'U', 'B', 'R', 'G'];
			}
		}
		if (rules.includes('any color') || rules.includes('any one color') || rules.includes('choose a color') || rules.includes('any combination of colors')) {
			colors = ['W', 'U', 'B', 'R', 'G'];
		}
		if (rules.includes('任意颜色') || rules.includes('任意颜色的单色') || rules.includes('选择一种颜色') || rules.includes('其颜色组合由你选择')) {
			colors = ['W', 'U', 'B', 'R', 'G'];
		}

	} else {
		colors = [...new Set(card.text.mana.text.toUpperCase().split('').filter(char => ['W', 'U', 'B', 'R', 'G'].includes(char)))];
		if(rules.toLowerCase().includes('devoid') || rules.toLowerCase().includes('虚色')) {
			colors = [];
		}
	}
	
	

	var group;
	if (frame == 'M15Regular-1') {
		autoM15Frame(colors, card.text.mana.text, card.text.type.text, card.text.pt.text);
		group = 'Standard-3';
	} else if (frame == 'M15RegularNew') {
		autoM15NewFrame(colors, card.text.mana.text, card.text.type.text, card.text.pt.text);
		group = 'Accurate';
	} else if (frame == 'Etched') {
		group = 'Showcase-5';
		autoEtchedFrame(colors, card.text.mana.text, card.text.type.text, card.text.pt.text);
	} else if (frame == 'M15BoxTopper') {
		group = 'Showcase-5';
		autoExtendedArtFrame(colors, card.text.mana.text, card.text.type.text, card.text.pt.text, false);
	} else if (frame == '8th') {
		group = 'Misc-2';
		auto8thEditionFrame(colors, card.text.mana.text, card.text.type.text, card.text.pt.text, false);
	} if (frame == 'M15Eighth') {
		autoM15EighthFrame(colors, card.text.mana.text, card.text.type.text, card.text.pt.text);
		group = 'Custom';
	} else if (frame == 'M15EighthUB') {
		autoM15EighthUBFrame(colors, card.text.mana.text, card.text.type.text, card.text.pt.text);
		group = 'Custom';
	} else if (frame == 'UB') {
		autoUBFrame(colors, card.text.mana.text, card.text.type.text, card.text.pt.text);
		group = 'Showcase-5';
	} else if (frame == 'UBNew') {
		autoUBNewFrame(colors, card.text.mana.text, card.text.type.text, card.text.pt.text);
		group = 'Accurate';
	} else if (frame == 'FullArtNew') {
		autoFullArtNewFrame(colors, card.text.mana.text, card.text.type.text, card.text.pt.text);
		group = 'Accurate';
	} else if (frame == 'Circuit') {
		autoCircuitFrame(colors, card.text.mana.text, card.text.type.text, card.text.pt.text);
		group = 'Custom';
	} else if (frame == 'Etched') {
		group = 'Showcase-5';
		autoEtchedFrame(colors, card.text.mana.text, card.text.type.text, card.text.pt.text);
	} else if (frame == 'Praetors') {
		group = 'Showcase-5';
		autoPhyrexianFrame(colors, card.text.mana.text, card.text.type.text, card.text.pt.text);
	} else if (frame == 'Seventh') {
		group = 'Misc-2';
		autoSeventhEditionFrame(colors, card.text.mana.text, card.text.type.text, card.text.pt.text);
	} else if (frame == 'M15BoxTopper') {
		group = 'Showcase-5';
		autoExtendedArtFrame(colors, card.text.mana.text, card.text.type.text, card.text.pt.text, false);
	} else if (frame == 'M15ExtendedArtShort') {
		group = 'Showcase-5';
		autoExtendedArtFrame(colors, card.text.mana.text, card.text.type.text, card.text.pt.text, true);
	} else if (frame == '8th') {
		group = 'Misc-2';
		auto8thEditionFrame(colors, card.text.mana.text, card.text.type.text, card.text.pt.text);
	} else if (frame == 'Borderless') {
		group = 'Showcase-5';
		autoBorderlessFrame(colors, card.text.mana.text, card.text.type.text, card.text.pt.text);
	} else if (frame == 'BorderlessUB') {
		group = 'Showcase-5';
		autoBorderlessUBFrame(colors, card.text.mana.text, card.text.type.text, card.text.pt.text);
		frame = 'Borderless';
	}

	if (autoFramePack != frame) {
		loadScript('/js/frames/pack' + frame + '.js');
		autoFramePack = frame;
	}
	textEdited('autoFrame');
}
async function autoUBFrame(colors, mana_cost, type_line, power) {
	var frames = card.frames.filter(frame => frame.name.includes('Extension') || frame.name.includes('Gray Holo Stamp') || frame.name.includes('Gold Holo Stamp'));

	//clear the draggable frames
	card.frames = [];
	document.querySelector('#frame-list').innerHTML = null;

	var properties = cardFrameProperties(colors, mana_cost, type_line, power);

	var style = false;
	if (type_line.toLowerCase().includes('enchantment creature') || type_line.toLowerCase().includes('enchantment artifact') || (document.querySelector('#autoframe-always-nyx').checked && (type_line.toLowerCase().includes('enchantment') || type_line.toLowerCase().includes('结界')))) {
		style = 'Nyx';
	}

	// Set frames

	if (type_line.toLowerCase().includes('legendary') || type_line.includes('传奇')) {
		if (style == 'Nyx') {
			if (properties.pinlineRight) {
				frames.push(makeUBFrameByLetter(properties.pinlineRight, 'Inner Crown', true, style));
			}
			frames.push(makeUBFrameByLetter(properties.pinline, 'Inner Crown', false, style));
		}

		if (properties.pinlineRight) {
			frames.push(makeUBFrameByLetter(properties.pinlineRight, 'Crown', true, style));
		}
		frames.push(makeUBFrameByLetter(properties.pinline, "Crown", false, style));
		frames.push(makeUBFrameByLetter(properties.pinline, "Crown Border Cover", false, style));
	}
	if (properties.pinlineRight) {
		frames.push(makeUBFrameByLetter(properties.pinlineRight, 'Stamp', true, style));
	}
	frames.push(makeUBFrameByLetter(properties.pinline, "Stamp", false, style));
	if (properties.pt) {
		frames.push(makeUBFrameByLetter(properties.pt, 'PT', false, style));
	}
	if (properties.pinlineRight) {
		frames.push(makeUBFrameByLetter(properties.pinlineRight, 'Pinline', true, style));
	}
	frames.push(makeUBFrameByLetter(properties.pinline, 'Pinline', false, style));
	frames.push(makeUBFrameByLetter(properties.typeTitle, 'Type', false, style));
	frames.push(makeUBFrameByLetter(properties.typeTitle, 'Title', false, style));
	if (properties.pinlineRight) {
		frames.push(makeUBFrameByLetter(properties.rulesRight, 'Rules', true, style));
	}
	frames.push(makeUBFrameByLetter(properties.rules, 'Rules', false, style));
	if (properties.frameRight) {
		frames.push(makeUBFrameByLetter(properties.frameRight, 'Frame', true, style));
	}
	frames.push(makeUBFrameByLetter(properties.frame, 'Frame', false, style));
	frames.push(makeUBFrameByLetter(properties.frame, 'Border', false, style));

	if (card.text.pt && type_line.includes('Vehicle') && !card.text.pt.text.includes('fff')) {
		card.text.pt.text = '{fontcolor#fff}' + card.text.pt.text;
	}

	card.frames = frames;
	card.frames.reverse();
	await card.frames.forEach(item => addFrame([], item));
	card.frames.reverse();
}
async function autoUBNewFrame(colors, mana_cost, type_line, power) {
	autoM15NewFrame(colors, mana_cost, type_line, power, 'ub');
}
async function autoFullArtNewFrame(colors, mana_cost, type_line, power) {
	autoM15NewFrame(colors, mana_cost, type_line, power, 'fullart');
}
async function autoCircuitFrame(colors, mana_cost, type_line, power) {
	var frames = card.frames.filter(frame => frame.name.includes('Extension') || frame.name.includes('Gray Holo Stamp') || frame.name.includes('Gold Holo Stamp'));

	//clear the draggable frames
	card.frames = [];
	document.querySelector('#frame-list').innerHTML = null;

	var properties = cardFrameProperties(colors, mana_cost, type_line, power);

	// Set frames

	if (type_line.toLowerCase().includes('legendary')) {
		if (properties.pinlineRight) {
			frames.push(makeCircuitFrameByLetter(properties.pinlineRight, 'Crown', true));
		}
		frames.push(makeCircuitFrameByLetter(properties.pinline, "Crown", false));
		frames.push(makeCircuitFrameByLetter(properties.pinline, "Crown Border Cover", false));
	}
	if (properties.pt) {
		frames.push(makeCircuitFrameByLetter(properties.pt, 'PT', false));
	}
	if (properties.pinlineRight) {
		frames.push(makeCircuitFrameByLetter(properties.pinlineRight, 'Pinline', true));
	}
	frames.push(makeCircuitFrameByLetter(properties.pinline, 'Pinline', false));
	frames.push(makeCircuitFrameByLetter(properties.typeTitle, 'Type', false));
	frames.push(makeCircuitFrameByLetter(properties.typeTitle, 'Title', false));
	if (properties.pinlineRight) {
		frames.push(makeCircuitFrameByLetter(properties.rulesRight, 'Rules', true));
	}
	frames.push(makeCircuitFrameByLetter(properties.rules, 'Rules', false));
	if (properties.frameRight) {
		frames.push(makeCircuitFrameByLetter(properties.frameRight, 'Frame', true));
	}
	frames.push(makeCircuitFrameByLetter(properties.frame, 'Frame', false));
	frames.push(makeCircuitFrameByLetter(properties.frame, 'Border', false));

	if (card.text.pt && type_line.includes('Vehicle') && !card.text.pt.text.includes('fff')) {
		card.text.pt.text = '{fontcolor#fff}' + card.text.pt.text;
	}

	card.frames = frames;
	card.frames.reverse();
	await card.frames.forEach(item => addFrame([], item));
	card.frames.reverse();
}
async function autoM15Frame(colors, mana_cost, type_line, power) {
	var frames = card.frames.filter(frame => frame.name.includes('Extension'));

	//clear the draggable frames
	card.frames = [];
	document.querySelector('#frame-list').innerHTML = null;
	var style = 'regular';
	if(colors.includes('D')) {
		style = 'devoid';
		colors = colors.filter(color => color != 'D');
	}
	var properties = cardFrameProperties(colors, mana_cost, type_line, power);
	
	if (type_line.toLowerCase().includes('snow')) {
		style = 'snow';
	} else if (type_line.toLowerCase().includes('enchantment creature') || type_line.toLowerCase().includes('enchantment artifact') || (document.querySelector('#autoframe-always-nyx').checked && (type_line.toLowerCase().includes('enchantment') || type_line.toLowerCase().includes('结界')))) {
		style = 'Nyx';
	}

	// Set frames
	if (type_line.includes('Legendary') || type_line.includes('传奇')) {
		if (style == 'Nyx') {
			if (properties.pinlineRight) {
				frames.push(makeM15FrameByLetter(properties.pinlineRight, 'Inner Crown', true, style));
			}
			frames.push(makeM15FrameByLetter(properties.pinline, 'Inner Crown', false, style));
		}

		if (properties.pinlineRight) {
			frames.push(makeM15FrameByLetter(properties.pinlineRight, 'Crown', true, style));
		}
		frames.push(makeM15FrameByLetter(properties.pinline, "Crown", false, style));
		frames.push(makeM15FrameByLetter(properties.pinline, "Crown Border Cover", false, style));
	}
	if (properties.pt) {
		frames.push(makeM15FrameByLetter(properties.pt, 'PT', false, style));
	}
	if (properties.pinlineRight) {
		frames.push(makeM15FrameByLetter(properties.pinlineRight, 'Pinline', true, style));
	}
	frames.push(makeM15FrameByLetter(properties.pinline, 'Pinline', false, style));
	frames.push(makeM15FrameByLetter(properties.typeTitle, 'Type', false, style));
	frames.push(makeM15FrameByLetter(properties.typeTitle, 'Title', false, style));
	if (properties.pinlineRight) {
		frames.push(makeM15FrameByLetter(properties.rulesRight, 'Rules', true, style));
	}
	frames.push(makeM15FrameByLetter(properties.rules, 'Rules', false, style));
	if (properties.frameRight) {
		frames.push(makeM15FrameByLetter(properties.frameRight, 'Frame', true, style));
	}
	frames.push(makeM15FrameByLetter(properties.frame, 'Frame', false, style));
	frames.push(makeM15FrameByLetter(properties.frame, 'Border', false, style));

	if (card.text.pt && type_line.includes('Vehicle') && !card.text.pt.text.includes('fff')) {
		card.text.pt.text = '{fontcolor#fff}' + card.text.pt.text;
	}

	card.frames = frames;
	card.frames.reverse();
	await card.frames.forEach(item => addFrame([], item));
	card.frames.reverse();
}
async function autoM15NewFrame(colors, mana_cost, type_line, power, style = 'regular') {
	var frames;
	if (style == 'ub') {
		frames = card.frames.filter(frame => frame.name.includes('Extension') || frame.name.includes('Gray Holo Stamp'));
	} else {
		frames = card.frames.filter(frame => frame.name.includes('Extension'));
	}

	//clear the draggable frames
	card.frames = [];
	document.querySelector('#frame-list').innerHTML = null;

	var properties = cardFrameProperties(colors, mana_cost, type_line, power);
	if (style == 'ub') {
		if (type_line.toLowerCase().includes('enchantment creature') || type_line.toLowerCase().includes('enchantment artifact') || (document.querySelector('#autoframe-always-nyx').checked && (type_line.toLowerCase().includes('enchantment') || type_line.toLowerCase().includes('结界')))) {
			style = 'ubnyx';
		}
	} else if (style != 'fullart') {
	 	if (type_line.toLowerCase().includes('snow')) {
			style = 'snow';
		} else if (type_line.toLowerCase().includes('enchantment creature') || type_line.toLowerCase().includes('enchantment artifact') || (document.querySelector('#autoframe-always-nyx').checked && (type_line.toLowerCase().includes('enchantment') || type_line.toLowerCase().includes('结界')))) {
			style = 'Nyx';
		}
	}

	// Set frames
	if (type_line.includes('Legendary') || type_line.includes('传奇')) {
		if (style == 'Nyx' || style == 'ubnyx') {
			if (properties.pinlineRight) {
				frames.push(makeM15NewFrameByLetter(properties.pinlineRight, 'Inner Crown', true, style));
			}

			frames.push(makeM15NewFrameByLetter(properties.pinline, 'Inner Crown', false, style));
		}

		if (properties.pinlineRight) {
			frames.push(makeM15NewFrameByLetter(properties.pinlineRight, 'Crown', true, style));
		}
		frames.push(makeM15NewFrameByLetter(properties.pinline, "Crown", false, style));
		frames.push(makeM15NewFrameByLetter(properties.pinline, "Crown Border Cover", false, style));
	}

	if (style == 'ub' || style == 'ubnyx') {
		if (properties.pinlineRight) {
			frames.push(makeM15NewFrameByLetter(properties.pinlineRight, 'Stamp', true, style));
		}
		frames.push(makeM15NewFrameByLetter(properties.pinline, "Stamp", false, style));
	}

	if (properties.pt) {
		frames.push(makeM15NewFrameByLetter(properties.pt, 'PT', false, style));
	}
	if (properties.pinlineRight) {
		frames.push(makeM15NewFrameByLetter(properties.pinlineRight, 'Pinline', true, style));
	}
	frames.push(makeM15NewFrameByLetter(properties.pinline, 'Pinline', false, style));
	frames.push(makeM15NewFrameByLetter(properties.typeTitle, 'Type', false, style));
	frames.push(makeM15NewFrameByLetter(properties.typeTitle, 'Title', false, style));
	if (properties.pinlineRight) {
		frames.push(makeM15NewFrameByLetter(properties.rulesRight, 'Rules', true, style));
	}
	frames.push(makeM15NewFrameByLetter(properties.rules, 'Rules', false, style));
	if (properties.frameRight) {
		frames.push(makeM15NewFrameByLetter(properties.frameRight, 'Frame', true, style));
	}
	frames.push(makeM15NewFrameByLetter(properties.frame, 'Frame', false, style));
	frames.push(makeM15NewFrameByLetter(properties.frame, 'Border', false, style));

	if (card.text.pt && type_line.includes('Vehicle') && !card.text.pt.text.includes('fff')) {
		card.text.pt.text = '{fontcolor#fff}' + card.text.pt.text;
	}

	card.frames = frames;
	card.frames.reverse();
	await card.frames.forEach(item => addFrame([], item));
	card.frames.reverse();
}
async function autoM15EighthFrame(colors, mana_cost, type_line, power) {
	var frames = card.frames.filter(frame => frame.name.includes('Extension'));

	//clear the draggable frames
	card.frames = [];
	document.querySelector('#frame-list').innerHTML = null;

	var properties = cardFrameProperties(colors, mana_cost, type_line, power);
	var style = 'regular';
	if (type_line.toLowerCase().includes('snow')) {
		style = 'snow';
	} else if (type_line.toLowerCase().includes('enchantment creature') || type_line.toLowerCase().includes('enchantment artifact') || (document.querySelector('#autoframe-always-nyx').checked && (type_line.toLowerCase().includes('enchantment') || type_line.toLowerCase().includes('结界')))) {
		style = 'Nyx';
	}

	// Set frames
	if (type_line.includes('Legendary') || type_line.includes('传奇')) {
		if (style == 'Nyx') {
			if (properties.pinlineRight) {
				frames.push(makeM15FrameByLetter(properties.pinlineRight, 'Inner Crown', true, style));
			}
			frames.push(makeM15FrameByLetter(properties.pinline, 'Inner Crown', false, style));
		}

		if (properties.pinlineRight) {
			frames.push(makeM15FrameByLetter(properties.pinlineRight, 'Crown', true, style));
		}
		frames.push(makeM15FrameByLetter(properties.pinline, "Crown", false, style));
		frames.push(makeM15FrameByLetter(properties.pinline, "Crown Border Cover", false, style));
	}
	if (properties.pt) {
		frames.push(makeM15EighthFrameByLetter(properties.pt, 'PT', false, style));
	}
	if (properties.pinlineRight) {
		frames.push(makeM15EighthFrameByLetter(properties.pinlineRight, 'Pinline', true, style));
	}
	frames.push(makeM15EighthFrameByLetter(properties.pinline, 'Pinline', false, style));
	frames.push(makeM15EighthFrameByLetter(properties.typeTitle, 'Type', false, style));
	frames.push(makeM15EighthFrameByLetter(properties.typeTitle, 'Title', false, style));
	if (properties.pinlineRight) {
		frames.push(makeM15EighthFrameByLetter(properties.rulesRight, 'Rules', true, style));
	}
	frames.push(makeM15EighthFrameByLetter(properties.rules, 'Rules', false, style));
	if (properties.frameRight) {
		frames.push(makeM15EighthFrameByLetter(properties.frameRight, 'Frame', true, style));
	}
	frames.push(makeM15EighthFrameByLetter(properties.frame, 'Frame', false, style));
	frames.push(makeM15EighthFrameByLetter(properties.frame, 'Border', false, style));

	if (card.text.pt && type_line.includes('Vehicle') && !card.text.pt.text.includes('fff')) {
		card.text.pt.text = '{fontcolor#fff}' + card.text.pt.text;
	}

	card.frames = frames;
	card.frames.reverse();
	await card.frames.forEach(item => addFrame([], item));
	card.frames.reverse();
}
async function autoM15EighthUBFrame(colors, mana_cost, type_line, power) {
	var frames = card.frames.filter(frame => frame.name.includes('Extension'));

	//clear the draggable frames
	card.frames = [];
	document.querySelector('#frame-list').innerHTML = null;

	var properties = cardFrameProperties(colors, mana_cost, type_line, power);
	var style = 'regular';
	if (type_line.toLowerCase().includes('snow')) {
		style = 'snow';
	} else if (type_line.toLowerCase().includes('enchantment creature') || type_line.toLowerCase().includes('enchantment artifact') || (document.querySelector('#autoframe-always-nyx').checked && (type_line.toLowerCase().includes('enchantment') || type_line.toLowerCase().includes('结界')))) {
		style = 'Nyx';
	}

	// Set frames
	if (type_line.includes('Legendary') || type_line.includes('传奇')) {
		if (style == 'Nyx') {
			if (properties.pinlineRight) {
				frames.push(makeM15EighthUBFrameByLetter(properties.pinlineRight, 'Inner Crown', true, style));
			}
			frames.push(makeM15EighthUBFrameByLetter(properties.pinline, 'Inner Crown', false, style));
		}

		if (properties.pinlineRight) {
			frames.push(makeM15EighthUBFrameByLetter(properties.pinlineRight, 'Crown', true, style));
		}
		frames.push(makeM15EighthUBFrameByLetter(properties.pinline, "Crown", false, style));
		frames.push(makeM15EighthUBFrameByLetter(properties.pinline, "Crown Border Cover", false, style));
	}
	if (properties.pt) {
		frames.push(makeM15EighthUBFrameByLetter(properties.pt, 'PT', false, style));
	}
	if (properties.pinlineRight) {
		frames.push(makeM15EighthUBFrameByLetter(properties.pinlineRight, 'Pinline', true, style));
	}
	frames.push(makeM15EighthUBFrameByLetter(properties.pinline, 'Pinline', false, style));
	frames.push(makeM15EighthUBFrameByLetter(properties.typeTitle, 'Type', false, style));
	frames.push(makeM15EighthUBFrameByLetter(properties.typeTitle, 'Title', false, style));
	if (properties.pinlineRight) {
		frames.push(makeM15EighthUBFrameByLetter(properties.rulesRight, 'Rules', true, style));
	}
	frames.push(makeM15EighthUBFrameByLetter(properties.rules, 'Rules', false, style));
	if (properties.frameRight) {
		frames.push(makeM15EighthUBFrameByLetter(properties.frameRight, 'Frame', true, style));
	}
	frames.push(makeM15EighthUBFrameByLetter(properties.frame, 'Frame', false, style));
	frames.push(makeM15EighthUBFrameByLetter(properties.frame, 'Border', false, style));

	if (card.text.pt && type_line.includes('Vehicle') && !card.text.pt.text.includes('fff')) {
		card.text.pt.text = '{fontcolor#fff}' + card.text.pt.text;
	}

	card.frames = frames;
	card.frames.reverse();
	await card.frames.forEach(item => addFrame([], item));
	card.frames.reverse();
}
async function autoBorderlessFrame(colors, mana_cost, type_line, power) {
	var frames = card.frames.filter(frame => frame.name.includes('Extension'));

	//clear the draggable frames
	card.frames = [];
	document.querySelector('#frame-list').innerHTML = null;
	var properties = cardFrameProperties(colors, mana_cost, type_line, power, 'Borderless');
	var style = 'regular';
	if (type_line.toLowerCase().includes('enchantment creature') || type_line.toLowerCase().includes('enchantment artifact') || (document.querySelector('#autoframe-always-nyx').checked && (type_line.toLowerCase().includes('enchantment') || type_line.toLowerCase().includes('结界')))) {
		style = 'Nyx';
	}

	// Set frames
	if (type_line.includes('Legendary') || type_line.includes('传奇')) {
		if (style == 'Nyx') {
			if (properties.pinlineRight) {
				frames.push(makeBorderlessFrameByLetter(properties.pinlineRight, 'Inner Crown', true));
			}
			frames.push(makeM15FrameByLetter(properties.pinline, 'Inner Crown', false, style));
		}

		if (properties.pinlineRight) {
			frames.push(makeBorderlessFrameByLetter(properties.pinlineRight, 'Crown', true, style));
		}
		frames.push(makeBorderlessFrameByLetter(properties.pinline, "Crown", false, style));
		frames.push(makeBorderlessFrameByLetter(properties.pinline, "Legend Crown Outline", false))
		frames.push(makeBorderlessFrameByLetter(properties.pinline, "Crown Border Cover", false));
	}
	if (properties.pt) {
		frames.push(makeBorderlessFrameByLetter(properties.pt, 'PT', false));
	}
	if (properties.pinlineRight) {
		frames.push(makeBorderlessFrameByLetter(properties.pinlineRight, 'Pinline', true));
	}
	frames.push(makeBorderlessFrameByLetter(properties.pinline, 'Pinline', false));
	frames.push(makeBorderlessFrameByLetter(properties.typeTitle, 'Type', false));
	frames.push(makeBorderlessFrameByLetter(properties.typeTitle, 'Title', false));
	frames.push(makeBorderlessFrameByLetter(properties.rules, 'Rules', false));
	frames.push(makeBorderlessFrameByLetter(properties.frame, 'Border', false));

	// if (card.text.pt && type_line.includes('Vehicle') && !card.text.pt.text.includes('fff')) {
	// 	card.text.pt.text = '{fontcolor#fff}' + card.text.pt.text;
	// }

	card.frames = frames;
	card.frames.reverse();
	await card.frames.forEach(item => addFrame([], item));
	card.frames.reverse();
}
async function autoBorderlessUBFrame(colors, mana_cost, type_line, power) {
	var frames = card.frames.filter(frame => frame.name.includes('Extension'));

	//clear the draggable frames
	card.frames = [];
	document.querySelector('#frame-list').innerHTML = null;

	var properties = cardFrameProperties(colors, mana_cost, type_line, power, 'Borderless');
	var style = 'regular';
	if (type_line.toLowerCase().includes('enchantment creature') || type_line.toLowerCase().includes('enchantment artifact') || (document.querySelector('#autoframe-always-nyx').checked && (type_line.toLowerCase().includes('enchantment') || type_line.toLowerCase().includes('结界')))) {
		style = 'Nyx';
	}

	// Set frames
	if (type_line.includes('Legendary')) {
		if (style == 'Nyx') {
			if (properties.pinlineRight) {
				frames.push(makeUBFrameByLetter(properties.pinlineRight, 'Inner Crown', true));
			}
			frames.push(makeUBFrameByLetter(properties.pinline, 'Inner Crown', false, style));
		}

		if (properties.pinlineRight) {
			frames.push(makeBorderlessFrameByLetter(properties.pinlineRight, 'Crown', true, style, true));
		}
		frames.push(makeBorderlessFrameByLetter(properties.pinline, "Crown", false, style, true));
		frames.push(makeBorderlessFrameByLetter(properties.pinline, "Legend Crown Outline", false))
		frames.push(makeBorderlessFrameByLetter(properties.pinline, "Crown Border Cover", false));
	}
	if (properties.pinlineRight) {
		frames.push(makeUBFrameByLetter(properties.pinlineRight, 'Stamp', true, style));
	}
	frames.push(makeUBFrameByLetter(properties.pinline, "Stamp", false, style));
	if (properties.pt) {
		frames.push(makeBorderlessFrameByLetter(properties.pt, 'PT', false));
	}
	if (properties.pinlineRight) {
		frames.push(makeBorderlessFrameByLetter(properties.pinlineRight, 'Pinline', true));
	}
	frames.push(makeBorderlessFrameByLetter(properties.pinline, 'Pinline', false));
	frames.push(makeBorderlessFrameByLetter(properties.typeTitle, 'Type', false));
	frames.push(makeBorderlessFrameByLetter(properties.typeTitle, 'Title', false));
	frames.push(makeBorderlessFrameByLetter(properties.rules, 'Rules', false));
	frames.push(makeBorderlessFrameByLetter(properties.frame, 'Border', false));

	// if (card.text.pt && type_line.includes('Vehicle') && !card.text.pt.text.includes('fff')) {
	// 	card.text.pt.text = '{fontcolor#fff}' + card.text.pt.text;
	// }

	card.frames = frames;
	card.frames.reverse();
	await card.frames.forEach(item => addFrame([], item));
	card.frames.reverse();
}
async function auto8thEditionFrame(colors, mana_cost, type_line, power) {
	var frames = card.frames.filter(frame => frame.name.includes('Extension'));

	//clear the draggable frames
	card.frames = [];
	document.querySelector('#frame-list').innerHTML = null;

	var properties = cardFrameProperties(colors, mana_cost, type_line, power);
	var style = 'regular';
	if (type_line.toLowerCase().includes('enchantment creature') || type_line.toLowerCase().includes('enchantment artifact') || (document.querySelector('#autoframe-always-nyx').checked && type_line.toLowerCase().includes('enchantment'))) {
		style = 'Nyx';
	}

	// Set frames
	if (properties.pt) {
		frames.push(make8thEditionFrameByLetter(properties.pt, 'PT', false, style));
	}
	if (properties.pinlineRight) {
		frames.push(make8thEditionFrameByLetter(properties.pinlineRight, 'Pinline', true, style));
	}
	frames.push(make8thEditionFrameByLetter(properties.pinline, 'Pinline', false, style));
	frames.push(make8thEditionFrameByLetter(properties.typeTitle, 'Type', false, style));
	frames.push(make8thEditionFrameByLetter(properties.typeTitle, 'Title', false, style));
	if (properties.pinlineRight) {
		frames.push(make8thEditionFrameByLetter(properties.rulesRight, 'Rules', true, style));
	}
	frames.push(make8thEditionFrameByLetter(properties.rules, 'Rules', false, style));
	if (properties.frameRight) {
		frames.push(make8thEditionFrameByLetter(properties.frameRight, 'Frame', true, style));
	}
	frames.push(make8thEditionFrameByLetter(properties.frame, 'Frame', false, style));
	frames.push(make8thEditionFrameByLetter(properties.frame, 'Border', false, style));

	card.frames = frames;
	card.frames.reverse();
	await card.frames.forEach(item => addFrame([], item));
	card.frames.reverse();
}
async function autoExtendedArtFrame(colors, mana_cost, type_line, power, short) {
	var frames = card.frames.filter(frame => frame.name.includes('Extension'));

	//clear the draggable frames
	card.frames = [];
	document.querySelector('#frame-list').innerHTML = null;

	var properties = cardFrameProperties(colors, mana_cost, type_line, power);
	var style = 'regular';
	if (type_line.toLowerCase().includes('snow')) {
		style = 'snow';
	} else if (type_line.toLowerCase().includes('enchantment creature') || type_line.toLowerCase().includes('enchantment artifact') || (document.querySelector('#autoframe-always-nyx').checked && (type_line.toLowerCase().includes('enchantment') || type_line.toLowerCase().includes('结界')))) {
		style = 'Nyx';
	}

	// Set frames
	if (type_line.includes('Legendary') || type_line.includes('传奇')) {
		frames.push(makeExtendedArtFrameByLetter(properties.pinline, "Crown Outline", false, style, short));

		if (style == 'Nyx') {
			if (properties.pinlineRight) {
				frames.push(makeExtendedArtFrameByLetter(properties.pinlineRight, 'Inner Crown', true, style, short));
			}
			frames.push(makeExtendedArtFrameByLetter(properties.pinline, 'Inner Crown', false, style, short));
		}

		if (properties.pinlineRight) {
			frames.push(makeExtendedArtFrameByLetter(properties.pinlineRight, 'Crown', true, style, short));
		}
		frames.push(makeExtendedArtFrameByLetter(properties.pinline, "Crown", false, style, short));
		frames.push(makeExtendedArtFrameByLetter(properties.pinline, "Crown Border Cover", false, style, short));
	} else {
		frames.push(makeExtendedArtFrameByLetter(properties.pinline, "Title Cutout", false, style, short));
	}
	if (properties.pt) {
		frames.push(makeExtendedArtFrameByLetter(properties.pt, 'PT', false, style, short));
	}
	if (properties.pinlineRight) {
		frames.push(makeExtendedArtFrameByLetter(properties.pinlineRight, 'Pinline', true, style, short));
	}
	frames.push(makeExtendedArtFrameByLetter(properties.pinline, 'Pinline', false, style, short));
	frames.push(makeExtendedArtFrameByLetter(properties.typeTitle, 'Type', false, style, short));
	frames.push(makeExtendedArtFrameByLetter(properties.typeTitle, 'Title', false, style, short));
	if (properties.pinlineRight) {
		frames.push(makeExtendedArtFrameByLetter(properties.rulesRight, 'Rules', true, style, short));
	}
	frames.push(makeExtendedArtFrameByLetter(properties.rules, 'Rules', false, style, short));
	if (properties.frameRight) {
		frames.push(makeExtendedArtFrameByLetter(properties.frameRight, 'Frame', true, style, short));
	}
	frames.push(makeExtendedArtFrameByLetter(properties.frame, 'Frame', false, style, short));
	frames.push(makeExtendedArtFrameByLetter(properties.frame, 'Border', false, style, short));

	if (card.text.pt && type_line.includes('Vehicle') && !card.text.pt.text.includes('fff')) {
		card.text.pt.text = '{fontcolor#fff}' + card.text.pt.text;
	}

	card.frames = frames;
	card.frames.reverse();
	await card.frames.forEach(item => addFrame([], item));
	card.frames.reverse();
}
async function autoEtchedFrame(colors, mana_cost, type_line, power) {
	var frames = card.frames.filter(frame => frame.name.includes('Extension'));

	//clear the draggable frames
	card.frames = [];
	document.querySelector('#frame-list').innerHTML = null;

	var properties = cardFrameProperties(colors, mana_cost, type_line, power, 'Etched');
	var style = 'regular';
	if (type_line.toLowerCase().includes('snow')) {
		style = 'snow';
	} else if (type_line.toLowerCase().includes('enchantment creature') || type_line.toLowerCase().includes('enchantment artifact') || (document.querySelector('#autoframe-always-nyx').checked && (type_line.toLowerCase().includes('enchantment') || type_line.toLowerCase().includes('结界')))) {
		style = 'Nyx';
	}

	// Set frames

	if (type_line.includes('Legendary') || type_line.includes('传奇')) {
		if (style == 'Nyx') {
			if (properties.frameRight) {
				frames.push(makeEtchedFrameByLetter(properties.pinlineRight, 'Inner Crown', true));
			}
			frames.push(makeEtchedFrameByLetter(properties.pinline, 'Inner Crown', false, style));
		}

		if (properties.frameRight) {
			frames.push(makeEtchedFrameByLetter(properties.frameRight, 'Crown', true));
		}
		frames.push(makeEtchedFrameByLetter(properties.frame, "Crown", false));
		frames.push(makeEtchedFrameByLetter(properties.frame, "Crown Border Cover", false));
	}
	if (properties.pt) {
		frames.push(makeEtchedFrameByLetter(properties.pt, 'PT', false));
	}
	frames.push(makeEtchedFrameByLetter(properties.typeTitle, 'Type', false));
	frames.push(makeEtchedFrameByLetter(properties.typeTitle, 'Title', false));
	if (properties.pinlineRight) {
		frames.push(makeEtchedFrameByLetter(properties.rulesRight, 'Rules', true));
	}
	frames.push(makeEtchedFrameByLetter(properties.rules, 'Rules', false));
	if (properties.frameRight) {
		frames.push(makeEtchedFrameByLetter(properties.frameRight, 'Frame', true, style));
	}
	frames.push(makeEtchedFrameByLetter(properties.frame, 'Frame', false, style));
	frames.push(makeEtchedFrameByLetter(properties.frame, 'Border', false));

	card.frames = frames;
	card.frames.reverse();
	await card.frames.forEach(item => addFrame([], item));
	card.frames.reverse();
}
async function autoPhyrexianFrame(colors, mana_cost, type_line, power) {
	var frames = card.frames.filter(frame => frame.name.includes('Extension'));

	//clear the draggable frames
	card.frames = [];
	document.querySelector('#frame-list').innerHTML = null;

	var properties = cardFrameProperties(colors, mana_cost, type_line, power, 'Phyrexian');

	// Set frames

	if (type_line.toLowerCase().includes('legendary')) {
		if (properties.pinlineRight) {
			frames.push(makePhyrexianFrameByLetter(properties.pinlineRight, 'Crown', true));
		}
		frames.push(makePhyrexianFrameByLetter(properties.pinline, "Crown", false));
	}
	if (properties.pt) {
		frames.push(makePhyrexianFrameByLetter(properties.pt, 'PT', false));
	}
	if (properties.pinlineRight) {
		frames.push(makePhyrexianFrameByLetter(properties.pinlineRight, 'Pinline', true));
	}
	frames.push(makePhyrexianFrameByLetter(properties.pinline, 'Pinline', false));
	frames.push(makePhyrexianFrameByLetter(properties.typeTitle, 'Type', false));
	frames.push(makePhyrexianFrameByLetter(properties.typeTitle, 'Title', false));
	if (properties.pinlineRight) {
		frames.push(makePhyrexianFrameByLetter(properties.rulesRight, 'Rules', true));
	}
	frames.push(makePhyrexianFrameByLetter(properties.rules, 'Rules', false));
	if (properties.frameRight) {
		frames.push(makePhyrexianFrameByLetter(properties.frameRight, 'Frame', true));
	}
	frames.push(makePhyrexianFrameByLetter(properties.frame, 'Frame', false));
	frames.push(makePhyrexianFrameByLetter(properties.frame, 'Border', false));

	card.frames = frames;
	card.frames.reverse();
	await card.frames.forEach(item => addFrame([], item));
	card.frames.reverse();
}
async function autoSeventhEditionFrame(colors, mana_cost, type_line, power) {
	var frames = card.frames.filter(frame => frame.name.includes('Extension') || frame.name.includes('DCI Star'));

	//clear the draggable frames
	card.frames = [];
	document.querySelector('#frame-list').innerHTML = null;

	var properties = cardFrameProperties(colors, mana_cost, type_line, power, 'Seventh');

	// Set frames
	frames.push(makeSeventhEditionFrameByLetter(properties.pinline, 'Pinline', false));
	if (properties.rulesRight) {
		frames.push(makeSeventhEditionFrameByLetter(properties.rulesRight, 'Rules', true));
	}
	frames.push(makeSeventhEditionFrameByLetter(properties.rules, 'Rules', false));
	frames.push(makeSeventhEditionFrameByLetter(properties.frame, 'Frame', false));
	frames.push(makeSeventhEditionFrameByLetter(properties.pinline, 'Textbox Pinline', false));
	frames.push(makeSeventhEditionFrameByLetter(properties.frame, 'Border', false));

	card.frames = frames;
	card.frames.reverse();
	await card.frames.forEach(item => addFrame([], item));
	card.frames.reverse();
}
function makeM15FrameByLetter(letter, mask = false, maskToRightHalf = false, style = 'regular') {
	letter = letter.toUpperCase();
	var frameNames = {
		'W': 'White',
		'U': 'Blue',
		'B': 'Black',
		'R': 'Red',
		'G': 'Green',
		'M': 'Multicolored',
		'A': 'Artifact',
		'L': 'Land',
		'C': 'Colorless',
		'V': 'Vehicle',
		'WL': 'White Land',
		'UL': 'Blue Land',
		'BL': 'Black Land',
		'RL': 'Red Land',
		'GL': 'Green Land',
		'ML': 'Multicolored Land'
	}


	if ((mask.includes('Crown') || mask == 'PT' || mask.includes('Stamp')) && letter.includes('L') && letter.length > 1) {
		letter = letter[0];
	} else if (letter == 'L' && style == 'Nyx') {
		style = 'regular'
;	}

	var frameName = frameNames[letter];

	if (mask == "Crown Border Cover") {
		return {
			'name': 'Legend Crown Border Cover',
			'src': '/img/black.png',
			'masks': [],
			'bounds': {
				'height': 0.0177,
				'width': 0.9214,
				'x': 0.0394,
				'y': 0.0277
			}
		}
	}

	if (mask == "Crown") {
		var frame = {
			'name': frameName + ' Legend Crown',
			'src': '/img/frames/m15/crowns/m15Crown' + letter + '.png',
			'masks': [],
			'bounds': {
				'height': 0.1667,
				'width': 0.9454,
				'x': 0.0274,
				'y': 0.0191
			}
		}
		if (maskToRightHalf) {
			frame.masks.push({
				'src': '/img/frames/maskRightHalf.png',
				'name': 'Right Half'
			});
		}
		return frame;
	}

	if (mask == "Inner Crown") {
		var frame = {
			'name': frameName + ' ' + mask + ' (' + style + ')',
			'src': '/img/frames/m15/innerCrowns/m15InnerCrown' + letter + style + '.png',
			'masks': [],
			'bounds': {
				'height': 0.0239,
				'width': 0.672,
				'x': 0.164,
				'y': 0.0239
			}
		}
		if (maskToRightHalf) {
			frame.masks.push({
				'src': '/img/frames/maskRightHalf.png',
				'name': 'Right Half'
			});
		}
		return frame;
	}

	if (mask == 'PT') {
		return {
			'name': frameName + ' Power/Toughness',
			'src': '/img/frames/m15/regular/m15PT' + letter + '.png',
			'masks': [],
			'bounds': {
				'height': 0.0733,
				'width': 0.188,
				'x': 0.7573,
				'y': 0.8848
			}
		}
	}

	var frame = {
		'name': frameName + ' Frame',
		'src': '/img/frames/m15/' + style.toLowerCase() + '/m15Frame' + letter + '.png',
	}

	if (style == 'devoid') {
		frame.src = frame.src.replace('Frame' + letter, 'devoidFrame' + letter);
	
	}

	if (style == 'snow') {
		frame.src = frame.src.replace('m15Frame' + letter, letter.toLowerCase());
	} else {
		if (letter.includes('L') && letter.length > 1) {
			frame.src = frame.src.replace(('m15Frame' + letter), 'l' + letter[0].toLowerCase())
		}

		if (style == 'Nyx') {
			frame.src = frame.src.replace('.png', 'Nyx.png');
		}
	}

	if (mask) {
		frame.masks = [
			{
				'src': '/img/frames/m15/regular/m15Mask' + mask + '.png',
				'name': mask
			}
		]

		if (maskToRightHalf) {
			frame.masks.push({
				'src': '/img/frames/maskRightHalf.png',
				'name': 'Right Half'
			});
		}
	} else {
		frame.masks = [];
	}

	return frame;
}

function makeM15NewFrameByLetter(letter, mask = false, maskToRightHalf = false, style = 'regular') {
	letter = letter.toUpperCase();
	var frameNames = {
		'W': 'White',
		'U': 'Blue',
		'B': 'Black',
		'R': 'Red',
		'G': 'Green',
		'M': 'Multicolored',
		'A': 'Artifact',
		'L': 'Land',
		'C': 'Colorless',
		'V': 'Vehicle',
		'WL': 'White Land',
		'UL': 'Blue Land',
		'BL': 'Black Land',
		'RL': 'Red Land',
		'GL': 'Green Land',
		'ML': 'Multicolored Land',
		'WE': 'White Enchantment',
		'UE': 'Blue Enchantment',
		'BE': 'Black Enchantment',
		'RE': 'Red Enchantment',
		'GE': 'Green Enchantment',
		'ME': 'Multicolored Enchantment',
		'AE': 'Artifact Enchantment'
	}

	if (style == 'ubnyx') {
		letter += 'E'
		if (mask == "Inner Crown") {
			style = 'nyx';
		} else {
			style = 'ub';
		}
	}

	if (letter.length == 2) {
		letter = letter.split("").reverse().join("");
	}

	if ((mask == 'Crown' || mask == 'PT' || mask.includes('Stamp')) && (letter.includes('L') || letter.includes('E')) && letter.length > 1) {
		letter = letter[1];
	}

	var frameName = frameNames[letter.split("").reverse().join("")];

	if (mask == "Crown Border Cover") {
		return {
			'name': 'Legend Crown Border Cover',
			'src': '/img/black.png',
			'masks': [],
			'bounds': {x:0, y:0, width:1, height:137/2814}
		}
	}

	if (mask == "Crown") {
		var framePath = '';
		if (style == 'ub') {
			framePath = 'ub/';
		}
		var frame = {
			'name': frameName + ' Legend Crown',
			'src': '/img/frames/m15/' + framePath + 'crowns/new/' + letter.toLowerCase() + '.png',
			'masks': [],
			'bounds': {x:44/2010, y:53/2814, width:1922/2010, height:493/2814}
		}
		if (maskToRightHalf) {
			frame.masks.push({
				'src': '/img/frames/maskRightHalf.png',
				'name': 'Right Half'
			});
		}
		return frame;
	}

	if (mask == "Inner Crown") {
		var frame = {
			'name': frameName + ' ' + mask + ' (' + style + ')',
			'src': '/img/frames/m15/innerCrowns/new/' + style.toLowerCase() + '/' + letter.toLowerCase() + '.png',
			'masks': [],
			'bounds': {x:329/2010, y:70/2814, width:1353/2010, height:64/2814}
		};
		if (maskToRightHalf) {
			frame.masks.push({
				'src': '/img/frames/maskRightHalf.png',
				'name': 'Right Half'
			});
		}
		return frame;
	} else if (mask == "Stamp") {
		if (style == 'ub') {
			var frame = {
				'name': frameName + ' Holo Stamp',
				'src': '/img/frames/m15/new/ub/stamp/' + letter.toLowerCase() + '.png',
				'masks': [],
				'bounds': {x:857/2015, y:2534/2814, width:299/2015, height:137/2814}
			}
			if (maskToRightHalf) {
				frame.masks.push({
					'src': '/img/frames/maskRightHalf.png',
					'name': 'Right Half'
				});
			}
			return frame;
		}
	}

	if (mask == 'PT') {
		var path = '/img/frames/m15/regular/m15PT';
		if (style == 'ub') {
			path = '/img/frames/m15/ub/pt/';
			letter = letter.toLowerCase();
		}
		return {
			'name': frameName + ' Power/Toughness',
			'src': path + letter + '.png',
			'masks': [],
			'bounds': {
				'height': 0.0733,
				'width': 0.188,
				'x': 0.7573,
				'y': 0.8848
			}
		}
	}

	var stylePath = '';
	if (style != 'regular') {
		stylePath = style.toLowerCase() + '/';
	}
	var frame = {
		'name': frameName + ' Frame',
		'src': '/img/frames/m15/new/' + stylePath + letter.toLowerCase() + '.png',
	}

	// if (letter.includes('L') && letter.length > 1) {
	// 	frame.src = frame.src.replace(('m15Frame' + letter), 'l' + letter[0].toLowerCase())
	// }

	if (mask) {
		frame.masks = [
			{
				'src': '/img/frames/m15/new/' + mask.toLowerCase() + '.png',
				'name': mask
			}
		]

		if (maskToRightHalf) {
			frame.masks.push({
				'src': '/img/frames/maskRightHalf.png',
				'name': 'Right Half'
			});
		}
	} else {
		frame.masks = [];
	}

	return frame;
}
function makeM15EighthFrameByLetter(letter, mask = false, maskToRightHalf = false, style = 'regular') {
	letter = letter.toUpperCase();
	var frameNames = {
		'W': 'White',
		'U': 'Blue',
		'B': 'Black',
		'R': 'Red',
		'G': 'Green',
		'M': 'Multicolored',
		'A': 'Artifact',
		'L': 'Land',
		'C': 'Colorless',
		'V': 'Vehicle',
		'WL': 'White Land',
		'UL': 'Blue Land',
		'BL': 'Black Land',
		'RL': 'Red Land',
		'GL': 'Green Land',
		'ML': 'Multicolored Land'
	}

	if ((mask.includes('Crown') || mask == 'PT' || mask.includes('Stamp')) && letter.includes('L') && letter.length > 1) {
		letter = letter[0];
	}

	var frameName = frameNames[letter];

	if (mask == "Crown Border Cover") {
		return {
			'name': 'Legend Crown Border Cover',
			'src': '/img/black.png',
			'masks': [],
			'bounds': {
				'height': 0.0177,
				'width': 0.9214,
				'x': 0.0394,
				'y': 0.0277
			}
		}
	}

	if (mask == "Crown") {
		var frame = {
			'name': frameName + ' Legend Crown',
			'src': '/img/frames/m15/crowns/m15Crown' + letter + '.png',
			'masks': [],
			'bounds': {
				'height': 0.1667,
				'width': 0.9454,
				'x': 0.0274,
				'y': 0.0191
			}
		}
		if (maskToRightHalf) {
			frame.masks.push({
				'src': '/img/frames/maskRightHalf.png',
				'name': 'Right Half'
			});
		}
		return frame;
	}

	if (mask == "Inner Crown") {
		var frame = {
			'name': frameName + ' ' + mask + ' (' + style + ')',
			'src': '/img/frames/m15/innerCrowns/m15InnerCrown' + letter + style + '.png',
			'masks': [],
			'bounds': {
				'height': 0.0239,
				'width': 0.672,
				'x': 0.164,
				'y': 0.0239
			}
		}
		if (maskToRightHalf) {
			frame.masks.push({
				'src': '/img/frames/maskRightHalf.png',
				'name': 'Right Half'
			});
		}
		return frame;
	}

	if (mask == 'PT') {
		return {
			'name': frameName + ' Power/Toughness',
			'src': '/img/frames/m15/regular/m15PT' + letter + '.png',
			'masks': [],
			'bounds': {
				'height': 0.0733,
				'width': 0.188,
				'x': 0.7573,
				'y': 1901/2100
			}
		}
	}

	var frame = {
		'name': frameName + ' Frame',
		'src': '/img/frames/custom/m15-eighth/' + style.toLowerCase() + '/' + letter.toLowerCase() + '.png',
	}

	if (style != 'regular') {
		frame.name = style.charAt(0).toUpperCase() + style.slice(1) + ' ' + frame.name;
	}

	if (mask) {
		if (mask.toLowerCase() == 'border' || mask.toLowerCase() == 'frame') {
			frame.masks = [
				{
					'src': '/img/frames/custom/m15-eighth/regular/' + mask + '.png',
					'name': mask
				}
			]
		} else {
			frame.masks = [
				{
					'src': '/img/frames/m15/regular/m15Mask' + mask + '.png',
					'name': mask
				}
			]
		}

		if (maskToRightHalf) {
			frame.masks.push({
				'src': '/img/frames/maskRightHalf.png',
				'name': 'Right Half'
			});
		}
	} else {
		frame.masks = [];
	}

	return frame;
}
function makeM15EighthUBFrameByLetter(letter, mask = false, maskToRightHalf = false, style = false) {
	letter = letter.toUpperCase();
	var frameNames = {
		'W': 'White',
		'U': 'Blue',
		'B': 'Black',
		'R': 'Red',
		'G': 'Green',
		'M': 'Multicolored',
		'A': 'Artifact',
		'L': 'Land',
		'C': 'Colorless',
		'V': 'Vehicle',
		'WL': 'White Land',
		'UL': 'Blue Land',
		'BL': 'Black Land',
		'RL': 'Red Land',
		'GL': 'Green Land',
		'ML': 'Multicolored Land',
		'WE': 'White Enchantment',
		'UE': 'Blue Enchantment',
		'BE': 'Black Enchantment',
		'RE': 'Red Enchantment',
		'GE': 'Green Enchantment',
		'ME': 'Multicolored Enchantment',
		'AE': 'Artifact Enchantment'
	};

	if (style == 'Nyx') {
		letter = letter + 'E';
	}

	if ((mask.includes('Crown') || mask == 'PT' || mask.includes('Stamp')) && (letter.includes('L') || letter.includes('E')) && letter.length > 1) {
		letter = letter[0];
	}

	var frameName = frameNames[letter];

	if (mask == "Crown Border Cover") {
		return {
			'name': 'Legend Crown Border Cover',
			'src': '/img/black.png',
			'masks': [],
			'bounds': {
				'height': 0.0177,
				'width': 0.9214,
				'x': 0.0394,
				'y': 0.0277
			}
		}
	}

	if (mask == "Crown") {
		var frame = {
			'name': frameName + ' Legend Crown',
			'src': '/img/frames/m15/ub/crowns/m15Crown' + letter + '.png',
			'masks': [],
			'bounds': {
				'height': 0.1667,
				'width': 0.9454,
				'x': 0.0274,
				'y': 0.0191
			}
		}
		if (maskToRightHalf) {
			frame.masks.push({
				'src': '/img/frames/maskRightHalf.png',
				'name': 'Right Half'
			});
		}
		return frame;
	}

	if (mask == "Inner Crown") {
		var frame = {
			'name': frameName + ' ' + mask + ' (' + style + ')',
			'src': '/img/frames/m15/innerCrowns/m15InnerCrown' + letter + style + 'UB.png',
			'masks': [],
			'bounds': {
				'height': 0.0239,
				'width': 0.672,
				'x': 0.164,
				'y': 0.0239
			}
		}
		if (maskToRightHalf) {
			frame.masks.push({
				'src': '/img/frames/maskRightHalf.png',
				'name': 'Right Half'
			});
		}
		return frame;
	}

	if (mask == 'PT') {
		return {
			'name': frameName + ' Power/Toughness',
			'src': '/img/frames/m15/ub/pt/' + letter + '.png',
			'masks': [],
			'bounds': {
				'height': 0.0733,
				'width': 0.188,
				'x': 0.7573,
				'y': 1901/2100
			}
		}
	}

	var frame = {
		'name': frameName + ' Frame',
		'src': '/img/frames/custom/m15-eighth/ub/' + letter.toLowerCase() + '.png',
	}

	if (mask) {
		if (mask.toLowerCase() == 'border' || mask.toLowerCase() == 'frame') {
			frame.masks = [
				{
					'src': '/img/frames/custom/m15-eighth/regular/' + mask + '.png',
					'name': mask
				}
			]
		} else {
			frame.masks = [
				{
					'src': '/img/frames/m15/regular/m15Mask' + mask + '.png',
					'name': mask
				}
			]
		}

		if (maskToRightHalf) {
			frame.masks.push({
				'src': '/img/frames/maskRightHalf.png',
				'name': 'Right Half'
			});
		}
	} else {
		frame.masks = [];
	}

	return frame;
}
function makeBorderlessFrameByLetter(letter, mask = false, maskToRightHalf = false, style, universesBeyond = false) {
	letter = letter.toUpperCase();

	var isVehicle = letter == 'V';

	if (letter == 'V') {
		letter = 'A';
	}

	if (letter == 'ML') {
		letter = 'M';
	} else if (letter.includes('L') && letter.length > 1) {
		letter = letter[0];
	}

	var frameNames = {
		'W': 'White',
		'U': 'Blue',
		'B': 'Black',
		'R': 'Red',
		'G': 'Green',
		'M': 'Multicolored',
		'A': 'Artifact',
		'L': 'Land',
		'C': 'Colorless'
	}

	if ((mask.includes('Crown') || mask == 'PT' || mask.includes('Stamp')) && letter.includes('L') && letter.length > 1) {
		letter = letter[0];
	}

	var frameName = frameNames[letter];

	if (mask == "Legend Crown Outline") {
		return {
			'name': 'Legend Crown Outline',
			'src': '/img/frames/m15/crowns/m15CrownFloatingOutline.png',
			'masks': [],
			'bounds': {
				'height': 0.1062,
				'width': 0.944,
				'x': 0.028,
				'y': 0.0172
			}
		};
	}

	if (mask == "Crown Border Cover") {
		return {
			'name': 'Legend Crown Border Cover',
			'erase': true,
			'src': '/img/black.png',
			'masks': [],
			'bounds': {
				'height': 0.0177,
				'width': 0.9214,
				'x': 0.0394,
				'y': 0.0277
			}
		}
	}

	if (mask == "Crown") {
		var src = '/img/frames/m15/crowns/m15Crown' + letter + 'Floating.png';
		if (universesBeyond) {
			src = '/img/frames/m15/ub/crowns/floating/' + letter + '.png';
		}
		var frame = { 
			'name': frameName + ' Legend Crown',
			'src': src,
			'masks': [],
			'bounds': {
				'height': 0.1024,
				'width': 0.9387,
				'x': 0.0307,
				'y': 0.0191
			}
		}
		if (maskToRightHalf) {
			frame.masks.push({
				'src': '/img/frames/maskRightHalf.png',
				'name': 'Right Half'
			});
		}
		return frame;
	}

	if (mask == "Inner Crown") {
		var frame = {
			'name': frameName + ' ' + mask + ' (' + style + ')',
			'src': '/img/frames/m15/innerCrowns/m15InnerCrown' + letter + style + '.png',
			'masks': [],
			'bounds': {
				'height': 0.0239,
				'width': 0.672,
				'x': 0.164,
				'y': 0.0239
			}
		}
		if (maskToRightHalf) {
			frame.masks.push({
				'src': '/img/frames/maskRightHalf.png',
				'name': 'Right Half'
			});
		}
		return frame;
	}

	if (mask == 'PT') {
		return {
			'name': frameName + ' Power/Toughness',
			'src': '/img/frames/m15/borderless/pt/' + (isVehicle ? 'v' : letter.toLowerCase())+ '.png',
			'masks': [],
			'bounds': {
				'height': 0.066666666666,
				'width': 0.182666666666,
				'x': 0.764,
				'y': 0.8861904761904762
			}
		}
	}

	var frame = {
		'name': frameName + ' Frame',
		'src': '/img/frames/m15/borderless/m15GenericShowcaseFrame' + letter + '.png',
	}

	if (letter.includes('L') && letter.length > 1) {
		frame.src = frame.src.replace(('m15GenericShowcaseFrame' + letter), 'l' + letter[0].toLowerCase())
	}

	if (mask) {
		if (mask == 'Pinline') {
			frame.masks = [
				{
					'src': '/img/frames/m15/genericShowcase/m15GenericShowcaseMask' + mask + '.png',
					'name': mask
				}
			];
		} else {
			frame.masks = [
				{
					'src': '/img/frames/m15/regular/m15Mask' + mask + '.png',
					'name': mask
				}
			];
		}

		if (maskToRightHalf) {
			frame.masks.push({
				'src': '/img/frames/maskRightHalf.png',
				'name': 'Right Half'
			});
		}
	} else {
		frame.masks = [];
	}

	return frame;
}
function make8thEditionFrameByLetter(letter, mask = false, maskToRightHalf = false, style = 'regular') {
	letter = letter.toUpperCase();
	var frameNames = {
		'W': 'White',
		'U': 'Blue',
		'B': 'Black',
		'R': 'Red',
		'G': 'Green',
		'M': 'Multicolored',
		'A': 'Artifact',
		'L': 'Land',
		'C': 'Colorless',
		'WL': 'White Land',
		'UL': 'Blue Land',
		'BL': 'Black Land',
		'RL': 'Red Land',
		'GL': 'Green Land',
		'ML': 'Multicolored Land'
	}

	if (mask == 'PT') {
		if (letter.length > 1) {
			letter = letter[0];
		} else if (letter == 'C') {
			letter = 'L';
		}
	}

	if (letter == 'V') {
		letter = 'A';
	}

	var frameName = frameNames[letter];

	if (mask == 'PT') {
		return {
			'name': frameName + ' Power/Toughness',
			'src': '/img/frames/8th/pt/' + letter.toLowerCase() + '.png',
			'masks': [],
			'bounds': {x:1461/2010, y:2481/2814, width:414/2010, height:218/2814}
		}
	}

	var stylePath = style == 'Nyx' ? 'nyx/' : '';

	var frame = {
		'name': frameName + ' Frame',
		'src': '/img/frames/8th/' + stylePath + letter.toLowerCase() + '.png',
	}

	if (letter.includes('L') && letter.length > 1) {
		frame.src = frame.src.replace(('m15Frame' + letter), 'l' + letter[0].toLowerCase())
	}

	if (mask) {
		frame.masks = [
			{
				'src': '/img/frames/8th/' + mask.toLowerCase() + '.png',
				'name': mask
			}
		]

		if (maskToRightHalf) {
			frame.masks.push({
				'src': '/img/frames/maskRightHalf.png',
				'name': 'Right Half'
			});
		}
	} else {
		frame.masks = [];
	}

	return frame;
}
function makeExtendedArtFrameByLetter(letter, mask = false, maskToRightHalf = false, style = 'regular', short = false) {
	letter = letter.toUpperCase();
	var frameNames = {
		'W': 'White',
		'U': 'Blue',
		'B': 'Black',
		'R': 'Red',
		'G': 'Green',
		'M': 'Multicolored',
		'A': 'Artifact',
		'L': 'Land',
		'C': 'Colorless',
		'V': 'Vehicle',
		'WL': 'White Land',
		'UL': 'Blue Land',
		'BL': 'Black Land',
		'RL': 'Red Land',
		'GL': 'Green Land',
		'ML': 'Multicolored Land'
	}

	if ((mask.includes('Crown') || mask == 'PT' || mask.includes('Stamp')) && letter.includes('L') && letter.length > 1) {
		letter = letter[0];
	}

	var frameName = frameNames[letter];

	if (mask == "Crown Border Cover") {
		return {
			'name': 'Legend Crown Border Cover',
			'src': '/img/black.png',
			'masks': [],
			'bounds': {
				'height': 0.0177,
				'width': 0.9214,
				'x': 0.0394,
				'y': 0.0277
			}
		}
	}

	if (mask == "Legend Crown Outline") {
		return {
			'name': 'Legend Crown Outline',
			'src': '/img/frames/m15/crowns/m15CrownFloatingOutline.png',
			'masks': [],
			'bounds': {
				'height': 0.1062,
				'width': 0.944,
				'x': 0.028,
				'y': 0.0172
			}
		};
	}

	if (mask == "Crown") {
		var frame = {
			'name': frameName + ' Legend Crown',
			'src': '/img/frames/m15/crowns/m15Crown' + letter + 'Floating.png',
			'masks': [],
			'bounds': {
				'height': 0.1024,
				'width': 0.9387,
				'x': 0.0307,
				'y': 0.0191
			}
		}
		if (maskToRightHalf) {
			frame.masks.push({
				'src': '/img/frames/maskRightHalf.png',
				'name': 'Right Half'
			});
		}
		return frame;
	}

	if (mask == "Crown Outline") {
		var frame = {
			'name': 'Legend Crown Outline',
			'src': '/img/frames/m15/crowns/m15CrownFloatingOutline.png',
			'masks': [],
			'bounds': {
				'height': 0.1062,
				'width': 0.944,
				'x': 0.028,
				'y': 0.0172
			}
		}
		if (maskToRightHalf) {
			frame.masks.push({
				'src': '/img/frames/maskRightHalf.png',
				'name': 'Right Half'
			});
		}
		return frame;
	}

	if (mask == "Inner Crown") {
		var frame = {
			'name': frameName + '(' + style + ')' + mask,
			'src': '/img/frames/m15/innerCrowns/m15InnerCrown' + letter + style + '.png',
			'masks': [],
			'bounds': {
				'height': 0.0239,
				'width': 0.672,
				'x': 0.164,
				'y': 0.0239
			}
		}
		if (maskToRightHalf) {
			frame.masks.push({
				'src': '/img/frames/maskRightHalf.png',
				'name': 'Right Half'
			});
		}
		return frame;
	}

	if (mask == 'PT') {
		return {
			'name': frameName + ' Power/Toughness',
			'src': '/img/frames/m15/regular/m15PT' + letter + '.png',
			'masks': [],
			'bounds': {
				'height': 0.0733,
				'width': 0.188,
				'x': 0.7573,
				'y': 0.8848
			}
		}
	}

	var frame = {
		'name': frameName + ' Frame'
	}

	if (style != 'regular') {
		frame.src = '/img/frames/extended/regular/' + style.toLowerCase() + '/' + letter.toLowerCase() + '.png';
		if (short) {
			frame.src = frame.src.replace('/regular/', '/shorter/');
		}
	} else if (short) {
		frame.src = '/img/frames/m15/boxTopper/short/' + letter.toLowerCase() + '.png';
	} else {
		frame.src = '/img/frames/m15/boxTopper/m15BoxTopperFrame' + letter + '.png';
	}

	if (mask) {
		if (mask == 'Title Cutout') {
			if (short) {
				frame.masks = [
					{
						'src': '/img/frames/extended/shorter/titleCutout.png',
						'name': 'Title Cutout'
					}
				]
			} else {
				frame.masks = [
					{
						'src': '/img/frames/m15/boxTopper/m15BoxTopperTitleCutout.png',
						'name': 'Title Cutout'
					}
				]
			}
		} else if (short && ['Frame', 'Rules', 'Type', 'Pinline'].includes(mask)) {
			var extension = mask == 'Type' ? '.png' : '.svg';

			frame.masks = [
				{
					'src': '/img/frames/m15/boxTopper/short/' + mask.toLowerCase().replace('rules', 'text') + extension,
					'name': mask
				}
			]
		} else {
			frame.masks = [
				{
					'src': '/img/frames/m15/regular/m15Mask' + mask + '.png',
					'name': mask
				}
			]
		}

		if (maskToRightHalf) {
			frame.masks.push({
				'src': '/img/frames/maskRightHalf.png',
				'name': 'Right Half'
			});
		}
	} else {
		frame.masks = [];
	}

	return frame;
}
function makeUBFrameByLetter(letter, mask = false, maskToRightHalf = false, style = false) {
	letter = letter.toUpperCase();

	if (letter == 'C') {
		letter = 'L';
	}

	var frameNames = {
		'W': 'White',
		'U': 'Blue',
		'B': 'Black',
		'R': 'Red',
		'G': 'Green',
		'M': 'Multicolored',
		'A': 'Artifact',
		'L': 'Land',
		'C': 'Colorless',
		'V': 'Vehicle',
		'WL': 'White Land',
		'UL': 'Blue Land',
		'BL': 'Black Land',
		'RL': 'Red Land',
		'GL': 'Green Land',
		'ML': 'Multicolored Land',
		'WE': 'White Enchantment',
		'UE': 'Blue Enchantment',
		'BE': 'Black Enchantment',
		'RE': 'Red Enchantment',
		'GE': 'Green Enchantment',
		'ME': 'Multicolored Enchantment',
		'AE': 'Artifact Enchantment'
	};

	if (style == 'Nyx') {
		letter = letter + 'E';
	}

	if ((mask.includes('Crown') || mask == 'PT' || mask.includes('Stamp')) && (letter.includes('L') || letter.includes('E')) && letter.length > 1) {
		letter = letter[0];
	}

	var frameName = frameNames[letter];

	if (mask == "Crown Border Cover") {
		return {
			'name': 'Legend Crown Border Cover',
			'src': '/img/black.png',
			'masks': [],
			'bounds': {
				'height': 0.0177,
				'width': 0.9214,
				'x': 0.0394,
				'y': 0.0277
			}
		}
	}

	if (mask == "Crown") {
		var frame = {
			'name': frameName + ' Legend Crown',
			'src': '/img/frames/m15/ub/crowns/m15Crown' + letter + '.png',
			'masks': [],
			'bounds': {
				'height': 0.1667,
				'width': 0.9454,
				'x': 0.0274,
				'y': 0.0191
			}
		}
		if (maskToRightHalf) {
			frame.masks.push({
				'src': '/img/frames/maskRightHalf.png',
				'name': 'Right Half'
			});
		}
		return frame;
	} else if (mask == "Stamp") {
		var frame = {
			'name': frameName + ' Holo Stamp',
			'src': '/img/frames/m15/ub/regular/stamp/' + letter.toLowerCase() + '.png',
			'masks': [],
			'bounds': {
				'height': 0.0486,
				'width': 0.1494,
				'x': 0.4254,
				'y': 0.9005
			}
		}
		if (maskToRightHalf) {
			frame.masks.push({
				'src': '/img/frames/maskRightHalf.png',
				'name': 'Right Half'
			});
		}
		return frame;
	}

	if (mask == "Inner Crown") {
		var frame = {
			'name': frameName + ' ' + mask + ' (' + style + ')',
			'src': '/img/frames/m15/innerCrowns/m15InnerCrown' + letter + style + 'UB.png',
			'masks': [],
			'bounds': {
				'height': 0.0239,
				'width': 0.672,
				'x': 0.164,
				'y': 0.0239
			}
		}
		if (maskToRightHalf) {
			frame.masks.push({
				'src': '/img/frames/maskRightHalf.png',
				'name': 'Right Half'
			});
		}
		return frame;
	}

	if (mask == 'PT') {
		return {
			'name': frameName + ' Power/Toughness',
			'src': '/img/frames/m15/ub/pt/' + (letter == 'L' ? 'C' : letter).toLowerCase() + '.png',
			'masks': [],
			'bounds': {
				'height': 0.0733,
				'width': 0.188,
				'x': 0.7573,
				'y': 0.8848
			}
		}
	}

	var frame = {
		'name': frameName + ' Frame',
		'src': '/img/frames/m15/ub/regular/' + letter.toLowerCase() + '.png',
	}

	if (mask) {
		frame.masks = [
			{
				'src': '/img/frames/m15/regular/m15Mask' + mask + '.png',
				'name': mask
			}
		]

		if (maskToRightHalf) {
			frame.masks.push({
				'src': '/img/frames/maskRightHalf.png',
				'name': 'Right Half'
			});
		}
	} else {
		frame.masks = [];
	}

	return frame;
}
function makeCircuitFrameByLetter(letter, mask = false, maskToRightHalf = false) {
	letter = letter.toUpperCase();

	if (letter == 'C') {
		letter = 'L';
	}

	var frameNames = {
		'W': 'White',
		'U': 'Blue',
		'B': 'Black',
		'R': 'Red',
		'G': 'Green',
		'M': 'Multicolored',
		'A': 'Artifact',
		'L': 'Land',
		'C': 'Colorless',
		'V': 'Vehicle',
		'WL': 'White Land',
		'UL': 'Blue Land',
		'BL': 'Black Land',
		'RL': 'Red Land',
		'GL': 'Green Land',
		'ML': 'Multicolored Land'
	}

	if ((mask.includes('Crown') || mask == 'PT' || mask.includes('Stamp')) && letter.includes('L') && letter.length > 1) {
		letter = letter[0];
	}

	var frameName = frameNames[letter];

	if (mask == "Crown Border Cover") {
		return {
			'name': 'Legend Crown Border Cover',
			'src': '/img/black.png',
			'masks': [],
			'bounds': {
				'height': 0.0177,
				'width': 0.9214,
				'x': 0.0394,
				'y': 0.0277
			}
		}
	}

	if (mask == "Crown") {
		var frame = {
			'name': frameName + ' Legend Crown',
			'src': '/img/frames/m15/ub/crowns/m15Crown' + letter + '.png',
			'masks': [],
			'bounds': {
				'height': 0.1667,
				'width': 0.9454,
				'x': 0.0274,
				'y': 0.0191
			}
		}
		if (maskToRightHalf) {
			frame.masks.push({
				'src': '/img/frames/maskRightHalf.png',
				'name': 'Right Half'
			});
		}
		return frame;
	}

	if (mask == 'PT') {
		return {
			'name': frameName + ' Power/Toughness',
			'src': '/img/frames/m15/ub/pt/' + (letter == 'L' ? 'C' : letter).toLowerCase() + '.png',
			'masks': [],
			'bounds': {
				'height': 0.0733,
				'width': 0.188,
				'x': 0.7573,
				'y': 0.8848
			}
		}
	}

	var frame = {
		'name': frameName + ' Frame',
		'src': '/img/frames/custom/circuit/' + letter.toLowerCase() + '.png',
	}

	if (mask) {
		frame.masks = [
			{
				'src': '/img/frames/m15/regular/m15Mask' + mask + '.png',
				'name': mask
			}
		]

		if (maskToRightHalf) {
			frame.masks.push({
				'src': '/img/frames/maskRightHalf.png',
				'name': 'Right Half'
			});
		}
	} else {
		frame.masks = [];
	}

	return frame;
}
function makeEtchedFrameByLetter(letter, mask = false, maskToRightHalf = false, style = 'regular') {
	letter = letter.toUpperCase();
	var frameNames = {
		'W': 'White',
		'U': 'Blue',
		'B': 'Black',
		'R': 'Red',
		'G': 'Green',
		'M': 'Multicolored',
		'A': 'Artifact',
		'L': 'Land',
		'C': 'Colorless',
		'V': 'Vehicle'
	}

	if (mask == 'PT' && letter.includes('L') && letter.length > 1) {
		letter = letter[0];
	}

	if (letter == 'ML') {
		letter = 'M';
	} else if (letter.includes('L') && letter.length > 1) {
		letter = letter[0];
	} else if (letter == 'V' && mask == 'Crown') {
		letter = 'A';
	}

	var frameName = frameNames[letter];

	if (mask == "Crown Border Cover") {
		return {
			'name': 'Legend Crown Cover',
			'src': '/img/frames/etched/regular/crowns/cover.svg',
			'masks': [],
			'bounds': {	}
		}
	}

	if (mask == "Crown") {
		var frame = {
			'name': frameName + ' Legend Crown',
			'src': '/img/frames/etched/regular/crowns/' + letter.toLowerCase() + '.png',
			'masks': [],
			'bounds': {
				'height': 0.092,
				'width': 0.9387,
				'x': 0.0307,
				'y': 0.0191
			}
		}
		if (maskToRightHalf) {
			frame.masks.push({
				'src': '/img/frames/maskRightHalf.png',
				'name': 'Right Half'
			});
		}
		return frame;
	}

	if (mask == "Inner Crown") {
		var frame = {
			'name': frameName + ' Inner Crown',
			'src': '/img/frames/etched/regular/innerCrowns/' + style.toLowerCase() + '/' + letter.toLowerCase() + '.png',
			'masks': [],
			'bounds': {x:244/1500, y:51/2100, width:1012/1500, height:64/2100}
		}
		if (maskToRightHalf) {
			frame.masks.push({
				'src': '/img/frames/maskRightHalf.png',
				'name': 'Right Half'
			});
		}
		return frame;
	}

	if (mask == 'PT') {
		return {
			'name': frameName + ' Power/Toughness',
			'src': '/img/frames/etched/regular/pt/' + letter.toLowerCase() + '.png',
			'masks': [],
			'bounds': {
				'height': 0.0733,
				'width': 0.188,
				'x': 0.7573,
				'y': 0.8848
			}
		}
	}

	var frame = {
		'name': frameName + ' Frame',
		'src': '/img/frames/etched/regular/' + letter.toLowerCase() + '.png',
	}

	if (style != 'regular') {
		frame.src = frame.src.replace('/regular/', '/regular/' + style.toLowerCase() + '/');
		frame.name = frame.name += ' (' + style +')';
	}

	if (mask) {
		frame.masks = [
			{
				'src': '/img/frames/etched/regular/' + mask.toLowerCase() + '.svg',
				'name': mask
			}
		]

		if (maskToRightHalf) {
			frame.masks.push({
				'src': '/img/frames/maskRightHalf.png',
				'name': 'Right Half'
			});
		}
	} else {
		frame.masks = [];
	}

	return frame;
}
function makePhyrexianFrameByLetter(letter, mask = false, maskToRightHalf = false) {
	if (letter == 'C' || letter == 'V') {
		letter = 'L';
	}

	if (mask == 'Rules') {
		mask = 'Rules Text';
	}

	letter = letter.toUpperCase();
	var frameNames = {
		'W': 'White',
		'U': 'Blue',
		'B': 'Black',
		'R': 'Red',
		'G': 'Green',
		'M': 'Multicolored',
		'A': 'Artifact',
		'L': 'Land'
	}

	if (mask == 'PT' && letter.includes('L') && letter.length > 1) {
		letter = letter[0];
	}

	if (letter == 'ML') {
		letter = 'M';
	} else if (letter.includes('L') && letter.length > 1) {
		letter = letter[0];
	}

	var frameName = frameNames[letter];

	if (mask == "Crown") {
		var frame = {
			'name': frameName + ' Legendary Crown',
			'src': '/img/frames/m15/praetors/' + letter.toLowerCase() + 'Crown.png',
			'masks': [],
			'bounds': {
				'height': 100/2100,
				'width': 1,
				'x': 0,
				'y': 0
			}
		}
		if (maskToRightHalf) {
			frame.masks.push({
				'src': '/img/frames/maskRightHalf.png',
				'name': 'Right Half'
			});
		}
		return frame;
	}

	if (mask == 'PT') {
		return {
			'name': frameName + ' Power/Toughness',
			'src': '/img/frames/m15/praetors/' + letter.toLowerCase() + 'pt.png',
			'masks': [],
			'bounds': {
				'height': 0.0772,
				'width': 0.212,
				'x': 0.746,
				'y': 0.8858
			}
		}
	}

	var frame = {
		'name': frameName + ' Frame',
		'src': '/img/frames/m15/praetors/' + letter.toLowerCase() + '.png',
	}

	if (mask == 'Type' || mask == 'Title') {
		frame.masks = [
			{
				'src': '/img/frames/m15/regular/m15Mask' + mask + '.png',
				'name': mask
			}
		]

		if (maskToRightHalf) {
			frame.masks.push({
				'src': '/img/frames/maskRightHalf.png',
				'name': 'Right Half'
			});
		}
	} else if (mask) {
		var extension = "png";
		var name = mask.toLowerCase();
		if (mask == 'Frame') {
			extension = 'svg';
		} else if (mask == 'Rules Text') {
			extension = 'svg';
			name = 'text';
		}

		frame.masks = [
			{
				'src': '/img/frames/m15/praetors/' + name + '.' + extension,
				'name': mask
			}
		]

		if (maskToRightHalf) {
			frame.masks.push({
				'src': '/img/frames/maskRightHalf.png',
				'name': 'Right Half'
			});
		}
	} else {
		frame.masks = [];
	}

	return frame;
}
function makeSeventhEditionFrameByLetter(letter, mask = false, maskToRightHalf = false) {
	letter = letter.toUpperCase();
	var frameNames = {
		'W': 'White',
		'U': 'Blue',
		'B': 'Black',
		'R': 'Red',
		'G': 'Green',
		'M': 'Multicolored',
		'A': 'Artifact',
		'L': 'Land',
		'C': 'Colorless',
		'V': 'Vehicle',
		'WL': 'White Land',
		'UL': 'Blue Land',
		'BL': 'Black Land',
		'RL': 'Red Land',
		'GL': 'Green Land'
	}

	if (letter == 'V') {
		letter = 'A';
	}

	if (letter == 'ML') {
		letter = 'L';
	}

	var frameName = frameNames[letter];

	var frame = {
		'name': frameName + ' Frame',
		'src': '/img/frames/seventh/regular/' + letter.toLowerCase() + '.png'
	};

	if (mask) {
		if (mask == 'Textbox Pinline') {
			frame.masks = [
				{
					'src': '/img/frames/seventh/regular/trim.svg',
					'name': 'Textbox Pinline'
				}
			]
		} else {
			frame.masks = [
				{
					'src': '/img/frames/seventh/regular/' + mask.toLowerCase() + '.svg',
					'name': mask
				}
			]
		}

		if (maskToRightHalf) {
			frame.masks.push({
				'src': '/img/frames/maskRightHalf.png',
				'name': 'Right Half'
			});
		}
	} else {
		frame.masks = [];
	}

	return frame;
}
function createFrameImage() {
	const image = createAnonymousImage(blank.src);
	image.onload = drawFrames;
	return image;
}
async function addFrame(additionalMasks = [], loadingFrame = false) {
	var frameToAdd = JSON.parse(JSON.stringify(availableFrames[selectedFrameIndex]));
	var maskThumbnail = true;
	if (!loadingFrame) {
		// The frame is being added manually by the user, so we must process which mask(s) they have selected
		var noDefaultMask = 0;
		if (frameToAdd.noDefaultMask) {noDefaultMask = 1;}
		if (frameToAdd.masks && selectedMaskIndex + noDefaultMask > 0) {
			frameToAdd.masks = frameToAdd.masks.slice(selectedMaskIndex - 1 + noDefaultMask, selectedMaskIndex + noDefaultMask);
		} else {
		 	frameToAdd.masks = [];
		 	maskThumbnail = false;
		}
		additionalMasks.forEach(item => {
			if (item.name in replacementMasks) {
				const replacement = replacementMasks[item.name];
				if (typeof replacement === 'string') {
					// String value: just replace the src
					item.src = replacement;
				} else if (typeof replacement === 'object') {
					// Object value: merge properties
					Object.assign(item, replacement);
				}
			}
			frameToAdd.masks.push(item);
		});
		// Check if any mask has preserveAlpha and transfer it to the frame
		frameToAdd.masks.forEach(mask => {
			if (mask.preserveAlpha) {
				frameToAdd.preserveAlpha = true;
			}
		});
		// Likewise, we now add any complementary frames
		if ('complementary' in frameToAdd && frameToAdd.masks.length == 0) {
			if (typeof frameToAdd.complementary == 'number') {
				frameToAdd.complementary = [frameToAdd.complementary];
			} else if (typeof frameToAdd.complementary == 'string') {
				availableFrames.forEach((availableFrame, index, availableFrames) => {
				  if (availableFrame.name == frameToAdd.complementary) {
				  	frameToAdd.complementary = [index];
				  }
				})
			}
			const realFrameIndex = selectedFrameIndex;
			for (const index of frameToAdd.complementary) {
				selectedFrameIndex = index;
				await addFrame();
			}
			selectedFrameIndex = realFrameIndex;
		}
	} else {
		frameToAdd = loadingFrame;
		if (frameToAdd.masks.length == 0 || (frameToAdd.masks[0].src.includes('/img/frames/mask'))) {
			maskThumbnail = false;
		}
	}
	try {
		await waitForFrameAssetsReady(frameToAdd, !loadingFrame && !frameAssetAddBusy);
	} catch {
		return;
	}
	frameToAdd.masks.forEach(item => {
		item.image = createFrameImage();
		ImageLoadTracker.track(fixUri(item.src));
		item.image.src = fixUri(item.src);
	});
	frameToAdd.image = createFrameImage();
	if ('stretch' in frameToAdd) {
		stretchSVG(frameToAdd);
	} else {
		ImageLoadTracker.track(fixUri(frameToAdd.src));
		frameToAdd.image.src = fixUri(frameToAdd.src);
	}
	if (!loadingFrame) {
		card.frames.unshift(frameToAdd);
	}
	var frameElement = document.createElement('div');
	frameElement.classList = 'draggable frame-element';
	frameElement.draggable = 'true';
	frameElement.ondragstart = dragStart;
	frameElement.ondragend = dragEnd;
	frameElement.ondragover = dragOver;
	frameElement.ontouchstart = dragStart;
	frameElement.ontouchend = dragEnd;
	frameElement.ontouchmove = touchMove;
	frameElement.onclick = frameElementClicked;
	var frameElementImage = document.createElement('img');
	if (frameToAdd.noThumb || frameToAdd.src.includes('/img/black.png')) {
		frameElementImage.src = fixUri(frameToAdd.src);
	} else {
		frameElementImage.src = fixUri(frameToAdd.src.replace('.png', 'Thumb.png'));
	}
	frameElement.appendChild(frameElementImage);
	var frameElementMask = document.createElement('img');
	if (maskThumbnail) {
		frameElementMask.src = fixUri(frameToAdd.masks[0].src.replace('.png', 'Thumb.png'));
	} else {
		frameElementMask.src = black.src;
	}
	frameElement.appendChild(frameElementMask);
	var frameElementLabel = document.createElement('h4');
	frameElementLabel.innerHTML = frameToAdd.name;
	frameToAdd.masks.forEach(item => frameElementLabel.innerHTML += ', ' + item.name);
	frameElement.appendChild(frameElementLabel);
	var frameElementClose = document.createElement('h4');
	frameElementClose.innerHTML = 'X';
	frameElementClose.classList = 'frame-element-close';
	frameElementClose.onclick = removeFrame;
	frameElement.appendChild(frameElementClose);
	document.querySelector('#frame-list').prepend(frameElement);
	bottomInfoEdited();
}
function removeFrame(event) {
	card.frames.splice(getElementIndex(event.target.parentElement), 1);
	event.target.parentElement.remove();
	drawFrames();
	bottomInfoEdited();
}
function frameElementClicked(event) {
	if (!event.target.classList.contains('frame-element-close')) {
		var selectedFrameElement = event.target.closest('.frame-element');
		selectedFrame = card.frames[Array.from(selectedFrameElement.parentElement.children).indexOf(selectedFrameElement)];
		document.querySelector('#frame-element-editor').classList.add('opened');
		selectedFrame.bounds = selectedFrame.bounds || {};
		if (selectedFrame.ogBounds == undefined) {
			selectedFrame.ogBounds = JSON.parse(JSON.stringify(selectedFrame.bounds));
		}
		// Basic manipulations
		document.querySelector('#frame-editor-x').value = scaleWidth(selectedFrame.bounds.x || 0);
		document.querySelector('#frame-editor-x').onchange = (event) => {selectedFrame.bounds.x = (event.target.value / card.width); drawFrames();}
		document.querySelector('#frame-editor-y').value = scaleHeight(selectedFrame.bounds.y || 0);
		document.querySelector('#frame-editor-y').onchange = (event) => {selectedFrame.bounds.y = (event.target.value / card.height); drawFrames();}
		document.querySelector('#frame-editor-width').value = scaleWidth(selectedFrame.bounds.width || 1);
		document.querySelector('#frame-editor-width').onchange = (event) => {selectedFrame.bounds.width = (event.target.value / card.width); drawFrames();}
		document.querySelector('#frame-editor-height').value = scaleHeight(selectedFrame.bounds.height || 1);
		document.querySelector('#frame-editor-height').onchange = (event) => {selectedFrame.bounds.height = (event.target.value / card.height); drawFrames();}
		document.querySelector('#frame-editor-opacity').value = selectedFrame.opacity || 100;
		document.querySelector('#frame-editor-opacity').onchange = (event) => {selectedFrame.opacity = event.target.value; drawFrames();}
		document.querySelector('#frame-editor-erase').checked = selectedFrame.erase || false;
		document.querySelector('#frame-editor-erase').onchange = (event) => {selectedFrame.erase = event.target.checked; drawFrames();}
		document.querySelector('#frame-editor-alpha').checked = selectedFrame.preserveAlpha || false;
		document.querySelector('#frame-editor-alpha').onchange = (event) => {selectedFrame.preserveAlpha = event.target.checked; drawFrames();}
		document.querySelector('#frame-editor-color-overlay-check').checked = selectedFrame.colorOverlayCheck || false;
		document.querySelector('#frame-editor-color-overlay-check').onchange = (event) => {selectedFrame.colorOverlayCheck = event.target.checked; drawFrames();}
		document.querySelector('#frame-editor-color-overlay').value = selectedFrame.colorOverlay || false;
		document.querySelector('#frame-editor-color-overlay').onchange = (event) => {selectedFrame.colorOverlay = event.target.value; drawFrames();}
		document.querySelector('#frame-editor-hsl-hue').value = selectedFrame.hslHue || 0;
		document.querySelector('#frame-editor-hsl-hue-slider').value = selectedFrame.hslHue || 0;
		document.querySelector('#frame-editor-hsl-hue').onchange = (event) => {selectedFrame.hslHue = event.target.value; drawFrames();}
		document.querySelector('#frame-editor-hsl-hue-slider').onchange = (event) => {selectedFrame.hslHue = event.target.value; drawFrames();}
		document.querySelector('#frame-editor-hsl-saturation').value = selectedFrame.hslSaturation || 0;
		document.querySelector('#frame-editor-hsl-saturation-slider').value = selectedFrame.hslSaturation || 0;
		document.querySelector('#frame-editor-hsl-saturation').onchange = (event) => {selectedFrame.hslSaturation = event.target.value; drawFrames();}
		document.querySelector('#frame-editor-hsl-saturation-slider').onchange = (event) => {selectedFrame.hslSaturation = event.target.value; drawFrames();}
		document.querySelector('#frame-editor-hsl-lightness').value = selectedFrame.hslLightness || 0;
		document.querySelector('#frame-editor-hsl-lightness-slider').value = selectedFrame.hslLightness || 0;
		document.querySelector('#frame-editor-hsl-lightness').onchange = (event) => {selectedFrame.hslLightness = event.target.value; drawFrames();}
		document.querySelector('#frame-editor-hsl-lightness-slider').onchange = (event) => {selectedFrame.hslLightness = event.target.value; drawFrames();}
		// Removing masks
		const selectMaskElement = document.querySelector('#frame-editor-masks');
		selectMaskElement.innerHTML = null;
		const maskOptionNone = document.createElement('option');
		maskOptionNone.disabled = true;
		maskOptionNone.innerHTML = 'None Selected';
		selectMaskElement.appendChild(maskOptionNone);
		selectedFrame.masks.forEach(mask => {
			const maskOption = document.createElement('option');
			maskOption.innerHTML = mask.name;
			selectMaskElement.appendChild(maskOption);
		});
		selectMaskElement.selectedIndex = 0;
	}
}
function frameElementMaskRemoved() {
	const selectElement = document.querySelector('#frame-editor-masks');
	const selectedOption = selectElement.value;
	if (selectedOption != 'None Selected') {
		selectElement.remove(selectElement.selectedIndex);
		selectElement.selectedIndex = 0;
		selectedFrame.masks.forEach(mask => {
			if (mask.name == selectedOption) {
				selectedFrame.masks = selectedFrame.masks.filter(item => item.name != selectedOption);
				drawFrames();
			}
		});
	}
}
function uploadMaskOption(imageSource) {
	const uploadedMask = {name:`Uploaded Image (${customCount})`, src:imageSource, noThumb:true, image: createImageWithLoadHandler(imageSource, drawFrames)};
	customCount ++;
	selectedFrame.masks.push(uploadedMask);
}
function uploadFrameOption(imageSource) {
	const uploadedFrame = {name:`Uploaded Image (${customCount})`, src:imageSource, noThumb:true};
	customCount ++;
	availableFrames.push(uploadedFrame);
	loadFramePack();
}
function hsl(canvas, inputH, inputS, inputL) {
	//adjust inputs
	var hue = parseInt(inputH) / 360;
	var saturation = parseInt(inputS) / 100;
	var lightness = parseInt(inputL) / 100;
	//create needed objects
	var context = canvas.getContext('2d')
	var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
	var pixels = imageData.data;
	//for every pixel...
	for (var i = 0; i < pixels.length; i += 4) {
		//grab rgb
		var r = pixels[i];
		var g = pixels[i + 1];
		var b = pixels[i + 2];
		//convert to hsl
		var res = rgbToHSL(r, g, b);
		h = res[0];
		s = res[1];
		l = res[2];
		//make adjustments
		h += hue;
		while (h > 1) {h --;}
		s = Math.min(Math.max(s + saturation, 0), 1);
		l = Math.min(Math.max(l + lightness, 0), 1);
		//convert back to rgb
		res = hslToRGB(h, s, l);
		r = res[0];
		g = res[1];
		b = res[2];
		//and reassign
		pixels[i] = r;
		pixels[i + 1] = g;
		pixels[i + 2] = b;
	}
	//then put the new image data back
	context.putImageData(imageData, 0, 0);
}
function croppedCanvas(oldCanvas, sensitivity = 0) {
	var oldContext = oldCanvas.getContext('2d');
	var newCanvas = document.createElement('canvas');
	var newContext = newCanvas.getContext('2d');
	var pixels = oldContext.getImageData(0, 0, oldCanvas.width, oldCanvas.height).data;
	var pixX = [];
	var pixY = [];
	for (var x = 0; x < oldCanvas.width; x += 1) {
		for (var y = 0; y < oldCanvas.height; y += 1) {
			if (pixels[(y * oldCanvas.width + x) * 4 + 3] > sensitivity) {
				pixX.push(x);
				pixY.push(y);
			}
		}
	}
	pixX.sort(function(a, b) { return a - b });
	pixY.sort(function(a, b) { return a - b });
	var n = pixX.length - 1;
	var newWidth = 1 + pixX[n] - pixX[0];
	var newHeight = 1 + pixY[n] - pixY[0];
	newCanvas.width = newWidth;
	newCanvas.height = newHeight;
	newContext.putImageData(oldCanvas.getContext('2d').getImageData(pixX[0], pixY[0], newWidth, newHeight), 0, 0);
	return newCanvas;
}
/*
shoutout to https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion for providing the hsl-rgb conversion algorithms
*/
function rgbToHSL(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}
function hslToRGB(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
//TEXT TAB
var writingText;
var autoFrameTimer;
function loadTextOptions(textObject, replace=true) {
	var oldCardText = card.text || {};
	Object.entries(oldCardText).forEach(item => {
		savedTextContents[item[0]] = oldCardText[item[0]].text;
	});
	if (replace) {
		card.text = textObject;
	} else {
		Object.keys(textObject).forEach(key => {
			card.text[key] = textObject[key];
		});
	}
	document.querySelector('#text-options').innerHTML = null;
	Object.entries(card.text).forEach(item => {
		if (oldCardText[item[0]]) {
			card.text[item[0]].text = oldCardText[item[0]].text;
		} else if (savedTextContents[item[0]]) {
			card.text[item[0]].text = savedTextContents[item[0]];
		}
		var textOptionElement = document.createElement('h4');
		textOptionElement.innerHTML = item[1].name;
		textOptionElement.classList = 'selectable text-option'
		textOptionElement.onclick = textOptionClicked;
		document.querySelector('#text-options').appendChild(textOptionElement);
	});
	document.querySelector('#text-options').firstChild.click();
	drawTextBuffer();
	drawNewGuidelines();
}
function textOptionClicked(event) {
	selectedTextIndex = getElementIndex(event.target);
	var selectedTextField = getSelectedTextField(card.text, selectedTextIndex);
	document.querySelector('#text-editor').value = selectedTextField.text;

	document.querySelector('#text-editor-font-size').value = selectedTextField.fontSize ?? 0;
	selectSelectable(event);
}
function textboxEditor() {
	var selectedTextbox = getSelectedTextField(card.text, selectedTextIndex);
	document.querySelector('#textbox-editor').classList.add('opened');
	document.querySelector('#textbox-editor-x').value = scaleWidth(selectedTextbox.x || 0);
	document.querySelector('#textbox-editor-x').onchange = (event) => {selectedTextbox.x = (event.target.value / card.width); textEdited();}
	document.querySelector('#textbox-editor-y').value = scaleHeight(selectedTextbox.y || 0);
	document.querySelector('#textbox-editor-y').onchange = (event) => {selectedTextbox.y = (event.target.value / card.height); textEdited();}
	document.querySelector('#textbox-editor-width').value = scaleWidth(selectedTextbox.width || 1);
	document.querySelector('#textbox-editor-width').onchange = (event) => {selectedTextbox.width = (event.target.value / card.width); textEdited();}
	document.querySelector('#textbox-editor-height').value = scaleHeight(selectedTextbox.height || 1);
	document.querySelector('#textbox-editor-height').onchange = (event) => {selectedTextbox.height = (event.target.value / card.height); textEdited();}
}
function textEdited(source = '') {
	getSelectedTextField(card.text, selectedTextIndex).text = curlyQuotes(document.querySelector('#text-editor').value);
	drawTextBuffer();
	if (source == '') {
		autoFrameBuffer();
	}
}
function fontSizedEdited() {
	getSelectedTextField(card.text, selectedTextIndex).fontSize = document.querySelector('#text-editor-font-size').value;
	drawTextBuffer();
}
function drawTextBuffer() {
	clearTimeout(writingText);
	
	writingText = setTimeout(drawText, 500);
}
function autoFrameBuffer() {
	clearTimeout(autoFrameTimer);
	autoFrameTimer = setTimeout(autoFrame, 500);
}
async function drawText() {
	await ensureTextFontsReady(Object.values(card.text));
	textContext.clearRect(0, 0, textCanvas.width, textCanvas.height);
	prePTContext.clearRect(0, 0, prePTCanvas.width, prePTCanvas.height);
	drawTextBetweenFrames = false;
	for (var textObject of Object.entries(card.text)) {
		await writeText(textObject[1], textContext);
		continue;
	}
	if (drawTextBetweenFrames || redrawFrames) {
		drawFrames();
		if (!drawTextBetweenFrames) {
			redrawFrames = false;
		}
	} else {
		drawCard();
	}
}
var justifyWidth = 90;
var Last = "";
var Chinese = false;
let manaSymbolsToRender = [];
function writeText(textObject, targetContext) {
	manaSymbolsToRender = [];
	//Most bits of info about text loaded, with defaults when needed
	var textX = scaleX(textObject.x) || scaleX(0);
	var textY = scaleY(textObject.y) || scaleY(0);
	var textWidth = scaleWidth(textObject.width) || scaleWidth(1);
	var textHeight = scaleHeight(textObject.height) || scaleHeight(1);
	var startingTextSize = scaleHeight(textObject.size) || scaleHeight(0.038);
	var textFontHeightRatio = 0.7;
	var textBounded = textObject.bounded || true;
	var textOneLine = textObject.oneLine || false;
	var textManaCost = textObject.manaCost || false;
	var textAllCaps = textObject.allCaps || false;
	var textManaSpacing = scaleWidth(textObject.manaSpacing) || 0;
	//Buffers the canvases accordingly
	var canvasMargin = 300;
	paragraphCanvas.width = textWidth + 2 * canvasMargin;
	paragraphCanvas.height = textHeight + 2 * canvasMargin;
	lineCanvas.width = textWidth + 2 * canvasMargin;
	lineCanvas.height = startingTextSize + 2 * canvasMargin;
	//Preps the text string
	var splitString = '6GJt7eL8';
	var rawText = textObject.text

	rawText = applyWriteTextReminderOptions(
		rawText,
		textObject,
		document.querySelector('#hide-reminder-text').checked,
		document.querySelector('#italicize-reminder-text').checked
	);
	rawText = normalizeWriteTextRawText(rawText, {
		textObject,
		textAllCaps,
		copyrightText: params.get('copyright'),
		hasMargins: card.margins,
		getInlineCardNameValue: getInlineCardName,
		hasArtist: document.querySelector('#info-artist').value != '',
		cardVersion: card.version,
		showsFlavorBar: card.showsFlavorBar
	});
	var splitText = filterWriteTextManaCostTokens(tokenizeWriteTextRawText(rawText, splitString), textObject.manaCost);
	if (textObject.vertical) {
		splitText = buildWriteTextVerticalTokens(splitText, textManaCost, startingTextSize, scaleHeight(0.01));
	}
	// if (textManaCost && textObject.arcStart > 0) {
	// 	splitText.reverse();
	// }
	splitText.push('');
	//Manages the redraw loop
	var drawingText = true;
	//Repeatedly tries to draw the text at smaller and smaller sizes until it fits
	outerloop: while (drawingText) {
		manaSymbolsToRender = [];
		//Rest of the text info loaded that may have been changed by a previous attempt at drawing the text
		var textColor = getWriteTextInitialColor(textObject, card.frames);
		var textFont = textObject.font || 'mplantin';
		FontLoadTracker.track(textFont);
		var textAlign = textObject.align || 'left';
		var textJustify = textObject.justify || 'left';
		var textShadowSettings = getWriteTextShadowSettings(textObject);
		var textShadowColor = textShadowSettings.color;
		var textShadowOffsetX = textShadowSettings.offsetX;
		var textShadowOffsetY = textShadowSettings.offsetY;
		var textShadowBlur = textShadowSettings.blur;
		var textArcRadius = scaleHeight(textObject.arcRadius) || 0;
		var manaSymbolColor = textObject.manaSymbolColor || null;
		var textRotation = textObject.rotation || 0;
		if (textArcRadius > 0) {
			//Buffers the canvases accordingly
			var canvasMargin = 300 + textArcRadius;
			paragraphCanvas.width = textWidth + 2 * canvasMargin;
			paragraphCanvas.height = textHeight + 2 * canvasMargin;
			lineCanvas.width = textWidth + 2 * canvasMargin;
			lineCanvas.height = startingTextSize + 2 * canvasMargin;
		}
		var textArcStart = textObject.arcStart || 0;
		//Variables for tracking text position/size/font
		var currentX = 0;
		var startingCurrentX = 0;
		var currentY = 0;
		var lineY = 0;
		var newLine = false;
		var textFontExtension = '';
		var textFontStyle = textObject.fontStyle || '';
		var manaPlacementCounter = 0;
		var realTextAlign = textAlign;
		savedRollYPosition = null;
		var savedRollColor = 'black';
		var drawToPrePTCanvas = false;
		var widestLineWidth = 0;
		//variables that track various... things?
		var textSize = startingTextSize;
		var linespacing = 0;
		var newLineSpacing = (textObject.lineSpacing || 0) * textSize;
		var ptShift = [0, 0];
		var permaShift = [0, 0];
		var fillJustify = false;
		//Finish prepping canvases
		paragraphContext.clearRect(0, 0, paragraphCanvas.width, paragraphCanvas.height);
		lineContext.clearRect(0, 0, lineCanvas.width, lineCanvas.height);
		lineContext.letterSpacing = (scaleWidth(textObject.kerning) || 0) + 'px';
		// if (textFont == 'goudymedieval') {
		// 	lineCanvas.style.letterSpacing = '3.5px';
		// }
		textSize += parseInt(textObject.fontSize || '0');
		var textOutlineSettings = getWriteTextOutlineSettings(textObject, card);
		var textOutlineWidth = textOutlineSettings.width;
		applyWriteTextLineContextBaseStyles(lineContext, {
			font: buildWriteTextFontDeclaration(textFontStyle, textSize, textFont, textFontExtension),
			fillStyle: textColor,
			shadow: textShadowSettings,
			outline: textOutlineSettings
		});
		//Begin looping through words/codes
		innerloop: for (word of splitText) {
			// console.log("word: " + word);
			var wordToWrite = word;
			// console.log("wordToWrite: " + splitText);
			if(wordToWrite.includes("CStext")) {
				Chinese = true;
				linespacing = 0.08;
			}
			if (wordToWrite.includes('{') && wordToWrite.includes('}') || textManaCost || savedFont) {
				var possibleCode = wordToWrite.toLowerCase().replace('{', '').replace('}', '');
				var alignmentState = resolveWriteTextAlignmentCode(possibleCode, textAlign, textJustify, realTextAlign);
				var positionState = resolveWriteTextPositionCode(possibleCode, lineY, currentY, currentX);
				var shadowState = resolveWriteTextShadowCode(possibleCode, {
					color: textShadowColor,
					offsetX: textShadowOffsetX,
					offsetY: textShadowOffsetY,
					blur: textShadowBlur
				});
				var lineStyleState = resolveWriteTextLineStyleCode(possibleCode, {
					strokeStyle: lineContext.strokeStyle,
					lineWidth: textOutlineWidth,
					lineCap: lineContext.lineCap,
					lineJoin: lineContext.lineJoin
				});
				var resolvedTextColor = resolveWriteTextColorCode(possibleCode, textColor, card.frames);
				var resolvedTextSize = resolveWriteTextSizeCode(possibleCode, textSize);
				var fontCodeState = resolveWriteTextFontCode(word, possibleCode, savedFont);
				var manaColorState = resolveWriteTextManaColorCode(possibleCode);
				var letterSpacing = resolveWriteTextKerningCode(possibleCode);
				var resolvedPtShift = resolveWriteTextPtShiftCode(possibleCode, card);
				var transformState = resolveWriteTextTransformCode(possibleCode, {
					permaShift,
					textArcRadius,
					textArcStart,
					textRotation
				});
				var rollColor = resolveWriteTextRollColorCode(possibleCode);
				var rollState = resolveWriteTextRollCode(possibleCode, currentY, savedRollYPosition, textFont);
				var flowState = resolveWriteTextFlowCode(possibleCode, textSize);
				var barState = resolveWriteTextBarCode(possibleCode, textWidth, textSize, textAlign, card.version);
				var savedXState = resolveWriteTextSavedXCode(possibleCode, currentX, savedTextXPosition, savedTextXPosition2);
				var indentState = resolveWriteTextIndentCode(possibleCode, startingCurrentX, currentX, currentY);
				var planechaseState = resolveWriteTextPlanechaseCode(possibleCode, textSize, currentX, startingCurrentX);
				wordToWrite = null;
				if (flowState) {
					if (flowState.newLine !== null) {
						newLine = flowState.newLine;
					}
					if (flowState.startingCurrentX !== null) {
						startingCurrentX = flowState.startingCurrentX;
					}
					if (flowState.newLineSpacing !== null) {
						newLineSpacing = flowState.newLineSpacing;
					}
					if (flowState.linespacing !== null) {
						linespacing = flowState.linespacing;
					}
					if (flowState.wordToWrite !== null) {
						wordToWrite = flowState.wordToWrite;
					}
				} else if (barState) {
					realTextAlign = barState.realTextAlign;
					textAlign = barState.textAlign;
					if (barState.newLineSpacing !== null) {
						newLineSpacing = barState.newLineSpacing;
					}
					textSize = barState.textSize;
					lineContext.drawImage(getManaSymbol(barState.barImageName).image, canvasMargin + (textWidth - barState.barWidth) / 2, canvasMargin + barState.barDistance * textSize, barState.barWidth, barState.barHeight);
				} else if (possibleCode == 'i') {
					var italicFontState = startWriteTextItalicFontState(textFont, textFontStyle);
					textFontStyle = italicFontState.fontStyle;
					textFontExtension = italicFontState.fontExtension;
					applyWriteTextFontState(lineContext, textFontStyle, textSize, textFont, textFontExtension);
				} else if (possibleCode == '/i') {
					var italicEndFontState = endWriteTextItalicFontState(textFontStyle);
					textFontStyle = italicEndFontState.fontStyle;
					textFontExtension = italicEndFontState.fontExtension;
					applyWriteTextFontState(lineContext, textFontStyle, textSize, textFont, textFontExtension);
				} else if (possibleCode == 'bold') {
					var boldFontState = startWriteTextBoldFontState(textFont, textFontStyle, textFontExtension);
					textFontStyle = boldFontState.fontStyle;
					textFontExtension = boldFontState.fontExtension;
					applyWriteTextFontState(lineContext, textFontStyle, textSize, textFont, textFontExtension);
				} else if (possibleCode == '/bold') {
					var boldEndFontState = endWriteTextBoldFontState(textFont, textFontStyle, textFontExtension);
					textFontStyle = boldEndFontState.fontStyle;
					textFontExtension = boldEndFontState.fontExtension;
					applyWriteTextFontState(lineContext, textFontStyle, textSize, textFont, textFontExtension);
				} else if (alignmentState) {
					textAlign = alignmentState.textAlign;
					textJustify = alignmentState.textJustify;
				} else if (resolvedTextColor !== null) {
					textColor = resolvedTextColor;
					applyWriteTextFillColor(lineContext, textColor);
				} else if (resolvedTextSize !== null) {
					textSize = resolvedTextSize;
					applyWriteTextFontState(lineContext, textFontStyle, textSize, textFont, textFontExtension);
				} else if (fontCodeState) {
					textFont = fontCodeState.textFont;
					wordToWrite = fontCodeState.wordToWrite;
					FontLoadTracker.track(textFont);
					textFontExtension = fontCodeState.textFontExtension;
					textFontStyle = fontCodeState.textFontStyle;
					applyWriteTextFontState(lineContext, textFontStyle, textSize, textFont, textFontExtension);
					savedFont = fontCodeState.savedFont;
				} else if (lineStyleState) {
					textOutlineWidth = lineStyleState.lineWidth;
					applyWriteTextLineStyleState(lineContext, lineStyleState);
				} else if (positionState) {
					lineY = positionState.lineY;
					currentY = positionState.currentY;
					currentX = positionState.currentX;
				} else if (shadowState) {
					textShadowColor = shadowState.color;
					textShadowOffsetX = shadowState.offsetX;
					textShadowOffsetY = shadowState.offsetY;
					textShadowBlur = shadowState.blur;
					applyWriteTextShadowState(lineContext, shadowState);
				} else if (planechaseState) {
					lineContext.drawImage(getManaSymbol('chaos').image, planechaseState.imageX + canvasMargin, canvasMargin, planechaseState.imageWidth, planechaseState.imageHeight);
					currentX = planechaseState.currentX;
					startingCurrentX = planechaseState.startingCurrentX;
				} else if (indentState) {
					startingCurrentX = indentState.startingCurrentX;
					currentY = indentState.currentY;
				} else if (possibleCode.includes('elemid')) {
					var elemIdSelector = getWriteTextElemIdSelector(word);
					if (document.querySelector(elemIdSelector)) {
						wordToWrite = document.querySelector(elemIdSelector).value || '';
					}
					if (word.includes('set')) {
						var bottomTextSubstring = getWriteTextElemIdSetSubstring(
							card.bottomInfo.midLeft.text,
							document.querySelector('#info-set').value || '',
							document.querySelector('#info-language').value || ''
						);
						justifyWidth = lineContext.measureText(bottomTextSubstring).width;
					} else {
						var elemIdNumberState = resolveWriteTextElemIdNumberCode(word, wordToWrite, card.version);
						if (elemIdNumberState) {
							fillJustify = elemIdNumberState.fillJustify;
							wordToWrite = elemIdNumberState.wordToWrite;
						}
					}
				} else if (savedXState) {
					currentX = savedXState.currentX;
					savedTextXPosition = savedXState.savedTextXPosition;
					savedTextXPosition2 = savedXState.savedTextXPosition2;
				} else if (possibleCode.includes('ptshift')) {
					if (resolvedPtShift) {
						ptShift = resolvedPtShift;
					}
				} else if (rollColor !== null) {
					savedRollColor = rollColor;
				} else if (rollState) {
					drawTextBetweenFrames = rollState.drawTextBetweenFrames;
					redrawFrames = rollState.redrawFrames;
					drawToPrePTCanvas = rollState.drawToPrePTCanvas;
					savedRollYPosition = rollState.savedRollYPosition;
					savedFont = rollState.savedFont;
					applyWriteTextFontState(lineContext, textFontStyle, textSize, 'belerenb', textFontExtension);
					wordToWrite = rollState.wordToWrite;
				} else if (transformState) {
					permaShift = transformState.permaShift;
					textArcRadius = transformState.textArcRadius;
					textArcStart = transformState.textArcStart;
					textRotation = transformState.textRotation;
				} else if (manaColorState) {
					manaSymbolColor = manaColorState.manaSymbolColor;
				} else if (letterSpacing !== null) {
					applyWriteTextKerningCode(lineContext, letterSpacing);
				} else if (getManaSymbol(possibleCode.replaceAll('/', '')) != undefined || getManaSymbol(possibleCode.replaceAll('/', '').split('').reverse().join('')) != undefined) {
					var possibleCode = possibleCode.replaceAll('/', '');
					var manaSymbol;
					// Add symbol to render queue without drawing immediately
					if (textObject.manaPrefix && 
						(getManaSymbol(textObject.manaPrefix + possibleCode) != undefined || getManaSymbol(textObject.manaPrefix + possibleCode.split('').reverse().join('')) != undefined)) {
						manaSymbol = getManaSymbol(textObject.manaPrefix + possibleCode) || getManaSymbol(textObject.manaPrefix + possibleCode.split('').reverse().join(''));
					} else {
						if (possibleCode == 'brush' && textColor == 'white') {
							possibleCode = 'whitebrush';
						}
						manaSymbol = getManaSymbol(possibleCode) || getManaSymbol(possibleCode.split('').reverse().join(''));
					} 

					var origManaSymbolColor = manaSymbolColor;
					if (manaSymbol.matchColor && !manaSymbolColor && textColor !== 'black') {
						manaSymbolColor = textColor;
					}

					var manaSymbolSpacing = textSize * 0.04 + textManaSpacing;
					var manaSymbolWidth = manaSymbol.width * textSize * 0.78;
					var manaSymbolHeight = manaSymbol.height * textSize * 0.78;
					var manaSymbolX = currentX + canvasMargin + manaSymbolSpacing;
					var manaSymbolY = canvasMargin + textSize * 0.34 - manaSymbolHeight / 2;
					if (textObject.manaPlacement) {
						manaSymbolX = scaleWidth(textObject.manaPlacement.x[manaPlacementCounter] || 0) + canvasMargin;
						manaSymbolY = canvasMargin;
						currentY = scaleHeight(textObject.manaPlacement.y[manaPlacementCounter] || 0);
						manaPlacementCounter ++;
						newLine = true;
					} else if (textObject.manaLayout) {
						var layoutOption = 0;
						var manaSymbolCount = splitText.length - 1;
						while (textObject.manaLayout[layoutOption].max < manaSymbolCount && layoutOption < textObject.manaLayout.length - 1) {
							layoutOption ++;
						}
						var manaLayout = textObject.manaLayout[layoutOption];
						if (manaLayout.pos[manaPlacementCounter] == undefined) {
							manaLayout.pos[manaPlacementCounter] = [0, 0];
						}
						manaSymbolX = scaleWidth(manaLayout.pos[manaPlacementCounter][0] || 0) + canvasMargin;
						manaSymbolY = canvasMargin;
						currentY = scaleHeight(manaLayout.pos[manaPlacementCounter][1] || 0);
						manaPlacementCounter ++;
						manaSymbolWidth *= manaLayout.size;
						manaSymbolHeight *= manaLayout.size;
						newLine = true;
					}
					if (textObject.manaImageScale) {
						currentX -= (textObject.manaImageScale - 1) * manaSymbolWidth;
						manaSymbolX -= (textObject.manaImageScale - 1) / 2 * manaSymbolWidth;
						manaSymbolY -= (textObject.manaImageScale - 1) / 2 * manaSymbolHeight;
						manaSymbolWidth *= textObject.manaImageScale;
						manaSymbolHeight *= textObject.manaImageScale;
					}
					var backImage = null;
					if (manaSymbol.backs) {
						backImage = getManaSymbol('back' + Math.floor(Math.random() * manaSymbol.backs) + manaSymbol.back).image;
					}
					// Add to render queue
					manaSymbolsToRender.push({
						symbol: manaSymbol,
						x: manaSymbolX,
						y: manaSymbolY, 
						width: manaSymbolWidth,
						height: manaSymbolHeight,
						hasOutline: textOutlineWidth > 0,
						color: manaSymbolColor,
						radius: textArcRadius,
						arcStart: textArcStart,
						currentX: currentX,
						backImage: backImage,
						outlineWidth: textOutlineWidth,
						shadowColor: textShadowColor,
						shadowOffsetX: textShadowOffsetX,
						shadowOffsetY: textShadowOffsetY,
						shadowBlur: textShadowBlur
					});
					currentX += manaSymbolWidth + manaSymbolSpacing * 2;

					manaSymbolColor = origManaSymbolColor;
				} else {
					wordToWrite = word;
				}
			}

			function renderManaSymbols() {
				manaSymbolsToRender = renderManaSymbolQueue(lineContext, lineCanvas, manaSymbolsToRender, navigator.userAgent);
			}
			wordToWrite = applyWriteTextBelerenGlyphs(wordToWrite, lineContext.font);

			//if the word goes past the max line width, go to the next line
			var overflowState = resolveWriteTextOverflow(
				wordToWrite,
				wordToWrite ? lineContext.measureText(wordToWrite).width : 0,
				currentX,
				textWidth,
				textArcRadius,
				textOneLine,
				startingTextSize
			);
			if (overflowState) {
				//console.log("newLine:" + wordToWrite)
				if (overflowState.retryOuterLoop) {
					//doesn't fit... try again at a smaller text size?
					startingTextSize = overflowState.startingTextSize;
					continue outerloop;
				}
				newLine = overflowState.newLine;
			}
			//if we need a new line, go to the next line
			if ((newLine && !textOneLine) || splitText.indexOf(word) == splitText.length - 1) {
				//console.log("newLine:" + wordToWrite)
				if(Chinese && (wordToWrite == "。" || wordToWrite == "」" || wordToWrite == "）"|| wordToWrite == "：" || wordToWrite == "，" || wordToWrite == '；')) {
						startingTextSize -= 1;
						continue outerloop;
				}
				var horizontalAdjust = resolveWriteTextLineHorizontalAdjust(textAlign, textWidth, currentX);
				if (currentX > widestLineWidth) {
					widestLineWidth = currentX;
				}
				if (manaSymbolsToRender.length > 0) {
					renderManaSymbols();
				}
				paragraphContext.drawImage(lineCanvas, horizontalAdjust, currentY);
				lineY = 0;
				lineContext.clearRect(0, 0, lineCanvas.width, lineCanvas.height);
				// boxes for 'roll a d20' cards
				if (savedRollYPosition != null && (newLineSpacing != 0 || !(newLine && !textOneLine))) {
					if (savedRollYPosition != -1) {
						paragraphContext.globalCompositeOperation = 'destination-over';
						paragraphContext.globalAlpha = 0.25;
						paragraphContext.fillStyle = savedRollColor;
						paragraphContext.fillRect(canvasMargin - textSize * 0.1, savedRollYPosition + canvasMargin - textSize * 0.28, paragraphCanvas.width - 2 * canvasMargin + textSize * 0.2, currentY - savedRollYPosition + textSize * 1.3);
						paragraphContext.globalCompositeOperation = 'source-over';
						paragraphContext.globalAlpha = 1;
						savedRollYPosition = -1;
					} else {
						savedRollYPosition = null;
					}
				}
				//reset
				currentX = startingCurrentX;
				currentY += textSize + newLineSpacing;
				// console.log(newLineSpacing);
				if(textObject.lineSpacing != null) {
					newLineSpacing = textObject.lineSpacing * textSize;
				} else {
					newLineSpacing = linespacing;
				}
				// console.log(newLineSpacing);
				newLine = false;
			}
			var insertionState = resolveWriteTextInsertionCode(wordToWrite, currentX, textSize);
			if (insertionState) {
				currentX = insertionState.currentX;
				continue innerloop;
			}
			if (shouldApplyWriteTextChineseSpacing(Chinese, textObject.text)) {
				var chineseSpacingState = resolveWriteTextChineseSpacing(wordToWrite, Last, currentX, startingCurrentX, textSize, newLine);
				currentX = chineseSpacingState.currentX;
				Last = chineseSpacingState.lastWord;
			}
			//if there's a word to write, it's not a space on a new line, and it's allowed to write words, then we write the word
			if (shouldWriteTextWord(wordToWrite, currentX, startingCurrentX, textManaCost)) {
				var justifySettings = getWriteTextJustifySettings();
				if (textArcRadius > 0) {
					lineContext.fillTextArc(wordToWrite, currentX + canvasMargin, canvasMargin + textSize * textFontHeightRatio + lineY, textArcRadius, textArcStart, currentX, textOutlineWidth);
				} else {
					if (textOutlineWidth >= 1) {
						if (fillJustify) {
							lineContext.strokeJustifyText(wordToWrite, currentX + canvasMargin, canvasMargin + textSize * textFontHeightRatio + lineY, justifyWidth, justifySettings);
						} else {
							lineContext.strokeText(wordToWrite, currentX + canvasMargin, canvasMargin + textSize * textFontHeightRatio + lineY);
						}
					}
					if (fillJustify) {
						lineContext.fillJustifyText(wordToWrite, currentX + canvasMargin, canvasMargin + textSize * textFontHeightRatio + lineY, justifyWidth, justifySettings);
					} else {
						lineContext.fillText(wordToWrite, currentX + canvasMargin, canvasMargin + textSize * textFontHeightRatio + lineY);
					}
				}

				currentX += measureWriteTextWordAdvance(lineContext, wordToWrite, fillJustify, justifyWidth, justifySettings);
			}
			var heightOverflowState = resolveWriteTextHeightOverflow(currentY, textHeight, textBounded, textOneLine, startingTextSize, textArcRadius);
			if (heightOverflowState) {
				//doesn't fit... try again at a smaller text size?
				startingTextSize = heightOverflowState.startingTextSize;
				continue outerloop;
			}
			if (splitText.indexOf(word) == splitText.length - 1) {
				//should manage vertical centering here
				var verticalAdjust = resolveWriteTextVerticalAdjust(textObject.noVerticalCenter, textHeight, currentY, textSize);
				var finalHorizontalAdjust = resolveWriteTextFinalHorizontalAdjust(textJustify, textAlign, textWidth, widestLineWidth);
				var trueTargetContext = resolveWriteTextFinalTargetContext(targetContext, drawToPrePTCanvas, prePTContext);
				drawWriteTextFinalParagraph(trueTargetContext, paragraphCanvas, {
					textRotation,
					textX,
					textY,
					ptShift,
					permaShift,
					canvasMargin,
					finalHorizontalAdjust,
					verticalAdjust
				});
				drawingText = false;
			}
		}
	}
}

CanvasRenderingContext2D.prototype.fillTextArc = function(text, x, y, radius, startRotation, distance = 0, outlineWidth = 0) {
	this.save();
	this.translate(x - distance + scaleWidth(0.5), y + radius);
	this.rotate(startRotation + widthToAngle(distance, radius));
	for (var i = 0; i < text.length; i++) {
		var letter = text[i];
		if (outlineWidth >= 1) {
			this.strokeText(letter, 0, -radius);
		}
		this.fillText(letter, 0, -radius);
		this.rotate(widthToAngle(this.measureText(letter).width, radius));
	}
	this.restore();
}
CanvasRenderingContext2D.prototype.drawImageArc = function(image, x, y, width, height, radius, startRotation, distance = 0) {
	this.save();
	this.translate(x - distance + scaleWidth(0.5), y + radius);
	this.rotate(startRotation + widthToAngle(distance, radius));
	this.drawImage(image, 0, -radius, width, height);
	this.restore();
}
CanvasRenderingContext2D.prototype.fillImage = function(image, x, y, width, height, color = 'white', margin = 10) {
	var canvas = document.createElement('canvas');
	canvas.width = width + margin * 2;
	canvas.height = height + margin * 2;
	var context = canvas.getContext('2d');
	context.drawImage(image, margin, margin, width, height);
	context.globalCompositeOperation = 'source-in';
	context.fillStyle = pinlineColors(color);
	context.fillRect(0, 0, width + margin * 2, height + margin * 2);
	this.drawImage(canvas, x - margin, y - margin, width + margin * 2, height + margin * 2);
}

const FILL = 0; //const to indicate filltext render
const STROKE = 1;
const MEASURE = 2;
var maxSpaceSize = 3; // Multiplier for max space size. If greater then no justification applied
var minSpaceSize = 0.5; // Multiplier for minimum space size
function renderTextJustified(ctx, text, x, y, width, renderType) {
	var splitChar = " ";

	var words, wordsWidth, count, spaces, spaceWidth, adjSpace, renderer, i, textAlign, useSize, totalWidth;
	textAlign = ctx.textAlign;
	ctx.textAlign = "left";
	wordsWidth = 0;
	words = text.split(splitChar).map(word => {
		var w = ctx.measureText(word).width;
		wordsWidth += w;
		return {
			width: w,
			word: word
		};
	});
	// count = num words, spaces = number spaces, spaceWidth normal space size
	// adjSpace new space size >= min size. useSize Reslting space size used to render
	count = words.length;
	spaces = count - 1;
	spaceWidth = ctx.measureText(splitChar).width;
	adjSpace = Math.max(spaceWidth * minSpaceSize, (width - wordsWidth) / spaces);
	useSize = adjSpace > spaceWidth * maxSpaceSize ? spaceWidth : adjSpace;
	totalWidth = wordsWidth + useSize * spaces;
	if (renderType === MEASURE) { // if measuring return size
		ctx.textAlign = textAlign;
		return totalWidth;
	}
	renderer = renderType === FILL ? ctx.fillText.bind(ctx) : ctx.strokeText.bind(ctx); // fill or stroke
	switch(textAlign) {
	case "right":
		x -= totalWidth;
		break;
	case "end":
		x += width - totalWidth;
		break;
	case "center": // intentional fall through to default
		x -= totalWidth / 2;
	default:
	}
	if (useSize === spaceWidth) { // if space size unchanged
		renderer(text, x, y);
	} else {
		for(i = 0; i < count; i += 1) {
			renderer(words[i].word,x,y);
			x += words[i].width;
			x += useSize;
		}
	}
	ctx.textAlign = textAlign;
}

// Parse vet and set settings object.
function justifiedTextSettings(settings) {
	var min,max;
	var vetNumber = (num, defaultNum) => {
		num = num !== null && num !== null && !isNaN(num) ? num : defaultNum;
		if(num < 0){
			num = defaultNum;
		}
		return num;
	}
	if(settings === undefined || settings === null){
		return;
	}
	max = vetNumber(settings.maxSpaceSize, maxSpaceSize);
	min = vetNumber(settings.minSpaceSize, minSpaceSize);
	if(min > max){
		return;
	}
	minSpaceSize = min;
	maxSpaceSize = max;
}
CanvasRenderingContext2D.prototype.fillJustifyText = function(text, x, y, width, settings) {
	justifiedTextSettings(settings);
	renderTextJustified(this, text, x, y, width, FILL);
}
CanvasRenderingContext2D.prototype.strokeJustifyText = function(text, x, y, width, settings){
	justifiedTextSettings(settings);
	renderTextJustified(this, text, x, y, width, STROKE);
}
CanvasRenderingContext2D.prototype.measureJustifiedText = function(text, width, settings) {
	justifiedTextSettings(settings);
	renderTextJustified(this, text, 0, 0, width, MEASURE);
}

function widthToAngle(width, radius) {
	return width / radius;
}
function curlyQuotes(input) {
	return input.replace(/ '/g, ' ‘').replace(/^'/, '‘').replace(/'/g, '’').replace(/ "/g, ' “').replace(/" /g, '” ').replace(/\."/, '.”').replace(/"$/, '”').replace(/"\)/g, '”)').replace(/"/g, '“');
}
function pinlineColors(color) {
	return color.replace('white', '#fcfeff').replace('blue', '#0075be').replace('black', '#272624').replace('red', '#ef3827').replace('green', '#007b43')
}
async function addTextbox(textboxType) {
	if (textboxType == 'Nickname' && !card.text.nickname && card.text.title) {
		await loadTextOptions({nickname: {name:'Nickname', text:card.text.title.text, x:0.14, y:0.1129, width:0.72, height:0.0243, oneLine:true, font:'mplantini', size:0.0229, color:'white', shadowX:0.0014, shadowY:0.001, align:'center'}}, false);
		var nickname = card.text.title;
		nickname.name = 'Nickname';
		card.text.title = card.text.nickname;
		card.text.title.name = 'Title';
		card.text.nickname = nickname;
	} else if (textboxType == 'Power/Toughness' && !card.text.pt) {
		loadTextOptions({pt: {name:'Power/Toughness', text:'', x:0.7928, y:0.902, width:0.1367, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center'}}, false);
	} else if (textboxType == 'DateStamp' && !card.text.dateStamp) {
		loadTextOptions({dateStamp: {name:'Date Stamp', text:'', x:0.11, y:0.5072, width:0.78, height:0.0286, size:0.0286, font:'belerenb', oneLine:true, align:'right', color:'#ffd35b', shadowX:-0.0007, shadowY:-0.001}}, false);
	}
}
//ART TAB
function uploadArt(imageSource, otherParams) {
	ImageLoadTracker.track(imageSource);
	art.src = imageSource;
	if (otherParams && otherParams == 'autoFit') {
		art.onload = function() {
			autoFitArt();
			art.onload = artEdited;
		};
	}
}
async function pasteArt() {
  try {
    const clipboardItems = await navigator.clipboard.read();
    
    for (const item of clipboardItems) {
      for (const type of item.types) {
        if (type.startsWith('image/')) {
          const blob = await item.getType(type);
          
          const url = URL.createObjectURL(blob);

          uploadArt(url, document.querySelector("#art-update-autofit").checked ? "autoFit" : "");
          // document.getElementById('preview').src = url;
          return;
        }
      }
    }

    notify('No image found in clipboard!');
  } catch (err) {
    console.error('Failed to read clipboard: ', err);
    notify('Clipboard access not allowed or no image available.');
  }
}
function artEdited() {
	card.artSource = art.src;
	card.artX = document.querySelector('#art-x').value / card.width;
	card.artY = document.querySelector('#art-y').value / card.height;
	card.artZoom = document.querySelector('#art-zoom').value / 100;
	card.artRotate = document.querySelector('#art-rotate').value;
	drawCard();
}
function autoFitArt() {
	document.querySelector('#art-rotate').value = 0;
	if (art.width / art.height > scaleWidth(card.artBounds.width) / scaleHeight(card.artBounds.height)) {
		document.querySelector('#art-y').value = Math.round(scaleY(card.artBounds.y) - scaleHeight(card.marginY));
		document.querySelector('#art-zoom').value = (scaleHeight(card.artBounds.height) / art.height * 100).toFixed(1);
		document.querySelector('#art-x').value = Math.round(scaleX(card.artBounds.x) - (document.querySelector('#art-zoom').value / 100 * art.width - scaleWidth(card.artBounds.width)) / 2 - scaleWidth(card.marginX));
	} else {
		document.querySelector('#art-x').value = Math.round(scaleX(card.artBounds.x) - scaleWidth(card.marginX));
		document.querySelector('#art-zoom').value = (scaleWidth(card.artBounds.width) / art.width * 100).toFixed(1);
		document.querySelector('#art-y').value = Math.round(scaleY(card.artBounds.y) - (document.querySelector('#art-zoom').value / 100 * art.height - scaleHeight(card.artBounds.height)) / 2 - scaleHeight(card.marginY));
	}
	artEdited();
}

function centerArtX() {
	document.querySelector('#art-rotate').value = 0;
	if (art.width / art.height > scaleWidth(card.artBounds.width) / scaleHeight(card.artBounds.height)) {
		document.querySelector('#art-x').value = Math.round(scaleX(card.artBounds.x) - (document.querySelector('#art-zoom').value / 100 * art.width - scaleWidth(card.artBounds.width)) / 2 - scaleWidth(card.marginX));
	} else {
		document.querySelector('#art-x').value = Math.round(scaleX(card.artBounds.x) - scaleWidth(card.marginX));
	}
	artEdited();
}

function centerArtY() {
	document.querySelector('#art-rotate').value = 0;
	document.querySelector('#art-y').value = Math.round(scaleY(card.artBounds.y) - (document.querySelector('#art-zoom').value / 100 * art.height - scaleHeight(card.artBounds.height)) / 2 - scaleHeight(card.marginY));
	artEdited();
}

function artFromScryfall(scryfallResponse) {
	scryfallArt = []
	const artIndex = document.querySelector('#art-index');
	artIndex.innerHTML = null;
	var optionIndex = 0;
	scryfallResponse.forEach(card => {
		if (card.image_uris && (card.object == 'card' || card.type_line != 'Card') && card.artist) {
			scryfallArt.push(card);
			// console.log("card", card);
			var option = document.createElement('option');
			option.innerHTML = `${card.name} (${card.set.toUpperCase()} - ${card.artist})`;
			option.value = optionIndex;
			artIndex.appendChild(option);
			optionIndex ++;
		}
	});

	if (document.querySelector('#importAllPrints').checked) {
		// If importing unique prints, the art should change to match the unique print selected.

		// First we find the illustration ID of the imported print
		var illustrationID = scryfallCard[document.querySelector('#import-index').value].illustration_id;

		// Find all unique arts for that card
		var artIllustrations = scryfallArt.map(card => card.illustration_id);

		("allillu" + artIllustrations);


		// Find the art that matches the selected print
		var index = artIllustrations.indexOf(illustrationID);
		if (index < 0) {
			// Couldn't find art
			index = 0;
		}

		// Use that art
		artIndex.value = index;
	}

	changeArtIndex();
}
function changeArtIndex() {
	const artIndexValue = document.querySelector('#art-index').value;
	if (artIndexValue != 0 || artIndexValue == '0') {
		const scryfallCardForArt = scryfallArt[artIndexValue];
		uploadArt(scryfallCardForArt.image_uris.art_crop, 'autoFit');
		if(localStorage.getItem('enableImportCollectorInfo') == 'true' || localStorage.getItem('enableImportArtist') == 'true') {
			artistEdited(scryfallCardForArt.artist);
		}
		if (params.get('mtgpics') != null) {
			imageURL(`https://www.mtgpics.com/pics/art/${scryfallCardForArt.set.toLowerCase()}/${("00" + scryfallCardForArt.collector_number).slice(-3)}.jpg`, tryMTGPicsArt);
		}
	}
}
function tryMTGPicsArt(src) {
	createImageWithLoadHandler(src, function() {
		if (this.complete) {
			art.onload = function() {
				autoFitArt();
				art.onload = artEdited;
			};
			art.src = this.src;
		}
	});
}
function initDraggableArt() {
	previewCanvas.onmousedown = artStartDrag;
	previewCanvas.onmousemove = artDrag;
	previewCanvas.onmouseout = artStopDrag;
	previewCanvas.onmouseup = artStopDrag;
	draggingArt = false;
	lastArtDragTime = 0;
}
function artStartDrag(e) {
	e.preventDefault();
	e.stopPropagation();
	startX = parseInt(e.clientX);
	startY = parseInt(e.clientY);
	draggingArt = true;
}
function artDrag(e) {
	var target = document.querySelector('#drag-target-setSymbol').checked ? "setSymbol" : "art";
	var canRotate = target == "art";
	var edited = target == "art" ? artEdited : setSymbolEdited;

	e.preventDefault();
	e.stopPropagation();
	if (draggingArt && Date.now() > lastArtDragTime + 25) {
		lastArtDragTime = Date.now();
		if (e.shiftKey || e.ctrlKey) {
			startX = parseInt(e.clientX);
			const endY = parseInt(e.clientY);
			if (e.ctrlKey && canRotate) {
				document.querySelector(`#${target}-rotate`).value = Math.round((parseFloat(document.querySelector(`#${target}-rotate`).value) - (startY - endY) / 10) % 360 * 10) / 10;
			} else {
				document.querySelector(`#${target}-zoom`).value = Math.round((parseFloat(document.querySelector(`#${target}-zoom`).value) * (1.002 ** (startY - endY))) * 10) / 10;
			}
			startY = endY;
			edited();
		} else {
			const endX = parseInt(e.clientX);
			const endY = parseInt(e.clientY);
			var changeX = (endX - startX) * 2;
			var changeY = (endY - startY) * 2;
			if (card.landscape) {
				const temp = changeX;
				changeX = -changeY;
				changeY = temp;
			}
			document.querySelector(`#${target}-x`).value = parseInt(document.querySelector(`#${target}-x`).value) + changeX;
			document.querySelector(`#${target}-y`).value = parseInt(document.querySelector(`#${target}-y`).value) + changeY;
			startX = endX;
			startY = endY;
			edited();
		}

	}
}
function artStopDrag(e) {
	e.preventDefault();
	e.stopPropagation();
	if (draggingArt) {
		draggingArt = false;
	}
}
//SET SYMBOL TAB
function uploadSetSymbol(imageSource, otherParams) {
	ImageLoadTracker.track(imageSource);
	setSymbol.src = imageSource;
	if (otherParams && otherParams == 'resetSetSymbol') {
		setSymbol.onload = function() {
			resetSetSymbol();
			setSymbol.onload = setSymbolEdited;
		};
	}
}
function setSymbolEdited() {
	card.setSymbolSource = setSymbol.src;
	if (document.querySelector('#lockSetSymbolURL').checked) {
		localStorage.setItem('lockSetSymbolURL', card.setSymbolSource);
	}
	localStorage.setItem('set-symbol-source', document.querySelector('#set-symbol-source').value);
	card.setSymbolX = document.querySelector('#setSymbol-x').value / card.width;
	card.setSymbolY = document.querySelector('#setSymbol-y').value / card.height;
	card.setSymbolZoom = document.querySelector('#setSymbol-zoom').value / 100;
	drawCard();
}
function resetSetSymbol() {
	if (card.setSymbolBounds == undefined) {
		return;
	}
	document.querySelector('#setSymbol-x').value = Math.round(scaleX(card.setSymbolBounds.x));
	document.querySelector('#setSymbol-y').value = Math.round(scaleY(card.setSymbolBounds.y));
	var setSymbolZoom;
	if (setSymbol.width / setSymbol.height > scaleWidth(card.setSymbolBounds.width) / scaleHeight(card.setSymbolBounds.height)) {
		setSymbolZoom = (scaleWidth(card.setSymbolBounds.width) / setSymbol.width * 100).toFixed(1);
	} else {
		setSymbolZoom = (scaleHeight(card.setSymbolBounds.height) / setSymbol.height * 100).toFixed(1);
	}
	document.querySelector('#setSymbol-zoom').value = setSymbolZoom;
	if (card.setSymbolBounds.horizontal == 'center') {
		document.querySelector('#setSymbol-x').value = Math.round(scaleX(card.setSymbolBounds.x) - (setSymbol.width * setSymbolZoom / 100) / 2 - scaleWidth(card.marginX));
	} else if (card.setSymbolBounds.horizontal == 'right') {
		document.querySelector('#setSymbol-x').value = Math.round(scaleX(card.setSymbolBounds.x) - (setSymbol.width * setSymbolZoom / 100) - scaleWidth(card.marginX));
	}
	if (card.setSymbolBounds.vertical == 'center') {
		document.querySelector('#setSymbol-y').value = Math.round(scaleY(card.setSymbolBounds.y) - (setSymbol.height * setSymbolZoom / 100) / 2 - scaleHeight(card.marginY));
	} else if (card.setSymbolBounds.vertical == 'bottom') {
		document.querySelector('#setSymbol-y').value = Math.round(scaleY(card.setSymbolBounds.y) - (setSymbol.height * setSymbolZoom / 100) - scaleHeight(card.marginY));
	}
	setSymbolEdited();
}
function fetchSetSymbol() {
	var setCode = document.querySelector('#set-symbol-code').value.toLowerCase() || 'cmd';
	if (document.querySelector('#lockSetSymbolCode').checked) {
		localStorage.setItem('lockSetSymbolCode', setCode);
	}
	var setRarity = document.querySelector('#set-symbol-rarity').value.toLowerCase().replace('uncommon', 'u').replace('common', 'c').replace('rare', 'r').replace('mythic', 'm') || 'c';
	if (['a22', 'a23', 'hlw'].includes(setCode.toLowerCase())) {
		uploadSetSymbol(fixUri(`/img/setSymbols/custom/${setCode.toLowerCase()}-${setRarity}.png`), 'resetSetSymbol');
	} else if (['cc', 'logan', 'joe'].includes(setCode.toLowerCase())) {
		uploadSetSymbol(fixUri(`/img/setSymbols/custom/${setCode.toLowerCase()}-${setRarity}.svg`), 'resetSetSymbol');
	} else if (document.querySelector("#set-symbol-source").value == 'gatherer') {
		if (setSymbolAliases.has(setCode.toLowerCase())) setCode = setSymbolAliases.get(setCode.toLowerCase());
		uploadSetSymbol('http://gatherer.wizards.com/Handlers/Image.ashx?type=symbol&set=' + setCode + '&size=large&rarity=' + setRarity, 'resetSetSymbol');
    } else if (document.querySelector("#set-symbol-source").value == 'hexproof') {
        if (setSymbolAliases.has(setCode.toLowerCase())) setCode = setSymbolAliases.get(setCode.toLowerCase());
        var hexproofUrl = 'https://api.hexproof.io/symbols/set/' + setCode + '/' + setRarity;
        // Use CORS proxy for hexproof.io
        if (params.get('noproxy') == null) {
            hexproofUrl = 'https://corsproxy.io/?url=' + encodeURIComponent(hexproofUrl);
        }
        uploadSetSymbol(hexproofUrl, 'resetSetSymbol');
	} else {
		var extension = 'svg';
		if (['xxxx'].includes(setCode.toLowerCase())) {
			extension = 'png';
		}
		if (setSymbolAliases.has(setCode.toLowerCase())) setCode = setSymbolAliases.get(setCode.toLowerCase());
		uploadSetSymbol(fixUri(`/img/setSymbols/official/${setCode.toLowerCase()}-${setRarity}.` + extension), 'resetSetSymbol');
	}
}
function lockSetSymbolCode() {
	var savedValue = '';
	if (document.querySelector('#lockSetSymbolCode').checked) {
		savedValue = document.querySelector('#set-symbol-code').value;
	}
	localStorage.setItem('lockSetSymbolCode', savedValue);
}
function lockSetSymbolURL() {
	var savedValue = '';
	if (document.querySelector('#lockSetSymbolURL').checked) {
		savedValue = card.setSymbolSource;
	}
	localStorage.setItem('lockSetSymbolURL', savedValue);
}
//WATERMARK TAB
function uploadWatermark(imageSource, otherParams) {
	ImageLoadTracker.track(imageSource);
	watermark.src = imageSource;
	if (otherParams && otherParams == 'resetWatermark') {
		watermark.onload = function() {
			resetWatermark();
			watermark.onload = watermarkEdited;
		};
	}
}
function watermarkLeftColor(c) {
	card.watermarkLeft = c;
	watermarkEdited();
}
function watermarkRightColor(c) {
	card.watermarkRight = c;
	watermarkEdited();
}
function watermarkEdited() {
	card.watermarkSource = watermark.src;
	card.watermarkX = document.querySelector('#watermark-x').value / card.width;
	card.watermarkY = document.querySelector('#watermark-y').value / card.height;
	card.watermarkZoom = document.querySelector('#watermark-zoom').value / 100;
	if (card.watermarkLeft == "none" && document.querySelector('#watermark-left').value != "none") {
		card.watermarkLeft = document.querySelector('#watermark-left').value;
	}
	// card.watermarkLeft = document.querySelector('#watermark-left').value;
	// card.watermarkRight =  document.querySelector('#watermark-right').value;
	card.watermarkOpacity = document.querySelector('#watermark-opacity').value / 100;
	watermarkContext.globalCompositeOperation = 'source-over';
	watermarkContext.globalAlpha = 1;
	watermarkContext.clearRect(0, 0, watermarkCanvas.width, watermarkCanvas.height);
	if (card.watermarkLeft != 'none' && !card.watermarkSource.includes('/blank.png') && card.watermarkZoom > 0) {
		if (card.watermarkRight != 'none') {
			watermarkContext.drawImage(right, scaleX(0), scaleY(0), scaleWidth(1), scaleHeight(1));
			watermarkContext.globalCompositeOperation = 'source-in';
			if (card.watermarkRight == 'default') {
				watermarkContext.drawImage(watermark, scaleX(card.watermarkX), scaleY(card.watermarkY), watermark.width * card.watermarkZoom, watermark.height * card.watermarkZoom);
			} else {
				watermarkContext.fillStyle = card.watermarkRight;
				watermarkContext.fillRect(0, 0, watermarkCanvas.width, watermarkCanvas.height);
			}
			watermarkContext.globalCompositeOperation = 'destination-over';
		}
		if (card.watermarkLeft == 'default') {
			watermarkContext.drawImage(watermark, scaleX(card.watermarkX), scaleY(card.watermarkY), watermark.width * card.watermarkZoom, watermark.height * card.watermarkZoom);
		} else {
			watermarkContext.fillStyle = card.watermarkLeft;
			watermarkContext.fillRect(0, 0, watermarkCanvas.width, watermarkCanvas.height);
		}
		watermarkContext.globalCompositeOperation = 'destination-in';
		watermarkContext.drawImage(watermark, scaleX(card.watermarkX), scaleY(card.watermarkY), watermark.width * card.watermarkZoom, watermark.height * card.watermarkZoom);
		watermarkContext.globalAlpha = card.watermarkOpacity;
		watermarkContext.fillRect(0, 0, watermarkCanvas.width, watermarkCanvas.height);
	}
	drawCard();
}
function resetWatermark() {
	var watermarkZoom;
	if (watermark.width / watermark.height > scaleWidth(card.watermarkBounds.width) / scaleHeight(card.watermarkBounds.height)) {
		watermarkZoom = (scaleWidth(card.watermarkBounds.width) / watermark.width * 100).toFixed(1);
	} else {
		watermarkZoom = (scaleHeight(card.watermarkBounds.height) / watermark.height * 100).toFixed(1);
	}
	document.querySelector('#watermark-zoom').value = watermarkZoom;
	document.querySelector('#watermark-x').value = Math.round(scaleX(card.watermarkBounds.x) - watermark.width * watermarkZoom / 200 - scaleWidth(card.marginX));
	document.querySelector('#watermark-y').value = Math.round(scaleY(card.watermarkBounds.y) - watermark.height * watermarkZoom / 200 - scaleHeight(card.marginY));
	watermarkEdited();
}
//svg cropper
function getSetSymbolWatermark(url, targetImage = watermark) {
	if (!url.includes('/')) {
		url = 'https://cdn.jsdelivr.net/npm/keyrune/svg/' + url + '.svg';
	}
	const xhttp = new XMLHttpRequest();
	xhttp.open('GET', url, true);
	xhttp.overrideMimeType('image/svg+xml');
	xhttp.onload = function(event) {
		if (this.readyState == 4 && this.status == 200) {
		    var svg = document.body.appendChild(this.responseXML.documentElement);
		    var box = svg.getBBox(svg);
			svg.setAttribute('viewBox', [box.x, box.y, box.width, box.height].join(' '));
			svg.setAttribute('width', box.width);
			svg.setAttribute('height', box.height);
			uploadWatermark('data:image/svg+xml,' + encodeURIComponent(svg.outerHTML), 'resetWatermark');
			svg.remove();
		} else if (this.status == 404) {
			throw new Error('Improper Set Code');
		}
	}
	xhttp.send();
}
//Bottom Info Tab
async function loadBottomInfo(textObjects = []) {
	await bottomInfoContext.clearRect(0, 0, bottomInfoCanvas.width, bottomInfoCanvas.height);
	card.bottomInfo = null;
	card.bottomInfo = textObjects;
	await bottomInfoEdited();
	bottomInfoEdited();
}
async function bottomInfoEdited() {
	// console.log("bottomInfoEdited");
	await bottomInfoContext.clearRect(0, 0, bottomInfoCanvas.width, bottomInfoCanvas.height);
	card.infoNumber = document.querySelector('#info-number').value;
	card.infoRarity = document.querySelector('#info-rarity').value;
	card.infoSet = document.querySelector('#info-set').value;
	card.infoLanguage = document.querySelector('#info-language').value;
	card.infoArtist = document.querySelector('#info-artist').value;
	card.infoYear = document.querySelector('#info-year').value;
	card.infoNote = document.querySelector('#info-note').value;
	var writed = false;
	if (document.querySelector('#enableCollectorInfo').checked) {
		await ensureTextFontsReady(Object.values(card.bottomInfo));
		for (var textObject of Object.entries(card.bottomInfo)) {
				if (["NOT FOR SALE"].some(v => textObject[1].text.includes(v))) {
					if(params.get('nfs') == null) {
						continue;
					}
					else {
						textObject[1].name = textObject[0];
						await writeText(textObject[1], bottomInfoContext);
					}
				} 
				else if(["Wizards of the Coast"].some(v => textObject[1].text.includes(v)) ||(textObject[1].name != null && textObject[1].name == 'wizards')) {
					if(params.get('wizards') == null && document.querySelector('#enableCopyright').checked == false && document.querySelector('#enableWebsiteInfo').checked == false) {
						continue;
					}
					else {
						textObject[1].name = textObject[0];
						if(document.querySelector('#enableCopyright').checked == false) {
							textObject[1].text = '{ptshift0,0.0172} ' + (document.querySelector('#extra-info')?.value || 'card.sentixx.top');
							writed = true;
						} else {
							textObject[1].text = '{ptshift0,0.0172}\u2122 & \u00a9 {elemidinfo-year} ' + 'Wizards of the Coast';
							writed = false;
						}
						await writeText(textObject[1], bottomInfoContext);
					}
				}
				else if(["CardConjurer.com", "card.sentixx.top"].some(v => v && textObject[1].text.includes(v)) || (textObject[1].name != null && textObject[1].name == 'bottomRight')) {
					if(params.get('copyright') == null && document.querySelector('#enableWebsiteInfo').checked == false) {
						continue;
					}
					if(writed) {
						continue;
					}
					else {
						textObject[1].name = textObject[0];
						textObject[1].text = '{ptshift0,0.0172}' + (document.querySelector('#extra-info')?.value || 'card.sentixx.top');
						// console.log(document.querySelector('#extra-info')?.value);
						// console.log(textObject[1]);
						// console.log(textObject[0]);
						await writeText(textObject[1], bottomInfoContext);
					}
				} else {
					textObject[1].name = textObject[0];
					await writeText(textObject[1], bottomInfoContext);
				}
				continue;
		}
	}

	drawCard();
}
async function serialInfoEdited() {
	card.serialNumber = document.querySelector('#serial-number').value;
	card.serialTotal = document.querySelector('#serial-total').value;
	card.serialX = document.querySelector('#serial-x').value;
	card.serialY = document.querySelector('#serial-y').value;
	card.serialScale = document.querySelector('#serial-scale').value;

	drawCard();
}

async function resetSerial() {
	card.serialX = scaleX(172/2010);
	card.serialY = scaleY(1383/2814);
	card.serialScale = 1.0;

	document.querySelector('#serial-x').value = card.serialX;
	document.querySelector('#serial-y').value = card.serialY;
	document.querySelector('#serial-scale').value = card.serialScale;

	drawCard();
}

function artistEdited(value) {
	document.querySelector('#art-artist').value = value;
	document.querySelector('#info-artist').value = value;
	bottomInfoEdited();
}
function toggleStarDot() {
	for (var key of Object.keys(card.bottomInfo)) {
		var text = card.bottomInfo[key].text
		if (text.includes('*')) {
			card.bottomInfo[key].text = text.replace('*', ' \u2022 ');
		} else {
			card.bottomInfo[key].text = text.replace(' \u2022 ', '*');
		}
	}
	defaultCollector.starDot = !defaultCollector.starDot;
	bottomInfoEdited();
}
function saveCheckboxSetting(storageKey, selector) {
	localStorage.setItem(storageKey, document.querySelector(selector).checked);
}
function enableNewCollectorInfoStyle() {
	saveCheckboxSetting('enableNewCollectorStyle', '#enableNewCollectorStyle');
	setBottomInfoStyle();
	bottomInfoEdited();
}
function enableCollectorInfo() {
	saveCheckboxSetting('enableCollectorInfo', '#enableCollectorInfo');
	bottomInfoEdited();
}
function enableImportCollectorInfo() {
	saveCheckboxSetting('enableImportCollectorInfo', '#enableImportCollectorInfo');
}
function enableImportArtist() {
	saveCheckboxSetting('enableImportArtist', '#enableImportArtist');
}
function enableCopyright() {
	saveCheckboxSetting('enableCopyright', '#enableCopyright');
	bottomInfoEdited()
}
function enableWebsiteInfo() {
	saveCheckboxSetting('enableWebsiteInfo', '#enableWebsiteInfo');
	bottomInfoEdited()
}
function setAutoFrame() {
	var value = document.querySelector('#autoFrame').value;
	localStorage.setItem('autoFrame', value);

	if (value !== 'false') {
		document.querySelector('#autoLoadFrameVersion').checked = true;
		localStorage.setItem('autoLoadFrameVersion', 'true');
	}

	autoFrame();
}
function setAutofit() {
	saveCheckboxSetting('autoFit', '#art-update-autofit');
}
function removeDefaultCollector() {
	defaultCollector = {}; //{number: year, rarity:'P', setCode:'MTG', lang:'EN', starDot:false};
	localStorage.removeItem('defaultCollector'); //localStorage.setItem('defaultCollector', JSON.stringify(defaultCollector));
}
function setDefaultCollector() {
	starDot = defaultCollector.starDot;
	defaultCollector = {
		artist: document.querySelector('#info-artist').value,
		number: document.querySelector('#info-number').value,
		rarity: document.querySelector('#info-rarity').value,
		setCode: document.querySelector('#info-set').value,
		lang: document.querySelector('#info-language').value,
		note: document.querySelector('#info-note').value,
		starDot: starDot
	};
	localStorage.setItem('defaultCollector', JSON.stringify(defaultCollector));
}
function drawSetSymbol(cardContext, setSymbol, bounds) {
    if (!bounds) return;
    
    const symbolWidth = setSymbol.width * card.setSymbolZoom;
    const symbolHeight = setSymbol.height * card.setSymbolZoom; 
    const x = scaleX(card.setSymbolX);
    const y = scaleY(card.setSymbolY);

    if (bounds.outlineWidth && bounds.outlineWidth > 0) {
        // Create temp canvas for outlined symbol
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        // Scale the outline width the same way text outlines are scaled
        const outlineWidth = scaleHeight(bounds.outlineWidth);
        const margin = outlineWidth * 2;
        tempCanvas.width = symbolWidth + margin;
        tempCanvas.height = symbolHeight + margin;
        
        // Setup stroke style (similar to text outline system)
        tempCtx.strokeStyle = bounds.outlineColor || 'black';
        tempCtx.lineWidth = outlineWidth;
        tempCtx.lineJoin = bounds.lineJoin || 'round';
        tempCtx.lineCap = bounds.lineCap || 'round';
        
        // First pass: Draw outline by stroking the symbol multiple times in a circle pattern
        const outlineSteps = Math.max(8, Math.ceil(outlineWidth * 2));
        for (let i = 0; i < outlineSteps; i++) {
            const angle = (i / outlineSteps) * Math.PI * 2;
            const offsetX = Math.cos(angle) * (outlineWidth / 2);
            const offsetY = Math.sin(angle) * (outlineWidth / 2);
            
            tempCtx.globalCompositeOperation = 'source-over';
            tempCtx.drawImage(setSymbol, 
                outlineWidth + offsetX, 
                outlineWidth + offsetY, 
                symbolWidth, 
                symbolHeight);
            
            // Apply the outline color
            tempCtx.globalCompositeOperation = 'source-in';
            tempCtx.fillStyle = bounds.outlineColor || 'black';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempCtx.globalCompositeOperation = 'destination-over';
        }
        
        // Second pass: Draw the original symbol on top
        tempCtx.globalCompositeOperation = 'source-over';
        tempCtx.drawImage(setSymbol, outlineWidth, outlineWidth, symbolWidth, symbolHeight);

        // Draw to main canvas
        cardContext.drawImage(tempCanvas, 
            x - outlineWidth, 
            y - outlineWidth,
            tempCanvas.width,
            tempCanvas.height);
    } else {
        // Draw main symbol without outline (simple path)
        cardContext.drawImage(setSymbol, x, y, symbolWidth, symbolHeight);
    }
}
function triggerDownloadLink(href, downloadName, target = '') {
	const downloadElement = document.createElement('a');
	downloadElement.href = href;
	downloadElement.download = downloadName;
	if (target) downloadElement.target = target;
	document.body.appendChild(downloadElement);
	const clickResult = downloadElement.click();
	downloadElement.remove();
	return clickResult;
}
function createSelectOption(label, value) {
	const option = document.createElement('option');
	option.innerHTML = label;
	if (value !== undefined) option.value = value;
	return option;
}
//DRAWING THE CARD (putting it all together)
function drawCard() {
	// reset
	cardContext.globalCompositeOperation = 'source-over';
	cardContext.clearRect(0, 0, cardCanvas.width, cardCanvas.height);
	// art
	cardContext.save();
	cardContext.translate(scaleX(card.artX), scaleY(card.artY));
	cardContext.rotate(Math.PI / 180 * (card.artRotate || 0));
	if (document.querySelector('#grayscale-art').checked) {
		cardContext.filter='grayscale(1)';
	}
	cardContext.drawImage(art, 0, 0, art.width * card.artZoom, art.height * card.artZoom);
	cardContext.restore();
	// frame elements
	if ((card.version.includes('planeswalker') || card.version.includes('鹏洛客')) && typeof planeswalkerPreFrameCanvas !== "undefined") {
		cardContext.drawImage(planeswalkerPreFrameCanvas, 0, 0, cardCanvas.width, cardCanvas.height);
	}
	cardContext.drawImage(frameCanvas, 0, 0, cardCanvas.width, cardCanvas.height);
	if ((card.version.toLowerCase().includes('planeswalker')  || card.version.includes('鹏洛客')) && typeof planeswalkerPostFrameCanvas !== "undefined") {
		cardContext.drawImage(planeswalkerPostFrameCanvas, 0, 0, cardCanvas.width, cardCanvas.height);
	} else if ((card.version.toLowerCase().includes('planeswalker') || card.version.includes('鹏洛客')) && typeof planeswalkerCanvas !== "undefined") {
		cardContext.drawImage(planeswalkerCanvas, 0, 0, cardCanvas.width, cardCanvas.height);
	} else if (card.version.toLowerCase().includes('station') && typeof stationPreFrameCanvas !== "undefined") {
		cardContext.drawImage(stationPreFrameCanvas, 0, 0, cardCanvas.width, cardCanvas.height);
	}
	if (card.version.toLowerCase().includes('station') && typeof stationPostFrameCanvas !== "undefined") {
		cardContext.drawImage(stationPostFrameCanvas, 0, 0, cardCanvas.width, cardCanvas.height);
	} else if (card.version.toLowerCase().includes('qrcode') && typeof qrCodeCanvas !== "undefined") {
		cardContext.drawImage(qrCodeCanvas, 0, 0, cardCanvas.width, cardCanvas.height);
	} // REMOVE/DELETE PLANESWALKERCANVAS AFTER A FEW WEEKS
	// guidelines
	if (document.querySelector('#show-guidelines').checked) {
		cardContext.drawImage(guidelinesCanvas, scaleX(card.marginX) / 2, scaleY(card.marginY) / 2, cardCanvas.width, cardCanvas.height);
	}
	// watermark
	cardContext.drawImage(watermarkCanvas, 0, 0, cardCanvas.width, cardCanvas.height);
	// custom elements for sagas, classes, and dungeons
	if (card.version.toLowerCase().includes('saga') && typeof sagaCanvas !== "undefined") {
		cardContext.drawImage(sagaCanvas, 0, 0, cardCanvas.width, cardCanvas.height);
	} else if (card.version.includes('class') && !card.version.includes('classic') && typeof classCanvas !== "undefined") {
		cardContext.drawImage(classCanvas, 0, 0, cardCanvas.width, cardCanvas.height);
	} else if (card.version.toLowerCase().includes('dungeon') && typeof dungeonCanvas !== "undefined") {
		cardContext.drawImage(dungeonCanvas, 0, 0, cardCanvas.width, cardCanvas.height);
	}
	// text
	cardContext.drawImage(textCanvas, 0, 0, cardCanvas.width, cardCanvas.height);
	// set symbol
	if (card.setSymbolBounds) {
		drawSetSymbol(cardContext, setSymbol, card.setSymbolBounds); 
	}
	// serial
	if (card.serialNumber || card.serialTotal) {
		var x = parseInt(card.serialX) || 172;
		var y = parseInt(card.serialY) || 1383;
		var scale = parseFloat(card.serialScale) || 1.0;

		cardContext.drawImage(serial, scaleX(x/2010), scaleY(y/2814), scaleWidth(464/2010) * scale, scaleHeight(143/2814) * scale);

		var number = {
			name:"Number",
			text: '{kerning3}' + card.serialNumber || '',
			x: (x+(30 * scale))/2010,
			y: (y+(52 * scale))/2814,
			width: (190 * scale)/2010,
			height: (55 * scale)/2814,
			oneLine: true,
			font: 'gothambold',
			color: 'white',
			size: (55 * scale)/2010,
			align: 'center'
		};

		var total = {
			name:"Number",
			text: '{kerning3}' + card.serialTotal || '',
			x: (x+(251 * scale))/2010,
			y: (y+(52 * scale))/2814,
			width: (190 * scale)/2010,
			height: (55 * scale)/2814,
			oneLine: true,
			font: 'gothambold',
			color: 'white',
			size: (55 * scale)/2010,
			align: 'center'
		};

		writeText(number, cardContext);
		writeText(total, cardContext);
	}
	// bottom info
	if (card.bottomInfoTranslate) {
		cardContext.save();
		cardContext.rotate(Math.PI / 180 * (card.bottomInfoRotate || 0));
		cardContext.translate(card.bottomInfoTranslate.x || 0, card.bottomInfoTranslate.y || 0);
		cardContext.drawImage(bottomInfoCanvas, 0, 0, cardCanvas.width * (card.bottomInfoZoom || 1), cardCanvas.height * (card.bottomInfoZoom || 1));
		cardContext.restore();
	} else {
		cardContext.drawImage(bottomInfoCanvas, 0, 0, cardCanvas.width, cardCanvas.height);
	}


	// cutout the corners
	cardContext.globalCompositeOperation = 'destination-out';
	if (!card.noCorners && (card.marginX == 0 && card.marginY == 0)) {
		var w = card.version == 'battle' ? 2100 : getStandardWidth();

		cardContext.drawImage(corner, 0, 0, scaleWidth(59/w), scaleWidth(59/w));
		cardContext.rotate(Math.PI / 2);
		cardContext.drawImage(corner, 0, -card.width, scaleWidth(59/w), scaleWidth(59/w));
		cardContext.rotate(Math.PI / 2);
		cardContext.drawImage(corner, -card.width, -card.height, scaleWidth(59/w), scaleWidth(59/w));
		cardContext.rotate(Math.PI / 2);
		cardContext.drawImage(corner, -card.height, 0, scaleWidth(59/w), scaleWidth(59/w));
		cardContext.rotate(Math.PI / 2);
	}
	// show preview
	previewContext.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
	previewContext.drawImage(cardCanvas, 0, 0, previewCanvas.width, previewCanvas.height);

	if (window.cardDrawingPromiseResolver) {
        window.cardDrawingPromiseResolver();
        window.cardDrawingPromiseResolver = null;
	}
}
//DOWNLOADING
function downloadCard(alt = false, jpeg = false) {
	if (card.infoArtist.replace(/ /g, '') == '' && !card.artSource.includes('/img/blank.png') && !card.artZoom == 0) {
		notify('You must credit an artist before downloading!', 5);
	} else {
		// Prep file information
		var imageDataURL;
		var imageName = getCardName();
		if (jpeg) {
			imageDataURL = cardCanvas.toDataURL('image/jpeg', 0.8);
			imageName = imageName + '.jpeg';
		} else {
			imageDataURL = cardCanvas.toDataURL('image/png');
			imageName = imageName + '.png';
		}
		// Download image
		if (alt) {
			const newWindow = window.open('about:blank');
			setTimeout(function(){
				newWindow.document.body.appendChild(newWindow.document.createElement('img')).src = imageDataURL;
				newWindow.document.querySelector('img').style = 'max-height: 100vh; max-width: 100vw;';
				newWindow.document.body.style = 'padding: 0; margin: 0; text-align: center; background-color: #888;';
				newWindow.document.title = imageName;
			}, 0);
		} else {
			triggerDownloadLink(imageDataURL, imageName, '_blank');
		}
	}
}

function localImportCard(cardObject) {
	// console.log(cardObject);
	scryfallCard = cardObject
	const importIndex = document.querySelector("#import-index");
	importIndex.innerHTML = null;
	var optionIndex = 0;
	cardObject.forEach((card) => {
		if (card.type && card.type != "Card") {
			var title = `${card.name} `;
			if (document.querySelector("#importAllPrints").checked) {
				title += `(${card.set.toUpperCase()} #${
					card.collector_number
				})`;
			} else {
				title += `(${card.type_line})`;
			}
			importIndex.appendChild(createSelectOption(title, optionIndex));
		}
		optionIndex++;
	});
	changeCardIndex();
}
async function ensureBulkZipSupportReady() {
	if (typeof JSZip !== 'undefined') {
		return true;
	}

	try {
		notify('Loading ZIP support...', 3);
		await loadExternalScriptOnce(jsZipScriptUrl);
		return true;
	} catch {
		notify('Required library (JSZip) failed to load. Please check your connection and try again.', 5);
		return false;
	}
}

function getSavedCardKeys() {
	return JSON.parse(localStorage.getItem('cardKeys'));
}

function storeSavedCardKeys(cardKeys) {
	localStorage.setItem('cardKeys', JSON.stringify(cardKeys));
}

async function bulkDownloadZip() {
    // 1. Initial checks for libraries and saved cards.
    if (!await ensureBulkZipSupportReady()) {
		return;
	}
    const cardKeys = getSavedCardKeys();
    if (!cardKeys || cardKeys.length === 0) {
        notify('No saved cards found to download.', 3);
        return;
    }

    let fileHandle = null;
    let useStreaming = false;

    // 2. Trigger the file picker immediately to capture the user gesture.
    if (window.showSaveFilePicker) {
        try {
            notify('Please choose a location to save your ZIP file.', 15);
            fileHandle = await window.showSaveFilePicker({
                suggestedName: 'CardConjurer_Bulk.zip',
                types: [{
                    description: 'ZIP file',
                    accept: { 'application/zip': ['.zip'] },
                }],
            });
            useStreaming = true;
        } catch (err) {
            // This error occurs if the user clicks "Cancel" in the save dialog.
            if (err.name === 'AbortError') {
                notify('Save operation cancelled.', 3);
                return; // Exit the function entirely if the user cancels.
            }
            // If another error occurs, fall back to the in-memory method.
            console.error("Could not get file handle, falling back to in-memory method:", err);
        }
    }

    // 3. Save the current state and prepare the zip object.
    notify(`Preparing to process ${cardKeys.length} cards...`, 10);
    const zip = new JSZip();
    const tempKey = '__temp_current_card_state__';
    const cardToSave = cloneCardForStorage();
    localStorage.setItem(tempKey, JSON.stringify(cardToSave));

    // 4. Loop through each saved card to render and add it to the zip object.
    for (const [index, key] of cardKeys.entries()) {
        try {
			notify(`Processing card ${index + 1} of ${cardKeys.length}: ${key}`, 1);

            ImageLoadTracker.start();
            FontLoadTracker.start();
            await loadCard(key);
            drawText();
            
            const imagePromise = ImageLoadTracker.waitForAll();
            const fontPromise = FontLoadTracker.waitForAll();
            await Promise.all([imagePromise, fontPromise]);
            
            await new Promise(resolve => setTimeout(resolve, 50));
            drawCard();
            
            const imageName = getCardName() + '.png';
            const imageData = cardCanvas.toDataURL('image/png').split(',')[1];
            
            zip.file(imageName, imageData, { base64: true });
            console.log(`Zipped: ${imageName}`);

        } catch (error) {
            console.error(`Failed to process and zip card "${key}":`, error);
            notify(`Skipping card "${key}" due to an error.`, 3);
        } finally {
            ImageLoadTracker.stop();
            FontLoadTracker.stop();
        }
    }

    // 5. Generate and save the ZIP file using the appropriate method.
    try {
        if (useStreaming && fileHandle) {
            // Ideal Path: Manually pump the JSZip stream to the WritableStream.
            notify('Saving ZIP file to disk...', 10);
            const writable = await fileHandle.createWritable();

            await new Promise((resolve, reject) => {
                const stream = zip.generateInternalStream({ type: 'uint8array', streamFiles: true });
                
                stream
                    .on('data', (chunk) => { writable.write(chunk).catch(reject); })
                    .on('end', () => { writable.close().then(resolve).catch(reject); })
                    .on('error', (err) => { reject(err); })
                    .resume();
            });
            notify('ZIP file saved successfully!', 5);

        } else {
            // Fallback Path: For browsers without streaming support.
            notify('Streaming not supported. Building ZIP in memory... This may be slow or fail.', 10);
            const content = await zip.generateAsync({ type: 'blob' });
            triggerDownloadLink(URL.createObjectURL(content), 'CardConjurer_Bulk.zip');
        }
    } catch (err) {
        console.error('Failed to generate or save ZIP file:', err);
        notify('An error occurred while saving the ZIP file.', 5);
    }
    
    // 6. Restore the user's original card state.
    await loadCard(tempKey);
    localStorage.removeItem(tempKey);
    console.log('Bulk download process finished. User state restored.');
}
//IMPORT/SAVE TAB
function buildImportedCardOptionTitle(card) {
	var title = `${getImportedCardOptionName(card)} `;
	if (document.querySelector('#importAllPrints').checked) {
		title += `(${card.set.toUpperCase()} #${card.collector_number})`;
	} else {
		title += `(${card.type_line})`
	}
	return title;
}
function applyImportedBaseTextFields(cardToImport, cardVersion, textFields, textPrefix) {
	const name = getImportedDisplayName(cardToImport);

	if (textFields.title) {
		const titleFields = buildImportedTitleTextFields(name, cardVersion, textPrefix);
		if (cardVersion == 'wanted') {
			textFields.title.text = titleFields.title;
			textFields.subtitle.text = titleFields.subtitle;
		} else {
			textFields.title.text = titleFields.title;
		}
	}

	if (textFields.nickname) {textFields.nickname.text = cardToImport.flavor_name || '';}
	if (textFields.mana) {textFields.mana.text = cardToImport.mana_cost || '';}
	if (textFields.type) {
		const typeFields = buildImportedTypeTextFields(cardToImport.type_line, cardToImport.lang, textPrefix);
		cardToImport.type_line = typeFields.typeLine;
		textFields.type.text = typeFields.text;}
}
function applyImportedCollectorFields(cardToImport) {
	const collectorFields = buildImportedCollectorFields(cardToImport);
	document.querySelector("#info-number").value = collectorFields.number;
	document.querySelector("#info-rarity").value = collectorFields.rarity;
	document.querySelector("#info-set").value = collectorFields.setCode;
	document.querySelector("#info-language").value = collectorFields.language;
}
function applyImportedCollectorInfo(cardToImport) {
	if (!shouldImportCollectorInfo(localStorage.getItem("enableImportCollectorInfo"))) {
		return;
	}

	applyImportedCollectorFields(cardToImport);
	requestImportedCollectorNumberUpdate(cardToImport);
}
function requestImportedCollectorNumberUpdate(cardToImport) {
	var setXhttp = new XMLHttpRequest();
	setXhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			const numberUpdate = buildImportedCollectorNumberUpdateFromSetResponse(
				document.querySelector("#info-number").value,
				this.responseText,
				document.querySelector("#enableNewCollectorStyle").checked
			);
			if (numberUpdate.shouldUpdate) {
				document.querySelector("#info-number").value = numberUpdate.number;
				bottomInfoEdited();
			}
		}
	};
	setXhttp.open(
		"GET",
		buildImportedCollectorSetUrl(cardToImport.set),
		true
	);
	try {
		setXhttp.send();
	} catch {
		console.log("Scryfall API search failed.");
	}
}
function applyImportedSetSymbolImportPlan(setSymbolPlan) {
	if (setSymbolPlan.code !== null) {
		document.querySelector('#set-symbol-code').value = setSymbolPlan.code;
	}
	document.querySelector('#set-symbol-rarity').value = setSymbolPlan.rarity;
	if (setSymbolPlan.shouldFetch) {
		fetchSetSymbol();
	}
}
function applyImportedArtImportPlan(cardToImport, artPlan) {
	document.querySelector('#art-name').value = artPlan.name;
	if (artPlan.cropUrl) {
		console.log('[mtgch-import] upload primary art from imported card', {
			name: cardToImport.name,
			set: cardToImport.set,
			collector_number: cardToImport.collector_number,
			art_crop: artPlan.cropUrl,
		});
		uploadArt(artPlan.cropUrl, 'autoFit');
	}
	if (artPlan.fetchName !== null) {
		fetchScryfallData(artPlan.fetchName, artFromScryfall, 'art');
	}
	if (artPlan.artIndex !== null) {
		document.querySelector('#art-index').value = artPlan.artIndex;
		changeArtIndex();
	}
}
function applyImportedCardMedia(cardToImport) {
	const artPlan = buildImportedArtImportPlan(
		cardToImport,
		document.querySelector("#datasource").value,
		document.querySelector('#importAllPrints').checked,
		document.querySelector('#import-index').value
	);
	applyImportedArtImportPlan(cardToImport, artPlan);

	const setSymbolPlan = buildImportedSetSymbolImportPlan(
		cardToImport,
		document.querySelector('#lockSetSymbolCode').checked,
		document.querySelector('#lockSetSymbolURL').checked
	);
	applyImportedSetSymbolImportPlan(setSymbolPlan);
}
function applyImportedPrintIdentity(cardToImport) {
	const printIdentity = getImportedPrintIdentity(cardToImport);
	cardToImport.set = printIdentity.set;
	cardToImport.collector_number = printIdentity.collector_number;
}
function clearTextFieldValuesPreserving(textFields, fieldNames) {
	const savedTextContents = collectTextFieldValues(textFields, fieldNames);
	Object.keys(textFields).forEach(key => {
		textFields[key].text = '';
	});
	Object.keys(savedTextContents).forEach(field => {
		if (textFields[field]) {
			textFields[field].text = savedTextContents[field];
		}
	});
	return savedTextContents;
}
function resetTextFieldFontSizes(textFields, fontSize = 0) {
	Object.keys(textFields).forEach(key => {
		textFields[key].fontSize = fontSize;
	});
}
function applyImportedTextEditorState(textFields, textIndex) {
	document.querySelector('#text-editor').value = getSelectedTextField(textFields, textIndex).text;
	document.querySelector('#text-editor-font-size').value = 0;
	resetTextFieldFontSizes(textFields);
	textEdited();
}
function applyImportedStandardText(cardToImport, cardObject, textPrefix, textIndex) {
	applyImportedBaseTextFields(cardToImport, cardObject.version, cardObject.text, textPrefix);
	applyImportedRulesText(cardToImport, cardObject.version, cardObject.text, textPrefix);
	applyImportedPtText(cardToImport, cardObject.version, cardObject.text);
	applyImportedVersionSpecificText(cardToImport, cardObject);
	applyImportedTextEditorState(cardObject.text, textIndex);
}
function prepareImportedCardTextFields(cardToImport, cardObject) {
	applyImportedPrintIdentity(cardToImport);

	var savedReminderText = '';
	const shouldPreserveReminder = cardObject.text?.reminder && shouldPreserveImportedReminderText(cardObject.version);
	if (shouldPreserveReminder) {
		savedReminderText = cardObject.text.reminder.text;
	}

	if (cardObject.text) {
		clearTextFieldValuesPreserving(cardObject.text, ['left', 'right']);
	}

	const importedReminderText = extractImportedReminderText(cardToImport.oracle_text);
	if (shouldPreserveReminder) {
		cardObject.text.reminder.text = importedReminderText || savedReminderText;
	}
}
function applyImportedSpecialLayoutMedia(cardToImport) {
	const mediaPlan = buildImportedSpecialLayoutMediaPlan(cardToImport);
	if (mediaPlan.artist) {
		artistEdited(mediaPlan.artist);
	}
	if (mediaPlan.cropUrl) {
		uploadArt(mediaPlan.cropUrl, 'autoFit');
	}
}
function applyImportedSpecialLayoutSetSymbol(cardToImport) {
	const setSymbolPlan = buildImportedSpecialLayoutSetSymbolPlan(
		cardToImport,
		document.querySelector('#lockSetSymbolCode').checked,
		document.querySelector('#lockSetSymbolURL').checked
	);
	if (setSymbolPlan.code !== null) {
		document.querySelector('#set-symbol-code').value = setSymbolPlan.code;
		document.querySelector('#set-symbol-rarity').value = setSymbolPlan.rarity;
		if (setSymbolPlan.shouldFetch) {
			fetchSetSymbol();
		}
	}
}
function getImportedUniqueLayoutParser(layout) {
	if (layout === 'leveler') {
		return parseLevelerCard;
	} else if (layout === 'prototype') {
		return parsePrototypeLayout;
	} else if (layout === 'mutate') {
		return parseMutateLayout;
	} else if (layout === 'vanguard') {
		return parseVanguardLayout;
	}
	return null;
}
function parseImportedUniqueLayout(cardToImport) {
	const parser = getImportedUniqueLayoutParser(cardToImport.layout);
	return parser ? parser(cardToImport) : null;
}
function applyImportedUniqueBaseFields(uniqueData, cardObject, textPrefix) {
	cardObject.text.title.text = textPrefix + uniqueData.name;
	cardObject.text.type.text = textPrefix + uniqueData.type;
	cardObject.text.mana.text = uniqueData.mana;

	if (cardObject.text.pt) {
		cardObject.text.pt.text = uniqueData.basePT;
	}
}
function applyImportedLevelerFields(uniqueData, cardObject, textPrefix) {
	cardObject.text.levelup.text = textPrefix + uniqueData.levelUpText;

	if (uniqueData.levels[0]) {
		const level1Data = uniqueData.levels[0];
		if (cardObject.text.level2) {
			cardObject.text.level2.text = `LEVEL\n{fontsize${scaleHeight(0.0162)}}${level1Data.range}`;
		}
		if (cardObject.text.rules2) {
			cardObject.text.rules2.text = textPrefix + level1Data.rulesText;
		}
		if (cardObject.text.pt2) {
			cardObject.text.pt2.text = level1Data.pt;
		}
	}

	if (uniqueData.levels[1]) {
		const level2Data = uniqueData.levels[1];
		if (cardObject.text.level3) {
			cardObject.text.level3.text = `LEVEL\n{fontsize${scaleHeight(0.0162)}}${level2Data.range}`;
		}
		if (cardObject.text.rules3) {
			cardObject.text.rules3.text = textPrefix + level2Data.rulesText;
		}
		if (cardObject.text.pt3) {
			cardObject.text.pt3.text = level2Data.pt;
		}
	}
}
function applyImportedPrototypeFields(uniqueData, cardObject, textPrefix) {
	if (cardObject.text.rules2) {
		cardObject.text.rules2.text = textPrefix + uniqueData.rules;
	}
	if (cardObject.text.prototype) {
		cardObject.text.prototype.text = textPrefix + uniqueData.prototype.reminderText;
	}
	if (cardObject.text.mana2) {
		cardObject.text.mana2.text = uniqueData.prototype.cost;
	}
	if (cardObject.text.pt2) {
		cardObject.text.pt2.text = uniqueData.prototype.pt;
	}
}
function applyImportedMutateFields(uniqueData, cardObject, textPrefix) {
	if (cardObject.text.rules2) {
		cardObject.text.rules2.text = textPrefix + uniqueData.rules;
	}
	if (cardObject.text.mutate) {
		cardObject.text.mutate.text = textPrefix + uniqueData.mutate.reminderText;
	}
}
function applyImportedVanguardFields(uniqueData, cardObject, textPrefix) {
	if (cardObject.text.ability) {
		cardObject.text.ability.text = textPrefix + uniqueData.rules;
	}
	if (cardObject.text.flavor) {
		cardObject.text.flavor.text = textPrefix + uniqueData.flavor;
	}
	if (cardObject.text.leftval) {
		cardObject.text.leftval.text = uniqueData.handModifier;
	}
	if (cardObject.text.rightval) {
		cardObject.text.rightval.text = uniqueData.lifeModifier;
	}
}
function applyImportedUniqueTextFields(uniqueData, cardObject, textPrefix) {
	if (!cardObject.text?.title) return;

	applyImportedUniqueBaseFields(uniqueData, cardObject, textPrefix);

	if (uniqueData.layout === 'leveler') {
		applyImportedLevelerFields(uniqueData, cardObject, textPrefix);
	} else if (uniqueData.layout === 'prototype') {
		applyImportedPrototypeFields(uniqueData, cardObject, textPrefix);
	} else if (uniqueData.layout === 'mutate') {
		applyImportedMutateFields(uniqueData, cardObject, textPrefix);
	} else if (uniqueData.layout === 'vanguard') {
		applyImportedVanguardFields(uniqueData, cardObject, textPrefix);
	}
}

function applyImportedUniqueLayoutCard(cardToImport, cardObject, textPrefix) {
	const uniqueData = parseImportedUniqueLayout(cardToImport);

	applyImportedSpecialLayoutMedia(cardToImport);
	applyImportedSpecialLayoutSetSymbol(cardToImport);
	applyImportedUniqueTextFields(uniqueData, cardObject, textPrefix);

	textEdited();
}
function createImportedCardOption(cardToImport, optionIndex) {
	var option = document.createElement('option');
	option.innerHTML = buildImportedCardOptionTitle(cardToImport);
	option.value = optionIndex;
	return option;
}
function populateImportedCardOptions(importIndex, cardObjects) {
	importIndex.innerHTML = null;
	cardObjects.forEach((cardToImport, optionIndex) => {
		if (shouldRenderImportedCardOption(cardToImport)) {
			importIndex.appendChild(createImportedCardOption(cardToImport, optionIndex));
		}
	});
}
function ensureImportedCardOptionSelected(importIndex) {
	if (importIndex.options.length > 0 && (importIndex.value === '' || importIndex.value == null)) {
		importIndex.selectedIndex = 0;
	}
}
function renderImportedCardOptions(importIndex, cardObjects) {
	populateImportedCardOptions(importIndex, cardObjects);
	ensureImportedCardOptionSelected(importIndex);
}
function setImportedCards(cardObject) {
	scryfallCard = cardObject;
	return scryfallCard;
}
function getImportIndexControl() {
	return document.querySelector('#import-index');
}
function loadImportedCardOptions(cardObject) {
	const importIndex = getImportIndexControl();
	renderImportedCardOptions(importIndex, cardObject);
	return importIndex;
}
function importCard(cardObject) {
	console.log('Import card called with:', cardObject);
	setImportedCards(cardObject);
	loadImportedCardOptions(cardObject);
	changeCardIndex();
}
function importCardFromClipboardText(text) {
	console.log(text);
	const card = scryfallCardFromText(text);
	importCard([card]);
	return card;
}
function notifyPasteCardTextFailure(error) {
	console.error('Failed to read clipboard text: ', error);
	notify('Clipboard access failed. Did you click the button?');
}
async function pasteCardText() {
	try {
		const text = await navigator.clipboard.readText();
		importCardFromClipboardText(text);
	} catch (err) {
		notifyPasteCardTextFailure(err);
	}
}

function applyImportedSagaText(cardToImport, cardObject) {
	const sagaFields = buildImportedSagaFields(cardToImport);
	if (cardObject.text.rules2) {
		cardObject.text.rules2.text = sagaFields.rules2;
	}
	for (let i = 0; i < sagaFields.abilities.length; i++) {
		const ability = sagaFields.abilities[i];
		cardObject.text[ability.field].text = ability.text;
	}
	cardObject.text.reminder.text = sagaFields.reminder;
	cardObject.saga = {...cardObject.saga, ...sagaFields.saga};
	updateAbilityHeights()
}

function applyImportedClassText(cardToImport, cardObject) {
	const classFields = buildImportedClassFields(cardToImport);
	if (cardObject.text.flavor) {
		// future support classes with flavor text
		cardObject.text.flavor.text = classFields.flavor;
	}
	for (let i = 0; i < classFields.levels.length; i++) {
		const levelData = classFields.levels[i];
		if (levelData.cost) {
			cardObject.text[levelData.costField].text = levelData.cost;
		}
		if (levelData.levelLabel) {
			cardObject.text[levelData.levelField].text = levelData.levelLabel;
		}
		cardObject.text[levelData.textField].text = levelData.text;
	}
	cardObject.class = {...cardObject.class, ...classFields.class};
}

function parseMultiFacedCards(card) {
    let [frontFace, backFace] = card.card_faces ?? []
    
    if (card.object === "card_face") {
        // Battle cards: find faces from scryfallCard array
        frontFace = card;
        backFace = scryfallCard.find(face => 
            face.object === "card_face" && 
            face.name !== card.name
        );
    }
    
    if (!frontFace || !backFace) {
        console.error('Could not find both faces for multi-faced card');
        return null;
    }
    
    // Single processing logic for both types
    const faces = {
        front: buildImportedFaceData(frontFace),
        back: buildImportedFaceData(backFace)
    };
    
    return faces;
}

function applyImportedMultiFacedCard(cardToImport, cardObject, textPrefix) {
	const flipData = parseMultiFacedCards(cardToImport);
	if (!flipData) {
		console.error('Failed to parse Multi Faced card data');
		return false;
	}

	applyImportedSpecialLayoutMedia(cardToImport);
	applyImportedSpecialLayoutSetSymbol(cardToImport);

	if (cardObject.text?.title && cardObject.text?.mana) {
		const frontFields = buildImportedFaceTextFields(flipData.front, textPrefix);
		cardObject.text.title.text = frontFields.title;
		cardObject.text.type.text = frontFields.type;
		cardObject.text.rules.text = frontFields.rules;
		cardObject.text.mana.text = frontFields.mana;

		const frontStats = buildImportedFrontStatFields(cardObject.version, flipData.front);
		if (frontStats.defense !== undefined && cardObject.text.defense) {
			cardObject.text.defense.text = frontStats.defense;
		}
		if (frontStats.pt !== undefined && cardObject.text.pt) {
			cardObject.text.pt.text = frontStats.pt;
		}
	}

	if (cardToImport.layout === 'modal_dfc' && cardObject.text?.flipsideType && cardObject.text?.flipSideReminder) {
		cardObject.text.flipsideType.text = textPrefix + flipData.back.type;
		cardObject.text.flipSideReminder.text = textPrefix + flipData.back.rules;
	} else if (cardObject.text?.title2 && cardObject.text?.mana2) {
		const backFields = buildImportedFaceTextFields(flipData.back, textPrefix);
		cardObject.text.title2.text = backFields.title;
		if (shouldImportBackType(cardToImport.type_line)) {
			cardObject.text.type2.text = backFields.type;
		}
		cardObject.text.rules2.text = backFields.rules;
		cardObject.text.mana2.text = backFields.mana;
		if (cardObject.text.pt2) {
			cardObject.text.pt2.text = backFields.pt;
		}
	}

	if (shouldImportBackPtToFrontPt2(cardObject.version) && cardObject.text?.pt2) {
		cardObject.text.pt2.text = flipData.back.pt || '';
	}

	if (shouldUseBackPtAsReminder(cardObject.version, flipData.back.pt) && cardObject.text?.reminder) {
		cardObject.text.reminder.text = flipData.back.pt;
	}

	textEdited();
	return true;
}

function applyImportedRulesText(cardToImport, cardVersion, textFields, textPrefix) {
	var rulesText = formatImportedRulesText(cardToImport);
	var rulesTextPrefix = getImportedRulesTextPrefix(cardToImport.lang, textPrefix);

	if (textFields.rules) {
		const rulesFields = buildImportedRulesTextFields(cardToImport, cardVersion, rulesText, rulesTextPrefix);
		textFields.rules.text = rulesFields.rules;
		if (cardVersion == 'pokemon') {
			textFields.rulesnoncreature.text = rulesFields.rulesnoncreature;
			if (rulesFields.pt !== undefined) {
				textFields.pt.text = rulesFields.pt;
			}
			textFields.middleStatTitle.text = rulesFields.middleStatTitle;
			textFields.rightStatTitle.text = rulesFields.rightStatTitle;
		}
	} else if (textFields.case) {
		textFields.rules.text = buildImportedCaseRulesText(rulesText, rulesTextPrefix);
	}
}
function applyImportedPtText(cardToImport, cardVersion, textFields) {
	if (textFields.pt) {
		var ptFields = buildImportedPtFields(cardToImport, cardVersion);
		if (cardVersion == 'pokemon') {
			textFields.middleStat.text = ptFields.middleStat;
		}
		textFields.pt.text = ptFields.pt;
	}
}

function applyImportedPlaneswalkerText(cardToImport, cardVersion, textFields) {
	const planeswalkerFields = buildImportedPlaneswalkerFields(cardToImport, cardVersion);
	textFields.loyalty.text = planeswalkerFields.loyalty;
	for (var i = 0; i < 4; i ++) {
		const planeswalkerAbility = planeswalkerFields.abilities[i];
		textFields['ability' + i].text = planeswalkerAbility.text;
		document.querySelector('#planeswalker-height-' + i).value = planeswalkerAbility.height;
		if (planeswalkerAbility.cost !== undefined) {
			document.querySelector('#planeswalker-cost-' + i).value = planeswalkerAbility.cost;
		}
	}
	planeswalkerEdited();
}
function shouldApplyImportedClassText(cardVersion) {
	return cardVersion.toLowerCase().includes('class') && !cardVersion.includes('classicshifted') && typeof classCanvas !== "undefined";
}
function applyImportedBattleText(cardToImport, textFields) {
	textFields.defense.text = cardToImport.defense || '';
}
function applyImportedVersionSpecificText(cardToImport, cardObject) {
	if (cardObject.version.includes('planeswalker') || cardObject.version.includes('鹏洛客')) {
		applyImportedPlaneswalkerText(cardToImport, cardObject.version, cardObject.text);
	} else if (cardObject.version.includes('saga')) {
		applyImportedSagaText(cardToImport, cardObject);
	} else if (shouldApplyImportedClassText(cardObject.version)) {
		applyImportedClassText(cardToImport, cardObject);
	} else if (cardObject.version.includes('battle')) {
		applyImportedBattleText(cardToImport, cardObject.text);
	}
}

function clearImportedStationFields(cardObject) {
	if (cardObject.text) {
		['ability0', 'ability1', 'ability2'].forEach(field => {
			if (cardObject.text[field]) cardObject.text[field].text = '';
		});
	}

	if (cardObject.station?.badgeValues) {
		cardObject.station.badgeValues[1] = '';
		cardObject.station.badgeValues[2] = '';
	}
}

function applyImportedStationBasicFields(cardToImport, cardObject, textPrefix) {
	const name = getImportedDisplayName(cardToImport);
	const basicFields = [
		['title', curlyQuotes(name)],
		['type', cardToImport.type_line],
		['mana', cardToImport.mana_cost || ''],
		['pt', cardToImport.power && cardToImport.toughness ? `${cardToImport.power}/${cardToImport.toughness}` : '']
	];

	basicFields.forEach(([field, value]) => {
		if (cardObject.text?.[field]) cardObject.text[field].text = textPrefix + value;
	});
}

function applyImportedStationAbilityFields(cardObject, stationPlacement, textPrefix) {
	stationPlacement.abilityTexts.forEach((text, i) => {
		if (text && cardObject.text[`ability${i}`]) {
			cardObject.text[`ability${i}`].text = textPrefix + text;
		}
	});
}

function scheduleImportedStationSettings(cardObject, stationPlacement) {
	const { badges, hasPreText, shouldDisableFirstSquare } = stationPlacement;
	setTimeout(() => {
		const disableCheckbox = document.querySelector('#station-disable-first-ability');
		if (disableCheckbox) {
			disableCheckbox.checked = shouldDisableFirstSquare;
		}
		if (cardObject.station) {
			cardObject.station.disableFirstAbility = shouldDisableFirstSquare;
		}

		if (shouldDisableFirstSquare && !hasPreText && cardObject.station?.importSettings?.singleAbility) {
			const versionOverrides = cardObject.station.importSettings.versionOverrides || {};
			const versionSettings = versionOverrides[cardObject.version] || cardObject.station.importSettings.singleAbility;

			const yOffsetInput = document.querySelector('#station-square-y');
			if (yOffsetInput) {
				yOffsetInput.value = versionSettings.yOffset;
				if (cardObject.station.squares && cardObject.station.squares[1]) {
					cardObject.station.squares[1].y = versionSettings.yOffset + 76;
				}
			}

			const height1Input = document.querySelector('#station-square-height-1');
			if (height1Input) {
				height1Input.value = versionSettings.height1;
				if (cardObject.station.squares && cardObject.station.squares[1]) {
					cardObject.station.squares[1].height = versionSettings.height1;
				}
			}
		}

		['#station-badge-value-1', '#station-badge-value-2'].forEach(selector => {
			const input = document.querySelector(selector);
			if (input) input.value = '';
		});

		badges.forEach((badge, i) => {
			if (badge) {
				const input = document.querySelector(`#station-badge-value-${i + 1}`);
				if (input) input.value = badge;
				if (cardObject.station?.badgeValues) cardObject.station.badgeValues[i + 1] = badge;
			}
		});

		setTimeout(() => {
			if (typeof stationEdited === 'function') {
				stationEdited();
			}
		}, 50);
	}, 100);
}

function applyImportedStationCard(cardToImport, cardObject, textPrefix) {
	clearImportedStationFields(cardObject);
	const stationData = parseStationCard(cardToImport.oracle_text);
	applyImportedStationBasicFields(cardToImport, cardObject, textPrefix);

	if (stationData) {
		const stationPlacement = buildStationPlacementData(stationData);
		if (stationPlacement) {
			applyImportedStationAbilityFields(cardObject, stationPlacement, textPrefix);
			scheduleImportedStationSettings(cardObject, stationPlacement);
		}
	}

	textEdited();
}

function applyImportedCardFollowUps(cardToImport, cardObject, baseTextPrefix, textIndex) {
	const standardTextPrefix = getImportedStandardTextPrefix(cardToImport.lang, baseTextPrefix);
	applyImportedStandardText(cardToImport, cardObject, standardTextPrefix, textIndex);
	applyImportedCollectorInfo(cardToImport);
	applyImportedCardMedia(cardToImport);
}
function applyImportedLayoutSpecificCard(cardToImport, cardObject, textPrefix) {
	if (isImportedMultiFacedLayout(cardToImport.layout, cardObject.version)) {
		return applyImportedMultiFacedCard(cardToImport, cardObject, textPrefix);
	}

	if (isImportedUniqueLayout(cardToImport.layout, cardObject.version)) {
		applyImportedUniqueLayoutCard(cardToImport, cardObject, textPrefix);
		return true;
	}

	if (shouldApplyImportedStationLayout(cardToImport, cardObject)) {
		applyImportedStationCard(cardToImport, cardObject, textPrefix);
	}

	return true;
}
function applyImportedCardWithFollowUps(cardToImport, cardObject, textPrefix, textIndex) {
	if (!applyImportedLayoutSpecificCard(cardToImport, cardObject, textPrefix)) {
		return false;
	}

	applyImportedCardFollowUps(cardToImport, cardObject, textPrefix, textIndex);
	return true;
}
function getSelectedImportedCard() {
	return scryfallCard[document.querySelector('#import-index').value];
}
function logImportedCardSelection(cardToImport, cardObject) {
	console.log('Card layout:', cardToImport.layout);
	console.log('Card version:', cardObject.version);
}
function applySelectedImportedCard(cardToImport, cardObject, textIndex) {
	prepareImportedCardTextFields(cardToImport, cardObject);
	var langFontCode = getImportedBaseTextPrefix(cardToImport.lang);
	return applyImportedCardWithFollowUps(cardToImport, cardObject, langFontCode, textIndex);
}
function shouldInitializeImportedTemplate(cardObject, retryCount) {
	return (!cardObject?.version || cardObject.version === '') && retryCount === 0;
}
function initializeImportedTemplateFrameControls() {
	const firstFrameOption = document.querySelector('#frame-picker')?.children?.[0];
	if (firstFrameOption) {
		console.warn('[mtgch-import] changeCardIndex selecting default frame option');
		firstFrameOption.click();
	}
	const loadFrameVersionButton = document.querySelector('#loadFrameVersion');
	if (loadFrameVersionButton) {
		console.warn('[mtgch-import] changeCardIndex forcing frame version initialization');
		loadFrameVersionButton.click();
	}
}
function scheduleImportedTemplateRetry(cardToImport, cardObject, retryCount, retryCallback) {
	console.warn('[mtgch-import] changeCardIndex waiting for template initialization', {
		retryCount,
		cardVersion: cardObject?.version,
		cardState: cardObject,
		cardToImport,
	});
	setTimeout(() => retryCallback(retryCount + 1), 100);
}
function notifyImportedTemplateAbort(cardToImport, cardObject) {
	console.error('[mtgch-import] changeCardIndex aborted: card.text is missing after retries', {
		cardVersion: cardObject?.version,
		cardState: cardObject,
		cardToImport,
	});
}
function waitForImportedTemplateReady(cardToImport, cardObject, retryCount, retryCallback) {
	if (cardObject?.text) {
		return true;
	}

	if (shouldInitializeImportedTemplate(cardObject, retryCount)) {
		initializeImportedTemplateFrameControls();
	}
	if (retryCount < 30) {
		scheduleImportedTemplateRetry(cardToImport, cardObject, retryCount, retryCallback);
		return false;
	}
	notifyImportedTemplateAbort(cardToImport, cardObject);
	return false;
}

function changeCardIndex(retryCount = 0) {
	let cardToImport = getSelectedImportedCard();
	logImportedCardSelection(cardToImport, card);
	if (!waitForImportedTemplateReady(cardToImport, card, retryCount, changeCardIndex)) {
		return;
	}

	applySelectedImportedCard(cardToImport, card, selectedTextIndex);
}
function ensureSavedCardKeys(cardKeys) {
	if (!cardKeys) {
		cardKeys = [];
		cardKeys.sort();
		storeSavedCardKeys(cardKeys);
	}
	return cardKeys;
}
function renderLoadCardOptions(cardKeys) {
	var loadCardOptions = document.querySelector('#load-card-options');
	loadCardOptions.innerHTML = '<option selected="selected" disabled>None selected</option>';
	cardKeys.forEach(item => {
		loadCardOptions.appendChild(createSelectOption(item));
	});
}
function loadAvailableCards(cardKeys = getSavedCardKeys()) {
	renderLoadCardOptions(ensureSavedCardKeys(cardKeys));
}
function getImportSearchOptions() {
	return buildImportSearchOptions(
		document.querySelector('#importAllPrints').checked,
		document.querySelector("#datasource").value,
		document.querySelector("#import-name").value
	);
}
function getImportedCardDataFetcher(datasource) {
	if (datasource === "local") {
		return fetchLocalData;
	}
	if (datasource === "mtgch") {
		return fetchMtgchData;
	}
	return fetchScryfallData;
}
function fetchImportedCardData(importOptions) {
	getImportedCardDataFetcher(importOptions.datasource)(
		importOptions.cardName,
		importCard,
		getImportedCardFetchUnique(importOptions)
	);
}
function importChanged() {
	fetchImportedCardData(getImportSearchOptions());
}
function getRequestedSavedCardKey(saveFromFile) {
	if (saveFromFile) {
		return saveFromFile.key;
	}

	var cardKey = getCardName();
	cardKey = prompt('Enter the name you would like to save your card under:', cardKey);
	if (!cardKey) {return null;}
	return cardKey;
}
function resolveSavedCardKey(cardKey, cardKeys) {
	cardKey = cardKey.trim();
	if (cardKeys.includes(cardKey)) {
		if (!confirm('Would you like to overwrite your card previously saved as "' + cardKey + '"?\n(Clicking "cancel" will affix a version number)')) {
			cardKey = getVersionedSavedCardKey(cardKey, cardKeys);
		}
	}
	return cardKey;
}
function getSavedCardData(saveFromFile) {
	if (saveFromFile) {
		return saveFromFile.data;
	}

	return cloneCardForStorage();
}
function resolveSavedCardRequest(saveFromFile, cardKeys) {
	var cardKey = getRequestedSavedCardKey(saveFromFile);
	if (!saveFromFile && !cardKey) {
		return null;
	}
	return {
		cardKey: resolveSavedCardKey(cardKey, cardKeys),
		cardData: getSavedCardData(saveFromFile)
	};
}
function refreshSavedCardKeys(cardKey, cardKeys) {
	if (addSavedCardKey(cardKey, cardKeys)) {
		storeSavedCardKeys(cardKeys);
		loadAvailableCards(cardKeys);
	}
}
function storeSavedCard(cardKey, cardToSave, cardKeys) {
	try {
		localStorage.setItem(cardKey, JSON.stringify(cardToSave));
		refreshSavedCardKeys(cardKey, cardKeys);
	} catch (error) {
		notify('You have exceeded your 5MB of local storage, and your card has failed to save. If you would like to continue saving cards, please download all saved cards, then delete all saved cards to free up space.<br><br>Local storage is most often exceeded by uploading large images directly from your computer. If possible/convenient, using a URL avoids the need to save these large images.<br><br>Apologies for the inconvenience.');
	}
}
function saveCard(saveFromFile) {
	var cardKeys = getSavedCardKeys() || [];
	const saveRequest = resolveSavedCardRequest(saveFromFile, cardKeys);
	if (!saveRequest) {return null;}
	storeSavedCard(saveRequest.cardKey, saveRequest.cardData, cardKeys);
}
function clearLoadedCardFrames() {
	document.querySelector('#frame-list').innerHTML = null;
}
function loadSavedCardData(selectedCardKey) {
	return JSON.parse(localStorage.getItem(selectedCardKey));
}
function readSavedCard(selectedCardKey) {
	card = {};
	card = loadSavedCardData(selectedCardKey);
	return card;
}
function restoreLoadedCardInfoFields() {
	document.querySelector('#info-number').value = card.infoNumber;
	document.querySelector('#info-rarity').value = card.infoRarity;
	document.querySelector('#info-set').value = card.infoSet;
	document.querySelector('#info-language').value = card.infoLanguage;
	document.querySelector('#info-note').value = card.infoNote;
	document.querySelector('#info-year').value = card.infoYear || date.getFullYear();
	artistEdited(card.infoArtist);
	restoreLoadedCardTextControls();
}
function restoreLoadedCardTextControls() {
	var selectedTextField = getSelectedTextField(card.text, selectedTextIndex);
	document.querySelector('#text-editor').value = selectedTextField.text;
	document.querySelector('#text-editor-font-size').value = selectedTextField.fontSize || 0;
	loadTextOptions(card.text);
}
function getLoadedCardOffsetPosition(x, y) {
	return {
		x: scaleX(x) - scaleWidth(card.marginX),
		y: scaleY(y) - scaleHeight(card.marginY)
	};
}
function restoreLoadedCardArtControls() {
	var position = getLoadedCardOffsetPosition(card.artX, card.artY);
	document.querySelector('#art-x').value = position.x;
	document.querySelector('#art-y').value = position.y;
	document.querySelector('#art-zoom').value = card.artZoom * 100;
	document.querySelector('#art-rotate').value = card.artRotate || 0;
	uploadArt(card.artSource);
}
function restoreLoadedCardSetSymbolControls() {
	var position = getLoadedCardOffsetPosition(card.setSymbolX, card.setSymbolY);
	document.querySelector('#setSymbol-x').value = position.x;
	document.querySelector('#setSymbol-y').value = position.y;
	document.querySelector('#setSymbol-zoom').value = card.setSymbolZoom * 100;
	uploadSetSymbol(card.setSymbolSource);
}
function restoreLoadedCardWatermarkControls() {
	var position = getLoadedCardOffsetPosition(card.watermarkX, card.watermarkY);
	document.querySelector('#watermark-x').value = position.x;
	document.querySelector('#watermark-y').value = position.y;
	document.querySelector('#watermark-zoom').value = card.watermarkZoom * 100;
	// document.querySelector('#watermark-left').value = card.watermarkLeft;
	// document.querySelector('#watermark-right').value = card.watermarkRight;
	document.querySelector('#watermark-opacity').value = card.watermarkOpacity * 100;
	document.getElementById("rounded-corners").checked = !card.noCorners;
	uploadWatermark(card.watermarkSource);
}
function restoreLoadedCardSerialControls() {
	document.querySelector('#serial-number').value = card.serialNumber;
	document.querySelector('#serial-total').value = card.serialTotal;
	document.querySelector('#serial-x').value = card.serialX;
	document.querySelector('#serial-y').value = card.serialY;
	document.querySelector('#serial-scale').value = card.serialScale;
	serialInfoEdited();
}
function forEachLoadedCardFrameInRestoreOrder(callback) {
	card.frames.reverse();
	card.frames.forEach(callback);
	card.frames.reverse();
}
function restoreLoadedCardFrames() {
	forEachLoadedCardFrameInRestoreOrder(item => addFrame([], item));
	return Promise.resolve();
}
function loadSavedCardOnloadScript() {
	if (card.onload) {
		return loadScript(card.onload);
	}
	return null;
}
function loadSavedCardManaSymbolScripts() {
	card.manaSymbols.forEach(item => loadScript(item));
}
function loadSavedCardScripts() {
	var onloadScript = loadSavedCardOnloadScript();
	if (card.onload) {
		return Promise.resolve(onloadScript).then(() => loadSavedCardManaSymbolScripts());
	}
	loadSavedCardManaSymbolScripts();
	return Promise.resolve();
}
function getLoadedCardCanvasSize() {
	return {
		width: card.width * (1 + card.marginX),
		height: card.height * (1 + card.marginY)
	};
}
function shouldResizeLoadedCanvas(name) {
	var canvasSize = getLoadedCardCanvasSize();
	var canvas = window[name + 'Canvas'];
	return canvas.width != canvasSize.width || canvas.height != canvasSize.height;
}
function resizeLoadedCardCanvases() {
	var canvasesResized = false;
	canvasList.forEach(name => {
		if (shouldResizeLoadedCanvas(name)) {
			sizeCanvas(name);
			canvasesResized = true;
		}
	});
	return canvasesResized;
}
function redrawLoadedCardAfterResize() {
	drawTextBuffer();
	drawFrames();
	bottomInfoEdited();
	watermarkEdited();
}
function redrawLoadedCardIfCanvasResized() {
	if (resizeLoadedCardCanvases()) {
		redrawLoadedCardAfterResize();
		return true;
	}
	return false;
}
function getLoadedCardControlRestorers() {
	return [
		restoreLoadedCardInfoFields,
		restoreLoadedCardArtControls,
		restoreLoadedCardSetSymbolControls,
		restoreLoadedCardWatermarkControls,
		restoreLoadedCardSerialControls
	];
}
function restoreLoadedCardControls() {
	getLoadedCardControlRestorers().forEach(restoreControls => restoreControls());
}
async function applyLoadedCardEffects() {
	await restoreLoadedCardFrames();
	await loadSavedCardScripts();
	//canvases
	redrawLoadedCardIfCanvasResized();
}
function prepareLoadedSavedCard(selectedCardKey) {
	clearLoadedCardFrames();
	return readSavedCard(selectedCardKey);
}
function restoreLoadedSavedCard() {
	restoreLoadedCardControls();
	return applyLoadedCardEffects();
}
function notifySavedCardLoadFailure(selectedCardKey) {
	notify(selectedCardKey + ' failed to load.', 5)
}
async function loadCard(selectedCardKey) {
	prepareLoadedSavedCard(selectedCardKey);
	if (card) {
		await restoreLoadedSavedCard();
	} else {
		notifySavedCardLoadFailure(selectedCardKey);
	}
}
function removeCardKeyFromSavedList(keyToDelete, cardKeys) {
	cardKeys.splice(cardKeys.indexOf(keyToDelete), 1);
	cardKeys.sort();
	return cardKeys;
}
function removeSavedCard(keyToDelete, cardKeys) {
	removeCardKeyFromSavedList(keyToDelete, cardKeys);
	storeSavedCardKeys(cardKeys);
	localStorage.removeItem(keyToDelete);
	loadAvailableCards(cardKeys);
}
function removeAllSavedCardStorageEntries(cardKeys) {
	cardKeys.forEach(key => localStorage.removeItem(key));
}
function clearSavedCards(cardKeys) {
	removeAllSavedCardStorageEntries(cardKeys);
	storeSavedCardKeys([]);
	loadAvailableCards([]);
}
function deleteSavedCards() {
	if (confirm('WARNING:\n\nALL of your saved cards will be deleted! If you would like to save these cards, please make sure you have downloaded them first. There is no way to undo this.\n\n(Press "OK" to delete your cards)')) {
		var cardKeys = getSavedCardKeys();
		clearSavedCards(cardKeys);
	}
}
function deleteCard() {
	var keyToDelete = document.querySelector('#load-card-options').value;
	if (keyToDelete) {
		removeSavedCard(keyToDelete, getSavedCardKeys());
	}
}
function getSavedCardsExportData(cardKeys) {
	return cardKeys.map(item => ({key:item, data:JSON.parse(localStorage.getItem(item))}));
}
function createSavedCardsDownloadUrl(savedCards) {
	return URL.createObjectURL(new Blob([createSavedCardsExportText(savedCards)], {type:'text'}));
}
function downloadSavedCardsExport(cardKeys) {
	var allSavedCards = getSavedCardsExportData(cardKeys);
	return triggerDownloadLink(createSavedCardsDownloadUrl(allSavedCards), 'saved-cards.cardconjurer');
}
async function downloadSavedCards() {
	var cardKeys = getSavedCardKeys();
	if (cardKeys) {
		await downloadSavedCardsExport(cardKeys);
	}
}
function importSavedCardItems(savedCards) {
	savedCards.forEach(item => saveCard(item));
}
function importSavedCardsFromText(savedCardsText) {
	importSavedCardItems(parseSavedCardsImport(savedCardsText));
}
function uploadSavedCards(event) {
	var reader = new FileReader();
	reader.onload = function () {
		importSavedCardsFromText(reader.result);
	}
	reader.readAsText(event.target.files[0]);
}
//TUTORIAL TAB
function loadTutorialVideo() {
	var video = document.querySelector('.video > iframe');
	if (video.src == '') {
		video.src = 'https://player.bilibili.com/player.html?isOutside=true&aid=113906324346763&bvid=BV1mZFsegE2p&cid=28127986929&p=1&autoplay=0';
	}
}
// GUIDELINES
function drawGuidelineTextBounds() {
	guidelinesContext.fillStyle = 'blue';
	Object.entries(card.text).forEach(item => {
		guidelinesContext.fillRect(scaleX(item[1].x || 0), scaleY(item[1].y || 0), scaleWidth(item[1].width || 1), scaleHeight(item[1].height || 1));
	});
}
function drawGuidelineArtBounds() {
	guidelinesContext.fillStyle = 'green';
	guidelinesContext.fillRect(scaleX(card.artBounds.x), scaleY(card.artBounds.y), scaleWidth(card.artBounds.width), scaleHeight(card.artBounds.height));
}
function drawGuidelineWatermarkBounds() {
	guidelinesContext.fillStyle = 'yellow';
	var watermarkWidth = scaleWidth(card.watermarkBounds.width);
	var watermarkHeight = scaleHeight(card.watermarkBounds.height);
	guidelinesContext.fillRect(scaleX(card.watermarkBounds.x) - watermarkWidth / 2, scaleY(card.watermarkBounds.y) - watermarkHeight / 2, watermarkWidth, watermarkHeight);
}
function drawGuidelineSetSymbolBounds() {
	var setSymbolX = scaleX(card.setSymbolBounds.x);
	var setSymbolY = scaleY(card.setSymbolBounds.y);
	var setSymbolWidth = scaleWidth(card.setSymbolBounds.width);
	var setSymbolHeight = scaleHeight(card.setSymbolBounds.height);
	if (card.setSymbolBounds.vertical == 'center') {
		setSymbolY -= setSymbolHeight / 2;
	} else if (card.setSymbolBounds.vertical == 'bottom') {
		setSymbolY -= setSymbolHeight;
	}
	if (card.setSymbolBounds.horizontal == 'center') {
		setSymbolX -= setSymbolWidth / 2;
	} else if (card.setSymbolBounds.horizontal == 'right') {
		setSymbolX -= setSymbolWidth;
	}
	guidelinesContext.fillStyle = 'red';
	guidelinesContext.fillRect(setSymbolX, setSymbolY, setSymbolWidth, setSymbolHeight);
}
function drawGuidelineGrid() {
	guidelinesContext.globalAlpha = 1;
	guidelinesContext.beginPath();
	guidelinesContext.strokeStyle = 'gray';
	guidelinesContext.lineWidth = 1;
	const boxPadding = 25;
	for (var x = 0; x <= card.width; x += boxPadding) {
		guidelinesContext.moveTo(x, 0);
		guidelinesContext.lineTo(x, card.height);
	}
	for (var y = 0; y <= card.height; y += boxPadding) {
		guidelinesContext.moveTo(0, y);
		guidelinesContext.lineTo(card.width, y);
	}
	guidelinesContext.stroke();
}
function drawGuidelineCenterLines() {
	guidelinesContext.beginPath();
	guidelinesContext.strokeStyle = 'black';
	guidelinesContext.lineWidth = 3;
	guidelinesContext.moveTo(card.width / 2, 0);
	guidelinesContext.lineTo(card.width / 2, card.height);
	guidelinesContext.moveTo(0, card.height / 2);
	guidelinesContext.lineTo(card.width, card.height / 2);
	guidelinesContext.stroke();
}
function drawNewGuidelines() {
	// clear
	guidelinesContext.clearRect(0, 0, guidelinesCanvas.width, guidelinesCanvas.height);
	// set opacity
	guidelinesContext.globalAlpha = 0.25;
	// textboxes
	drawGuidelineTextBounds();
	// art
	drawGuidelineArtBounds();
	// watermark
	drawGuidelineWatermarkBounds();
	// set symbol
	drawGuidelineSetSymbolBounds();
	// grid
	drawGuidelineGrid();
	//center lines
	drawGuidelineCenterLines();
	//draw to card
	drawCard();
}
//HIGHLIGHT TRANSPARENCIES
function toggleCardBackgroundColor(highlight) {
	if (highlight) {
		previewCanvas.style["background-color"] = "#ff007fff";
	} else {
		previewCanvas.style["background-color"] = "#0000";
	}
}
//Rounded Corners
function setRoundedCorners(value) {
	card.noCorners = !value;
	drawCard();
}
//Various loaders
function resolveImageUrl(url) {
	var imageurl = url;
	// If an image URL does not have HTTP in it, assume it's a local file in the repo local_art directory.
	if (!url.includes('http')) {
		imageurl = '/local_art/' + url;
	} else if (params.get('noproxy') != '') {
		//CORS PROXY LINKS
		//Previously: https://cors.bridged.cc/
		imageurl = 'https://corsproxy.io/?url=' + encodeURIComponent(url);
	}
	return imageurl;
}
function imageURL(url, destination, otherParams) {
	destination(resolveImageUrl(url), otherParams);
}
function createLocalImageReader(destination, otherParams) {
	var reader = new FileReader();
	reader.onload = function () {
		destination(reader.result, otherParams);
	}
	reader.onerror = function () {
		destination('/img/blank.png', otherParams);
	}
	return reader;
}
async function imageLocal(event, destination, otherParams) {
	var reader = createLocalImageReader(destination, otherParams);
	await reader.readAsDataURL(event.target.files[0]);
}
function notifyScriptLoadFailure(reject) {
	notify('A script failed to load, likely due to an update. Please reload your page. Sorry for the inconvenience.');
	reject();
}
function createScriptElement(scriptPath, resolve, reject) {
	var script = document.createElement('script');
	script.setAttribute('type', 'text/javascript');
	script.onload = resolve;
	script.onerror = function(){
		notifyScriptLoadFailure(reject);
	}
	script.setAttribute('src', scriptPath);
	return script;
}
function appendScriptElement(script) {
	document.querySelectorAll('head')[0].appendChild(script);
}
function loadScript(scriptPath) {
	return new Promise((resolve, reject) => {
		appendScriptElement(createScriptElement(scriptPath, resolve, reject));
	});
}
// Stretchable SVGs
function stretchSVG(frameObject) {
	const xhr = new XMLHttpRequest();
	xhr.open('GET', fixUri(frameObject.src), true);
	xhr.overrideMimeType('image/svg+xml');
	xhr.onload = function(e) {
		if (this.readyState == 4 && this.status == 200) {
			frameObject.image.src = 'data:image/svg+xml;charset=utf-8,' + stretchSVGReal((new XMLSerializer).serializeToString(this.responseXML.documentElement), frameObject);
		}
	}
	xhr.send();
}
function stretchSVGReal(data, frameObject) {
	var returnData = data;
	frameObject.stretch.forEach(stretch => {
		const change = stretch.change;
		const targets = stretch.targets;
		const name = stretch.name;
		const oldData = returnData.split(name + '" d="')[1].split('" style=')[0];
		var newData = '';
		const listData = oldData.split(/(?=[clmz])/gi);
		for (let i = 0; i < listData.length; i ++) {
			const item = listData[i];
			if (targets.includes(i) || targets.includes(-i)) {
				let sign = 1;
				if (i != 0 && targets.includes(-i)) {sign = -1};
				if (item[0] == 'C' || item[0] == 'c') {
					const newCoords = [];
					item.slice(1).split(' ').forEach(pair => {
						const coords = pair.split(',');
						newCoords.push((scaleWidth(change[0]) * sign + parseFloat(coords[0])) + ',' + (scaleHeight(change[1]) * sign + parseFloat(coords[1])));
					});
					newData += item[0] + newCoords.join(' ');
				} else {
					const coords = item.slice(1).split(/[, ]/);
					newData += item[0] + (scaleWidth(change[0]) * sign + parseFloat(coords[0])) + ',' + (scaleHeight(change[1]) * sign + parseFloat(coords[1]))
				}
			} else {
				newData += item;
			}
		}
		returnData = returnData.replace(oldData, newData);
	});
	return returnData;
}

function applyPrintedScryfallFields(cardLike, sourceCard = cardLike) {
	if (sourceCard.lang != 'en' || cardLike.printed_name) {
		cardLike.oracle_text = cardLike.printed_text || cardLike.oracle_text;
		cardLike.name = cardLike.printed_name || cardLike.name;
		cardLike.type_line = cardLike.printed_type_line || cardLike.type_line;
	}
}
function applyParentScryfallFaceFields(face, card) {
	face.set = card.set;
	face.rarity = card.rarity;
	face.collector_number = card.collector_number;
	face.lang = card.lang;
	face.layout = card.layout; // Add layout from parent card
	if(card.lang == "zhs") {
		face.lang = "cs";
	}
}
function appendScryfallFace(face, card, responseCards) {
	applyParentScryfallFaceFields(face, card);
	applyPrintedScryfallFields(face, card);
	responseCards.push(face);
	if (!face.image_uris) {
		face.image_uris = card.image_uris;
	}
}
function appendSingleScryfallCard(card, responseCards) {
	applyPrintedScryfallFields(card);
	// Ensure layout is set even for single-faced cards
	if (!card.layout) {
		card.layout = 'normal';
	}
	responseCards.push(card);
}
function processScryfallCard(card, responseCards) {
	if ('card_faces' in card) {
		card.card_faces.forEach(face => {
			appendScryfallFace(face, card, responseCards);
		});
	} else {
		appendSingleScryfallCard(card, responseCards);
	}
}
function buildScryfallCardsFromImportedCards(cards) {
	responseCards = [];
	importedCards = cards;
	importedCards.forEach(card => {
		processScryfallCard(card, responseCards);
	});
	return responseCards;
}
function parseScryfallCardResponse(responseText) {
	return buildScryfallCardsFromImportedCards([JSON.parse(responseText)]);
}
function sendScryfallRequest(url, onreadystatechange) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = onreadystatechange;
	xhttp.open('GET', url, true);
	try {
		xhttp.send();
	} catch {
		console.log('Scryfall API search failed.')
	}
}

function fetchScryfallCardByID(scryfallID, callback = console.log) {
	sendScryfallRequest('https://api.scryfall.com/cards/' + scryfallID, function() {
		if (this.readyState == 4 && this.status == 200) {
			callback(parseScryfallCardResponse(this.responseText));
		} else if (this.readyState == 4 && this.status == 404 && !unique && cardName != '') {
			notify(`No card found for "${cardName}" in ${cardLanguageSelect.options[cardLanguageSelect.selectedIndex].text}.`, 5);
		}
	});
}

function fetchScryfallCardByCodeNumber(code, number, callback = console.log) {
	sendScryfallRequest('https://api.scryfall.com/cards/' + code + '/' + number, function() {
		if (this.readyState == 4 && this.status == 200) {
			callback(parseScryfallCardResponse(this.responseText));
		} else if (this.readyState == 4 && this.status == 404 && !unique && cardName != '') {
			notify('No card found for ' + code + ' #' + number, 5);
		}
	});
}
let db = null;
let dbPromise = null;
let sqlJsLoaderPromise = null;
const sqlJsBaseUrl = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2';
const localCardDatabasePath = 'data/zhs.sqlite';

function getExternalScriptPromiseRegistry() {
	if (!window.externalScriptPromises) {
		window.externalScriptPromises = new Map();
	}

	return window.externalScriptPromises;
}

function getOrCreateExternalScript(scriptPath) {
	const existingScript = document.querySelector(`script[src="${scriptPath}"]`);
	if (existingScript) {
		return { script: existingScript, isNew: false };
	}

	const script = document.createElement('script');
	script.defer = true;
	script.src = scriptPath;

	return { script, isNew: true };
}

function loadExternalScriptOnce(scriptPath) {
	const scriptPromises = getExternalScriptPromiseRegistry();
	const existingPromise = scriptPromises.get(scriptPath);
	if (existingPromise) {
		return existingPromise;
	}

	const promise = new Promise((resolve, reject) => {
		const { script, isNew } = getOrCreateExternalScript(scriptPath);

		if (!isNew && script.dataset.loaded === 'true') {
			resolve(script);
			return;
		}

		script.onload = () => {
			script.dataset.loaded = 'true';
			resolve(script);
		};
		script.onerror = () => {
			scriptPromises.delete(scriptPath);
			reject(new Error(`Failed to load script: ${scriptPath}`));
		};

		if (isNew) {
			document.head.appendChild(script);
		}
	});

	scriptPromises.set(scriptPath, promise);
	return promise;
}

function locateSqlJsFile(file) {
	return `${sqlJsBaseUrl}/${file}`;
}

function fetchLocalCardDatabaseBuffer() {
	return fetch(localCardDatabasePath).then(res => res.arrayBuffer());
}

async function loadSqlJs() {
	if (typeof initSqlJs === 'undefined') {
		sqlJsLoaderPromise = loadExternalScriptOnce(`${sqlJsBaseUrl}/sql-wasm.js`);
		await sqlJsLoaderPromise;
	}

	return initSqlJs({ locateFile: locateSqlJsFile });
}

async function loadDatabase() {
	if (!dbPromise) {
		dbPromise = Promise.all([
			loadSqlJs(),
			fetchLocalCardDatabaseBuffer()
		]).then(([SQL, response]) => new SQL.Database(new Uint8Array(response))).catch(error => {
			dbPromise = null;
			throw error;
		});
	}

	return dbPromise;
}
function buildLocalCardSearchQuery(cardName) {
	return "SELECT zhs.*, cards.manaCost FROM zhs JOIN cards ON zhs.uuid = cards.uuid WHERE zhs.name LIKE '%" + cardName + "%'";
}
function localCardRowToObject(itemArray) {
	// 将一维数组转换为对象
	return {
		object: 'card',
		id: itemArray[0],
		number: itemArray[1],
		name: itemArray[2],
		face_name: itemArray[3],
		flavorName: itemArray[4],
		type_line: itemArray[5],
		oracle_text: itemArray[6].replace(/\\n/g, '\n'),
		flavor_text: itemArray[7].replace(/\\n/g, '\n'),
		mana_cost: itemArray[10],
		lang: 'cs',
	};
}
function mapLocalCardSearchResults(res) {
	const json_res = JSON.stringify(res);
	const json_obj = JSON.parse(json_res)[0].values;
	return json_obj.map(localCardRowToObject);
}

async function fetchLocalData(cardName, callback = console.log, isDatabaseEnabled) {
	if (!isDatabaseEnabled) {
		fetchScryfallData(cardName, callback, '');
	} else {
		if(cardName == '' || cardName == null) {
			return;
		}

		if(db == null) {
			db = await loadDatabase();
		}
		let sql_str = buildLocalCardSearchQuery(cardName);
		const res = db.exec(sql_str);
		const processedArray = mapLocalCardSearchResults(res);
		callback(processedArray);
	}
}
function getValidString(...values) {
	return values.find(value => value?.trim?.() !== "" && value !== null) ?? "";
}

function containsCJKText(text = '') {
	return /[\u3400-\u9fff\uf900-\ufaff]/.test(text);
}

function decodeHtmlEntities(text = '') {
	const textarea = document.createElement('textarea');
	textarea.innerHTML = text;
	return textarea.value;
}

function htmlToCardText(html = '') {
	if (!html) return '';
	let text = decodeHtmlEntities(html);
	text = text.replace(/<i class=["']sr-only["']>(.*?)<\/i>/gi, '$1');
	text = text.replace(/<i\b[^>]*>/gi, '');
	text = text.replace(/<\/i>/gi, '');
	text = text.replace(/<\/p>\s*<p>/gi, '\n');
	text = text.replace(/<br\s*\/?>/gi, '\n');
	text = text.replace(/<\/p>/gi, '');
	text = text.replace(/<p>/gi, '');
	text = text.replace(/<[^>]+>/g, '');
	return text.trim();
}

function fetchJsonRequest(url) {
	return new Promise((resolve, reject) => {
		const xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if (this.readyState !== 4) return;
			if (this.status === 200) {
				resolve(JSON.parse(this.responseText));
			} else {
				reject(new Error(`Request failed: ${url}`));
			}
		};
		xhttp.open('GET', url, true);
		xhttp.send();
	});
}
async function fetchScryfallCard(setCode, collectorNumber) {
	const url = buildScryfallCardUrl(setCode, collectorNumber);
	if (!url) return null;
	console.log('[mtgch-import] fetch Scryfall card', { setCode, collectorNumber, url });
	return fetchJsonRequest(url);
}
async function fetchMtgchCardById(cardId) {
	const url = buildMtgchCardDetailUrl(cardId);
	if (!url) return null;
	console.log('[mtgch-import] fetch mtgch card detail', { cardId, url });
	return fetchJsonRequest(url);
}
async function fetchMtgchVersions(cardId) {
	const url = buildMtgchVersionsUrl(cardId);
	if (!url) return [];
	console.log('[mtgch-import] fetch mtgch versions', { cardId, url });
	return fetchJsonRequest(url);
}
function getMtgchSearchCards(result) {
	return result.items || result.results || result.data || result.cards || [];
}
async function fetchMtgchSearchCards(cardName, isUnique) {
	const url = buildMtgchSearchUrl(cardName, isUnique);
	const result = await fetchJsonRequest(url);
	return getMtgchSearchCards(result);
}
function logMtgchSearchResult(cardName, importedCards, selectedLanguage, isUnique) {
	console.log('[mtgch-import] mtgch search result', {
		cardName,
		count: Array.isArray(importedCards) ? importedCards.length : 0,
		selectedLanguage,
		isUnique,
	});
}
function hasMtgchImportedCards(importedCards) {
	return Array.isArray(importedCards) && importedCards.length > 0;
}
function notifyNoImportedCards(cardName, cardLanguageSelect) {
	notify(`No cards found for "${cardName}" in ${cardLanguageSelect.options[cardLanguageSelect.selectedIndex].text}.`, 5);
}
function prefersChineseImportLanguage(selectedLanguage) {
	return selectedLanguage === 'cs' || selectedLanguage === 'zhs';
}
function requiresEnglishScryfallName(cardName, selectedLanguage) {
	return selectedLanguage === 'en' && containsCJKText(cardName);
}
function notifyScryfallRequiresEnglishName(cardName) {
	notify(`Scryfall requires an English name for "${cardName}" when import language is English.`, 5);
}
function buildScryfallResponseCards(responseText) {
	return buildScryfallCardsFromImportedCards(JSON.parse(responseText).data);
}
async function resolveMtgchVersionCards(importedCards, cardName) {
	const representativeCards = importedCards.filter(card => card?.id);
	console.log('[mtgch-import] resolving mtgch all versions', {
		cardName,
		representativeCount: representativeCards.length,
		representatives: representativeCards.map(card => ({
			id: card.id,
			name: card.display_name || card.name || card.primary_name,
			set: card.set,
			collector_number: card.collector_number,
		})),
	});
	const versionGroups = await Promise.all(representativeCards.map(card => fetchMtgchVersions(card.id)));
	const versionIds = [...new Set(
		versionGroups
			.flat()
			.map(version => version?.id)
			.filter(Boolean)
	)];
	console.log('[mtgch-import] mtgch versions resolved', {
		cardName,
		count: versionIds.length,
		versionIds,
	});
	return (await Promise.all(versionIds.map(fetchMtgchCardById))).filter(Boolean);
}
function getBestMtgchImageUris(imageUris) {
	if (!imageUris) return null;
	const artCrop = getValidString(
		imageUris.art_crop,
		imageUris.large,
		imageUris.normal,
		imageUris.small
	);
	if (!artCrop) return null;
	return Object.assign({}, imageUris, { art_crop: artCrop });
}
function getScryfallFaceImageUris(scryfallCard, faceIndex = 0) {
	if (!scryfallCard) return null;
	if (Array.isArray(scryfallCard.card_faces) && scryfallCard.card_faces[faceIndex]?.image_uris) {
		const imageUris = getBestMtgchImageUris(scryfallCard.card_faces[faceIndex].image_uris);
		console.log('[mtgch-import] Scryfall face image match', { faceIndex, imageUris });
		return imageUris;
	}
	if (scryfallCard.image_uris) {
		const imageUris = getBestMtgchImageUris(scryfallCard.image_uris);
		console.log('[mtgch-import] Scryfall card image match', { faceIndex, imageUris });
		return imageUris;
	}
	console.log('[mtgch-import] Scryfall image missing', { faceIndex, layout: scryfallCard.layout, set: scryfallCard.set, collector_number: scryfallCard.collector_number });
	return null;
}
function assignMtgchPrimaryFallbackImage(card, scryfallCard) {
	const fallbackImageUris = getScryfallFaceImageUris(scryfallCard, card.face_index > -1 ? card.face_index : 0);
	if (fallbackImageUris) {
		card.image_uris = fallbackImageUris;
		console.log('[mtgch-import] assigned primary image', {
			name: card.name,
			set: card.set,
			collector_number: card.collector_number,
			art_crop: fallbackImageUris.art_crop,
		});
	} else {
		console.log('[mtgch-import] primary image missing after Scryfall lookup', {
			name: card.name,
			set: card.set,
			collector_number: card.collector_number,
		});
	}
}
function assignMtgchFaceFallbackImages(card, scryfallCard) {
	if (Array.isArray(card.card_faces) && Array.isArray(scryfallCard?.card_faces)) {
		card.card_faces = card.card_faces.map((face, index) => {
			if (getBestMtgchImageUris(face.image_uris)) {
				console.log('[mtgch-import] face already had image', { index, name: face.name });
				return face;
			}
			const fallbackFaceImageUris = getScryfallFaceImageUris(scryfallCard, index);
			if (!fallbackFaceImageUris) {
				console.log('[mtgch-import] face image missing after Scryfall lookup', { index, name: face.name });
				return face;
			}
			console.log('[mtgch-import] assigned face image', {
				index,
				name: face.name,
				art_crop: fallbackFaceImageUris.art_crop,
			});
			return Object.assign({}, face, {
				image_uris: fallbackFaceImageUris,
			});
		});
	}
}
function getMtgchFallbackImageStartLog(card) {
	return {
		name: card.name,
		set: card.set,
		collector_number: card.collector_number,
		layout: card.layout,
		face_index: card.face_index,
		has_card_faces: Array.isArray(card.card_faces),
	};
}
function getMtgchFallbackImageDoneLog(card) {
	return {
		name: card.name,
		has_primary_image: !!card.image_uris?.art_crop,
		card_faces: Array.isArray(card.card_faces) ? card.card_faces.map((face, index) => ({
			index,
			name: face.name,
			has_image: !!face.image_uris?.art_crop,
		})) : null,
	};
}
async function populateFallbackImageUris(card) {
	try {
		console.log('[mtgch-import] populateFallbackImageUris start', getMtgchFallbackImageStartLog(card));
		const scryfallCard = await fetchScryfallCard(card.set, card.collector_number);
		assignMtgchPrimaryFallbackImage(card, scryfallCard);
		assignMtgchFaceFallbackImages(card, scryfallCard);
		console.log('[mtgch-import] populateFallbackImageUris done', getMtgchFallbackImageDoneLog(card));
	} catch (error) {
		console.error(`[mtgch-import] Failed to fetch Scryfall image for ${card.set}/${card.collector_number}`, error);
	}
	return card;
}
function getMtgchTranslatedFields(normalizedSource) {
	return {
		name: getValidString(
			normalizedSource.zhs_name,
			normalizedSource.atomic_official_name,
			normalizedSource.atomic_translated_name,
			normalizedSource.full_translated_name,
			normalizedSource.full_official_name,
			normalizedSource.display_name,
			normalizedSource.primary_name
		),
		text: getValidString(
			normalizedSource.zhs_text,
			normalizedSource.atomic_translated_text,
			normalizedSource.printed_text,
			normalizedSource.oracle_text
		),
		type: getValidString(
			normalizedSource.zhs_type_line,
			normalizedSource.atomic_translated_type,
			normalizedSource.printed_type_line,
			normalizedSource.type_line
		),
		flavorText: getValidString(
			normalizedSource.zhs_flavor_text,
			normalizedSource.atomic_translated_flavor_text,
			normalizedSource.printed_flavor_text,
			normalizedSource.flavor_text
		),
		flavorName: getValidString(
			normalizedSource.zhs_flavor_name,
			normalizedSource.atomic_translated_flavor_name,
			normalizedSource.flavor_name
		),
	};
}
function cleanMtgchNormalizedText(normalized) {
	if (normalized.oracle_text && !normalized.oracle_text.includes("{CARDNAME}") && normalized.oracle_text.includes("CARDNAME")) {
		normalized.oracle_text = normalized.oracle_text.replaceAll("CARDNAME", "{CARDNAME}");
	}
	if (normalized.flavor_text) {
		normalized.flavor_text = normalized.flavor_text.replace(/\\n/g, "\n");
	}
	if (normalized.oracle_text) {
		normalized.oracle_text = normalized.oracle_text.replace(/\\n/g, "\n");
	}
	if (normalized.printed_text) {
		normalized.printed_text = normalized.printed_text.replace(/\\n/g, "\n");
	}
	if (normalized.toughness == null) delete normalized.toughness;
	if (normalized.power == null) delete normalized.power;
	return normalized;
}
function buildMtgchOtherFaceSource(face, index, cardDetail) {
	return {
		object: 'card_face',
		name: face.name,
		face_name: face.name,
		mana_cost: face.mana_cost || face.mana_cost_html,
		artist: face.artist,
		image_uris: face.image_uris,
		zhs_image_uris: face.zhs_image_uris,
		type_line: face.type_line_en,
		printed_type_line: face.type_line_zhs || face.type_line_atomic,
		oracle_text: htmlToCardText(face.oracle_text_en_html),
		printed_text: htmlToCardText(face.oracle_text_zhs_html || face.oracle_text_atomic_html),
		flavor_text: htmlToCardText(face.flavor_text_en_html),
		printed_flavor_text: htmlToCardText(face.flavor_text_zhs_html || face.flavor_text_atomic_html),
		flavor_name: face.flavor_name,
		zhs_name: face.name_zhs,
		atomic_official_name: face.name_atomic,
		atomic_translated_type: face.type_line_atomic,
		atomic_translated_text: face.oracle_text_atomic_html,
		atomic_translated_flavor_text: face.flavor_text_atomic_html,
		atomic_translated_flavor_name: face.flavor_name_zhs,
		face_index: index + 1,
		layout: cardDetail.layout || (cardDetail.is_dfc ? 'transform' : 'normal'),
		lang: 'en',
	};
}
function buildMtgchPrimarySource(cardDetail, primaryFace) {
	return Object.assign({}, cardDetail, {
		name: primaryFace.name || cardDetail.name,
		face_name: primaryFace.name || cardDetail.face_name,
		mana_cost: cardDetail.mana_cost || primaryFace.mana_cost || primaryFace.mana_cost_html,
		artist: cardDetail.artist || primaryFace.artist,
		image_uris: cardDetail.image_uris || primaryFace.image_uris,
		zhs_image_uris: cardDetail.zhs_image_uris || primaryFace.zhs_image_uris,
		type_line: cardDetail.type_line || primaryFace.type_line_en,
		printed_type_line: cardDetail.printed_type_line || primaryFace.type_line_zhs || primaryFace.type_line_atomic,
		oracle_text: cardDetail.oracle_text || htmlToCardText(primaryFace.oracle_text_en_html),
		printed_text: cardDetail.printed_text || htmlToCardText(primaryFace.oracle_text_zhs_html || primaryFace.oracle_text_atomic_html),
		flavor_text: cardDetail.flavor_text || htmlToCardText(primaryFace.flavor_text_en_html),
		printed_flavor_text: cardDetail.printed_flavor_text || htmlToCardText(primaryFace.flavor_text_zhs_html || primaryFace.flavor_text_atomic_html),
		flavor_name: cardDetail.flavor_name || primaryFace.flavor_name,
		zhs_name: cardDetail.zhs_name || primaryFace.name_zhs,
		atomic_official_name: cardDetail.atomic_official_name || primaryFace.name_atomic,
		atomic_translated_type: cardDetail.atomic_translated_type || primaryFace.type_line_atomic,
		atomic_translated_text: cardDetail.atomic_translated_text || primaryFace.oracle_text_atomic_html,
		atomic_translated_flavor_text: cardDetail.atomic_translated_flavor_text || primaryFace.flavor_text_atomic_html,
		atomic_translated_flavor_name: cardDetail.atomic_translated_flavor_name || primaryFace.flavor_name_zhs,
		object: cardDetail.object || 'card',
		layout: cardDetail.layout || (cardDetail.is_dfc ? 'transform' : 'normal'),
		lang: cardDetail.lang || 'en',
		other_faces: Array.isArray(cardDetail.faces) && cardDetail.faces.length > 1
			? cardDetail.faces.slice(1).map((face, index) => buildMtgchOtherFaceSource(face, index, cardDetail))
			: cardDetail.other_faces,
	});
}
function normalizeMtgchCard(cardDetail, preferChinese) {
	const primaryFace = Array.isArray(cardDetail.faces) ? cardDetail.faces[0] : null;
	const normalizedSource = primaryFace ? buildMtgchPrimarySource(cardDetail, primaryFace) : cardDetail;
	const {
		name: translatedName,
		text: translatedText,
		type: translatedType,
		flavorText: translatedFlavorText,
		flavorName: translatedFlavorName,
	} = getMtgchTranslatedFields(normalizedSource);
	const normalized = Object.assign({}, normalizedSource, {
		object: normalizedSource.object || 'card',
		en_name: getValidString(normalizedSource.en_name, normalizedSource.name, normalizedSource.officialName),
		name: preferChinese ? getValidString(translatedName, normalizedSource.name) : getValidString(normalizedSource.name, translatedName),
		printed_name: getValidString(translatedName, normalizedSource.printed_name),
		lang: preferChinese ? 'cs' : (normalizedSource.lang === 'zhs' ? 'cs' : (normalizedSource.lang || 'en')),
		oracle_text: preferChinese ? getValidString(translatedText, normalizedSource.oracle_text) : getValidString(normalizedSource.oracle_text, translatedText),
		printed_text: getValidString(translatedText, normalizedSource.printed_text),
		type_line: preferChinese ? getValidString(translatedType, normalizedSource.type_line) : getValidString(normalizedSource.type_line, translatedType),
		printed_type_line: getValidString(translatedType, normalizedSource.printed_type_line),
		mana_cost: getValidString(normalizedSource.manaCost, normalizedSource.mana_cost),
		flavor_text: preferChinese ? getValidString(translatedFlavorText, normalizedSource.flavor_text) : getValidString(normalizedSource.flavor_text, translatedFlavorText),
		flavor_name: getValidString(translatedFlavorName, normalizedSource.flavor_name),
		set: getValidString(normalizedSource.set, normalizedSource.setCode, normalizedSource.set_code).toLowerCase(),
		setCode: getValidString(normalizedSource.setCode, normalizedSource.set, normalizedSource.set_code).toLowerCase(),
		collector_number: getValidString(normalizedSource.collector_number, normalizedSource.number),
		number: getValidString(normalizedSource.number, normalizedSource.collector_number),
		illustration_id: getValidString(normalizedSource.illustration_id, normalizedSource.scryfallIllustrationId),
		image_uris: null,
		printed_image_uris: null,
	});
	if (Array.isArray(normalizedSource.other_faces) && normalizedSource.other_faces.length > 0) {
		normalized.card_faces = normalizedSource.other_faces.map(face => normalizeMtgchCard(Object.assign({}, normalizedSource, face, {
			image_uris: null,
			zhs_image_uris: face.zhs_image_uris || normalizedSource.zhs_image_uris,
			other_faces: [],
		}), preferChinese));
	}
	return cleanMtgchNormalizedText(normalized);
}
function buildMtgchResponseCards(importedCards, preferChinese) {
	return Promise.all(
		importedCards
			.map(card => normalizeMtgchCard(card, preferChinese))
			.filter(card => card.type_line)
			.map(populateFallbackImageUris)
	);
}

async function fetchMtgchData(cardName, callback = console.log, unique = '') {
	if (!cardName) return;
	const isUnique = unique === 'prints';
	cardLanguageSelect = document.querySelector('#import-language');
	const selectedLanguage = cardLanguageSelect?.value || 'en';
	const preferChinese = prefersChineseImportLanguage(selectedLanguage);

	try {
		let importedCards = await fetchMtgchSearchCards(cardName, isUnique);
		logMtgchSearchResult(cardName, importedCards, selectedLanguage, isUnique);
		if (!hasMtgchImportedCards(importedCards)) {
			notifyNoImportedCards(cardName, cardLanguageSelect);
			return;
		}
		if (isUnique) {
			importedCards = await resolveMtgchVersionCards(importedCards, cardName);
		}
		const responseCards = await buildMtgchResponseCards(importedCards, preferChinese);
		callback(responseCards);
	} catch (error) {
		console.error(error);
	}
}
//SCRYFALL STUFF MAY BE CHANGED IN THE FUTURE
function fetchScryfallData(cardName, callback = console.log, unique = '') {
	if (!cardName) return;
	cardLanguageSelect = document.querySelector('#import-language');
	var selectedLanguage = cardLanguageSelect.value;
	if (requiresEnglishScryfallName(cardName, selectedLanguage)) {
		if (!unique) {
			notifyScryfallRequiresEnglishName(cardName);
		}
		return;
	}
	console.log("cardName:" + cardName);
	var url = buildScryfallSearchUrl(cardName, selectedLanguage, unique);
	sendScryfallRequest(url, function() {
		if (this.readyState == 4 && this.status == 200) {
			callback(buildScryfallResponseCards(this.responseText));
		} else if (this.readyState == 4 && this.status == 404 && !unique && cardName != '') {
			notifyNoImportedCards(cardName, cardLanguageSelect);
		}
	});
}

function toggleTextTag(tag) {
	var element = document.getElementById('text-editor');

	var text = element.value;

	var start = element.selectionStart;
	var end = element.selectionEnd;
	var selection = text.substring(start, end);

	var openTag = '{' + tag + '}';
	var closeTag = '{/' + tag + '}';

	var prefix = text.substring(0, start);
	var suffix = text.substring(end);

	if (prefix.endsWith(openTag) && suffix.startsWith(closeTag)) {
		prefix = prefix.substring(0, prefix.length-openTag.length);
		suffix = suffix.substring(closeTag.length);
	} else if (selection.startsWith(openTag) && selection.endsWith(closeTag)) {
		selection = selection.substring(openTag.length, selection.length-closeTag.length);
	} else {
		selection = openTag + selection + closeTag;
	}

	element.value = prefix + selection + suffix;

	textEdited();
}

function toggleHighRes() {
	localStorage.setItem('high-res', document.querySelector('#high-res').checked);
	drawCard();
}

// INITIALIZATION

// auto load frame version (user defaults)
if (!localStorage.getItem('autoLoadFrameVersion')) {
	localStorage.setItem('autoLoadFrameVersion', document.querySelector('#autoLoadFrameVersion').checked);
}
document.querySelector('#autoLoadFrameVersion').checked = 'true' == localStorage.getItem('autoLoadFrameVersion');
// document.querySelector('#high-res').checked = 'true' == localStorage.getItem('high-res');

// collector info (user defaults)
var defaultCollector = JSON.parse(localStorage.getItem('defaultCollector') || '{}');
if ('number' in defaultCollector) {
	document.querySelector('#info-artist').value = defaultCollector.artist;
	document.querySelector('#info-number').value = defaultCollector.number;
	document.querySelector('#info-note').value = defaultCollector.note;
	document.querySelector('#info-rarity').value = defaultCollector.rarity;
	document.querySelector('#info-set').value = defaultCollector.setCode;
	document.querySelector('#info-language').value = defaultCollector.lang;
	if (defaultCollector.starDot) {setTimeout(function(){defaultCollector.starDot = true; toggleStarDot();}, 500);}
} else {
	document.querySelector('#info-number').value = date.getFullYear();
}
if (!localStorage.getItem('enableImportCollectorInfo')) {
	localStorage.setItem('enableImportCollectorInfo', 'false');
} else {
	document.querySelector('#enableImportCollectorInfo').checked = (localStorage.getItem('enableImportCollectorInfo') == 'true');
}
if (!localStorage.getItem("enableImportArtist")) {
    localStorage.setItem("enableImportArtist", "false");
} else {
    document.querySelector("#enableImportArtist").checked =
        localStorage.getItem("enableImportArtist") == "true";
}
if (!localStorage.getItem('enableNewCollectorStyle')) {
	localStorage.setItem('enableNewCollectorStyle', 'false');
} else {
	document.querySelector('#enableNewCollectorStyle').checked = (localStorage.getItem('enableNewCollectorStyle') == 'true');
}
if (!localStorage.getItem('enableCollectorInfo')) {
	localStorage.setItem('enableCollectorInfo', 'true');
} else {
	document.querySelector('#enableCollectorInfo').checked = (localStorage.getItem('enableCollectorInfo') == 'true');
}
if (!localStorage.getItem('autoFrame')) {
	localStorage.setItem('autoFrame', 'false');
} else {
	document.querySelector('#autoFrame').value = localStorage.getItem('autoFrame');
}
if (!localStorage.getItem('autoframe-always-nyx')) {
	localStorage.setItem('autoframe-always-nyx', 'false');
}
document.querySelector('#autoframe-always-nyx').checked = localStorage.getItem('autoframe-always-nyx');
if (!localStorage.getItem('autoFit')) {
	localStorage.setItem('autoFit', 'true');
} else {
	document.querySelector('#art-update-autofit').checked = localStorage.getItem('autoFit');
}

// lock set symbol code (user defaults)
if (!localStorage.getItem('lockSetSymbolCode')) {
	localStorage.setItem('lockSetSymbolCode', '');
}
if (localStorage.getItem('set-symbol-source')) {
	document.querySelector('#set-symbol-source').value = localStorage.getItem('set-symbol-source');
}
document.querySelector('#lockSetSymbolCode').checked = '' != localStorage.getItem('lockSetSymbolCode');
if (document.querySelector('#lockSetSymbolCode').checked) {
	document.querySelector('#set-symbol-code').value = localStorage.getItem('lockSetSymbolCode');
	fetchSetSymbol();
}

// lock set symbol url (user defaults)
if (!localStorage.getItem('lockSetSymbolURL')) {
	localStorage.setItem('lockSetSymbolURL', '');
}
document.querySelector('#lockSetSymbolURL').checked = '' != localStorage.getItem('lockSetSymbolURL');
if (document.querySelector('#lockSetSymbolURL').checked) {
	setSymbol.src = localStorage.getItem('lockSetSymbolURL');
}

//bind inputs together
bindInputs('#frame-editor-hsl-hue', '#frame-editor-hsl-hue-slider');
bindInputs('#frame-editor-hsl-saturation', '#frame-editor-hsl-saturation-slider');
bindInputs('#frame-editor-hsl-lightness', '#frame-editor-hsl-lightness-slider');
bindInputs('#show-guidelines', '#show-guidelines-2', true);

// Load / init whatever
loadScript('/js/frames/groupStandard-3.js');
loadAvailableCards();
initDraggableArt();
