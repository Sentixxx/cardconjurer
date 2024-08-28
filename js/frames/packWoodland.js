//Create objects for common properties across available frames
var masks = [{name:'Bottom Border', src:'/img/frames/woodland/maskBottom.png'}];
var stampMasks = [{name:'Pinline', src:'/img/frames/woodland/stamp/maskPinline.png'}, {name:'Bottom Border', src:'/img/frames/woodland/stamp/maskBottomBorder.png'}];
var bounds = {x:0.7573, y:0.8848, width:0.188, height:0.0733};
var stampBounds = {x:866/2010, y:2528/2814, width:284/2010, height:149/2814};
var ptBounds = {x:1390/2010, y:2489/2814, width:597/2010, height:177/2814};
var crownBounds = {x:0/2010, y:0/2814, width:2010/2010, height:699/2814};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/woodland/w.png', masks: masks},
	{name:'Blue Frame', src:'/img/frames/woodland/u.png', masks: masks},
	{name:'Black Frame', src:'/img/frames/woodland/b.png', masks: masks},
	{name:'Red Frame', src:'/img/frames/woodland/r.png', masks: masks},
	{name:'Green Frame', src:'/img/frames/woodland/g.png', masks: masks},
	{name:'Multicolored Frame', src:'/img/frames/woodland/m.png', masks: masks},

	{name:'White Power/Toughness', src:'/img/frames/woodland/pt/w.png', bounds:ptBounds},
	{name:'Blue Power/Toughness', src:'/img/frames/woodland/pt/u.png', bounds:ptBounds},
	{name:'Black Power/Toughness', src:'/img/frames/woodland/pt/b.png', bounds:ptBounds},
	{name:'Red Power/Toughness', src:'/img/frames/woodland/pt/r.png', bounds:ptBounds},
	{name:'Green Power/Toughness', src:'/img/frames/woodland/pt/g.png', bounds:ptBounds},
	{name:'Multicolored Power/Toughness', src:'/img/frames/woodland/pt/m.png', bounds:ptBounds},

	{name:'White Legendary Crown', src:'/img/frames/woodland/crown/w.png', bounds:crownBounds},
	{name:'Blue Legendary Crown', src:'/img/frames/woodland/crown/u.png', bounds:crownBounds},
	{name:'Black Legendary Crown', src:'/img/frames/woodland/crown/b.png', bounds:crownBounds},
	{name:'Red Legendary Crown', src:'/img/frames/woodland/crown/r.png', bounds:crownBounds},
	{name:'Green Legendary Crown', src:'/img/frames/woodland/crown/g.png', bounds:crownBounds},
	{name:'Multicolored Legendary Crown', src:'/img/frames/woodland/crown/m.png', bounds:crownBounds},

	{name:'White Holo Stamp', src:'/img/frames/woodland/stamp/w.png', bounds:stampBounds, masks:stampMasks},
	{name:'Blue Holo Stamp', src:'/img/frames/woodland/stamp/u.png', bounds:stampBounds, masks:stampMasks},
	{name:'Black Holo Stamp', src:'/img/frames/woodland/stamp/b.png', bounds:stampBounds, masks:stampMasks},
	{name:'Red Holo Stamp', src:'/img/frames/woodland/stamp/r.png', bounds:stampBounds, masks:stampMasks},
	{name:'Green Holo Stamp', src:'/img/frames/woodland/stamp/g.png', bounds:stampBounds, masks:stampMasks},
	{name:'Multicolored Holo Stamp', src:'/img/frames/woodland/stamp/m.png', bounds:stampBounds, masks:stampMasks},
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'woodland';
	card.hideBottomInfoBorder = true;
	//art bounds
	card.artBounds = {x:0/2010, y:235/2814, width:2010/2010, height:1510/2814};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:0.9213, y:0.5910, width:0.12, height:0.0410, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.5, y:0.7762, width:0.75, height:0.2305};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', y:0.0613, width:0.9292, height:71/2100, oneLine:true, size:71/1638, align:'right', shadowX:-0.001, shadowY:0.0029, manaCost:true, manaSpacing:0},
		title: {name:'Title', text:'', x:0.0854, y:0.0522, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0381, color:'white'},
		type: {name:'Type', text:'', x:0.0854, y:0.5664, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0324, color:'white'},
		rules: {name:'Rules Text', text:'', x:0.086, y:0.6303, width:0.828, height:0.2875, size:0.0362},
		pt: {name:'Power/Toughness', text:'', x:0.7928, y:0.902, width:0.1367, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center'}
	});
}
//loads available frames
loadFramePack();
//Only for the main version as the webpage loads:
if (!card.text) {
	document.querySelector('#loadFrameVersion').click();
}