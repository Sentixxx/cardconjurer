//Create objects for common properties across available frames
var masks = [{src:'/img/frames/m15/spree/pinline.png', name:'Pinline'}, {src:'/img/frames/m15/spree/title.png', name:'Title'}, {src:'/img/frames/m15/regular/m15MaskType.png', name:'Type'}, {src:'/img/frames/m15/regular/m15MaskRules.png', name:'Rules'}, {src:'/img/frames/m15/spree/frame.png', name:'Frame'}, {src:'/img/frames/m15/spree/border.png', name:'Border'}];
var bounds = {x:0.7573, y:0.8848, width:0.188, height:0.0733};
var bounds2 = {x:0.4254, y:0.9005, width:0.1494, height:0.0486};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/m15/spree/ub/w.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/m15/spree/ub/u.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/m15/spree/ub/b.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/m15/spree/ub/r.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/m15/spree/ub/g.png', masks:masks},
	{name:'Multicolored Frame', src:'/img/frames/m15/spree/ub/m.png', masks:masks},

	{name:'White Holo Stamp', src:'/img/frames/m15/ub/regular/stamp/w.png', bounds:bounds2},
	{name:'Blue Holo Stamp', src:'/img/frames/m15/ub/regular/stamp/u.png', bounds:bounds2},
	{name:'Black Holo Stamp', src:'/img/frames/m15/ub/regular/stamp/b.png', bounds:bounds2},
	{name:'Red Holo Stamp', src:'/img/frames/m15/ub/regular/stamp/r.png', bounds:bounds2},
	{name:'Green Holo Stamp', src:'/img/frames/m15/ub/regular/stamp/g.png', bounds:bounds2},
	{name:'Multicolored Holo Stamp', src:'/img/frames/m15/ub/regular/stamp/m.png', bounds:bounds2},
	{name:'Gray Holo Stamp', src:'/img/frames/m15/ub/regular/stamp/gray.png', bounds:bounds2},
	{name:'Gold Holo Stamp', src:'/img/frames/m15/ub/regular/stamp/gold.png', bounds:bounds2}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {

	//resets things so that every frame doesn't have to
	await resetCardIrregularities([2010,2814,0,0]);
	//sets card version
	card.version = 'm15SpreeUB';
	//art bounds
	card.artBounds = {x:0.0767, y:0.1129, width:0.8476, height:0.4429};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:1862/2010, y:0.5910, width:0.12, height:0.0410, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.5, y:0.7762, width:0.75, height:0.2305};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', y:176/2814, width:1864/2010, height:71/2100, oneLine:true, size:70.5/1638, align:'right', shadowX:-0.001, shadowY:0.0029, manaCost:true, manaSpacing:0},
		title: {name:'Title', text:'', x:168/2010, y:145/2814, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0381},
		type: {name:'Type', text:'', x:168/2010, y:1588/2814, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0324},
		rules: {name:'Rules Text', text:'', x:0.086, y:1780/2814, width:0.828, height:0.2875, size:0.0362},
		pt: {name:'Power/Toughness', text:'', x:0.7928, y:0.902, width:0.1367, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center'}
	});
}
//loads available frames
loadFramePack();
//Only for the main version as the webpage loads:
if (!card.text) {
	document.querySelector('#loadFrameVersion').click();
}