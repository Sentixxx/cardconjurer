//Create objects for common properties across available frames
var masks = [{src:'/img/frames/m15/oilslick/m15OilSlickMaskPinline.png', name:'Pinline'}];
var masks2 = [{src:'/img/frames/m15/oilslick/m15OilSlickCrownMaskPinline.png', name:'Pinline'}];
var bounds = {x:0.7573, y:0.8848, width:0.188, height:0.0733};
var bounds2 = {x:637/1500, y:1898/2100, width:225/1500, height:104/2100};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/m15/oilslick/m15OilSlickFrameW.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/m15/oilslick/m15OilSlickFrameU.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/m15/oilslick/m15OilSlickFrameB.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/m15/oilslick/m15OilSlickFrameR.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/m15/oilslick/m15OilSlickFrameG.png', masks:masks},
	{name:'Multicolored Frame', src:'/img/frames/m15/oilslick/m15OilSlickFrameM.png', masks:masks},
	{name:'Artifact Frame', src:'/img/frames/m15/oilslick/m15OilSlickFrameA.png', masks:masks},
	{name:'Land Frame', src:'/img/frames/m15/oilslick/m15OilSlickFrameL.png', masks:masks},
	{name:'White Power/Toughness', src:'/img/frames/m15/oilslick/wpt.png', bounds:bounds, complementary: 32},
	{name:'Blue Power/Toughness', src:'/img/frames/m15/oilslick/upt.png', bounds:bounds, complementary: 32},
	{name:'Black Power/Toughness', src:'/img/frames/m15/oilslick/bpt.png', bounds:bounds, complementary: 32},
	{name:'Red Power/Toughness', src:'/img/frames/m15/oilslick/rpt.png', bounds:bounds, complementary: 32},
	{name:'Green Power/Toughness', src:'/img/frames/m15/oilslick/gpt.png', bounds:bounds, complementary: 32},
	{name:'Multicolored Power/Toughness', src:'/img/frames/m15/oilslick/mpt.png', bounds:bounds, complementary: 32},
	{name:'Artifact Power/Toughness', src:'/img/frames/m15/oilslick/apt.png', bounds:bounds, complementary: 32},
	{name:'Colorless Power/Toughness', src:'/img/frames/m15/oilslick/cpt.png', bounds:bounds, complementary: 32},
	{name:'White Legendary Crown', src:'/img/frames/m15/oilslick/wCrown.png', masks:masks2, complementary: 33},
	{name:'Blue Legendary Crown', src:'/img/frames/m15/oilslick/uCrown.png', masks:masks2, complementary: 33},
	{name:'Black Legendary Crown', src:'/img/frames/m15/oilslick/bCrown.png', masks:masks2, complementary: 33},
	{name:'Red Legendary Crown', src:'/img/frames/m15/oilslick/rCrown.png', masks:masks2, complementary: 33},
	{name:'Green Legendary Crown', src:'/img/frames/m15/oilslick/gCrown.png', masks:masks2, complementary: 33},
	{name:'Multicolored Legendary Crown', src:'/img/frames/m15/oilslick/mCrown.png', masks:masks2, complementary: 33},
	{name:'Artifact Legendary Crown', src:'/img/frames/m15/oilslick/aCrown.png', masks:masks2, complementary: 33},
	{name:'Colorless Legendary Crown', src:'/img/frames/m15/oilslick/cCrown.png', masks:masks2, complementary: 33},
	{name:'White Holostamp', src:'/img/frames/m15/oilslick/wStamp.png', bounds:bounds2},
	{name:'Blue Holostamp', src:'/img/frames/m15/oilslick/uStamp.png', bounds:bounds2},
	{name:'Black Holostamp', src:'/img/frames/m15/oilslick/bStamp.png', bounds:bounds2},
	{name:'Red Holostamp', src:'/img/frames/m15/oilslick/rStamp.png', bounds:bounds2},
	{name:'Green Holostamp', src:'/img/frames/m15/oilslick/gStamp.png', bounds:bounds2},
	{name:'Multicolored Holostamp', src:'/img/frames/m15/oilslick/mStamp.png', bounds:bounds2},
	{name:'Artifact Holostamp', src:'/img/frames/m15/oilslick/aStamp.png', bounds:bounds2},
	{name:'Colorless Holostamp', src:'/img/frames/m15/oilslick/cStamp.png', bounds:bounds2},
	{name:'Power/Toughness Cutout', src:'/img/frames/m15/oilslick/ptcutout.png', bounds:bounds, erase:true},
	{name:'Legendary Crown Cutout', src:'/img/frames/m15/oilslick/crownCutout.png', erase: true}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'oilSlick';
	loadScript('/js/frames/manaSymbolsOilSlick.js');
	//art bounds
	card.artBounds = {x:0, y:0, width:1, height:1974/2100};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:0.9213, y:0.5910, width:0.12, height:0.0410, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.5, y:0.7762, width:0.75, height:0.2305};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', y:141/2100, width:0.9292, height:71/2100, oneLine:true, size:71/1638, align:'right', manaCost:true, manaSpacing:0, manaPrefix:'oilslick'},
		title: {name:'Title', text:'', x:0.0854, y:0.0522, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0381, color:'#d4d5d6', shadowX:0.0014, outlineWidth:0.006},
		type: {name:'Type', text:'', x:0.0854, y:0.5664, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0324, color:'#d4d5d6', outlineWidth:0.006},
		rules: {name:'Rules Text', text:'', x:0.086, y:0.6303, width:0.828, height:0.2875, size:0.0362, color:'#d4d5d6', outlineWidth:0.006, manaPrefix:'oilslick'},
		pt: {name:'Power/Toughness', text:'', x:0.7928, y:0.902, width:0.1367, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center', outlineWidth:0.006, color:'#d4d5d6'}
	});
}
//loads available frames
loadFramePack();