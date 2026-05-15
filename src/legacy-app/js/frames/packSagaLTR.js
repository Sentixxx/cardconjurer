//Create objects for common properties across available frames
var masks = [{src:'/img/frames/saga/ltr/maskNoOverlay.png', name:'No Art Overlay'}];
var stampBounds = {x:878/2010, y:2560/2814, width:256/2010, height:116/2814};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/saga/ltr/w.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/saga/ltr/u.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/saga/ltr/b.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/saga/ltr/r.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/saga/ltr/g.png', masks:masks},
	{name:'Multicolored Frame', src:'/img/frames/saga/ltr/m.png', masks:masks},


	// {name:'Blue Frame', src:'/img/frames/saga/regular/sagaFrameU.png', masks:masks},
	// {name:'Black Frame', src:'/img/frames/saga/regular/sagaFrameB.png', masks:masks},
	// {name:'Red Frame', src:'/img/frames/saga/regular/sagaFrameR.png', masks:masks},
	// {name:'Green Frame', src:'/img/frames/saga/regular/sagaFrameG.png', masks:masks},
	// {name:'Multicolored Frame', src:'/img/frames/saga/regular/sagaFrameM.png', masks:masks},
	// {name:'Land Frame', src:'/img/frames/saga/regular/l.png', masks:masks},
	{name:'Banner Pinstripe (Multicolored)', src:'/img/frames/saga//ltr/sagaMidStripe.png', bounds:{x:136/2010, y:761/2814, width:41/2010, height:1435/2814}},
	{name:'Multicolored Bars', src:'/img/frames/saga/ltr/multicolor-bar-overlay.png', mode:'color'},

	{name:'Gold Holo Stamp', src:'/img/frames/saga/ltr/stamp.png', bounds:stampBounds},
	{name:'Gray Holo Stamp', src:'/img/frames/saga/ltr/grayStamp.png', bounds:stampBounds}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	replacementMasks = {'Right Half':'/img/frames/saga/ltr/maskRightHalf.png'};
	//sets card version
	card.version = 'sagaLTR';
	card.onload = '/js/frames/versionSaga.js';
	loadScript('/js/frames/versionSaga.js');
	//art bounds
	card.artBounds = {x:997/2010, y:313/2814, width:857/2010, height:2046/2814};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:0.9227, y:0.8739, width:0.12, height:0.0381, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.3027, y:0.4748, width:0.3547, height:0.6767};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', y:0.0613, width:0.9292, height:71/2100, oneLine:true, size:71/1638, align:'right', shadowX:-0.001, shadowY:0.0029, manaCost:true, manaSpacing:0},
		title: {name:'Title', text:'', x:0.0854, y:0.0522, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0381},
		type: {name:'Type', text:'', x:0.0854, y:0.8481, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0324},
		ability0: {name:'Ability 1', text:'', x:0.1334, y:0.2896, width:0.35, height:0.1786, size:0.0305},
		ability1: {name:'Ability 2', text:'', x:0.1334, y:0, width:0.35, height:0.1786, size:0.0305},
		ability2: {name:'Ability 3', text:'', x:0.1334, y:0, width:0.35, height:0.1786, size:0.0305},
		ability3: {name:'Ability 4', text:'', x:0.1334, y:0, width:0.35, height:0, size:0.0305},
		reminder: {name:'Reminder Text', text:'{i}(As this Saga enters and after your draw step, add a lore counter. Sacrifice after III.)', x:0.0867, y:0.1129, width:0.404, height:0.1772, size:0.03, shadowColor:'white'}
	});
}
//loads available frames
loadFramePack();