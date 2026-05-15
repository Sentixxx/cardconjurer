//Create objects for common properties across available frames
var masks = [{src:'/img/frames/m15/new/pinline.png', name:'Pinline'}, {src:'/img/frames/m15/new/title.png', name:'Title'}, {src:'/img/frames/m15/new/type.png', name:'Type'}, {src:'/img/frames/m15/new/rules.png', name:'Rules'}, {src:'/img/frames/m15/new/frame.png', name:'Frame'}, {src:'/img/frames/m15/new/border.png', name:'Border'}];
var bounds = {x:0.7573, y:0.8848, width:0.188, height:0.0733};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/m15/new/fullart/w.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/m15/new/fullart/u.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/m15/new/fullart/b.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/m15/new/fullart/r.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/m15/new/fullart/g.png', masks:masks},
	{name:'Multicolored Frame', src:'/img/frames/m15/new/fullart/m.png', masks:masks},
	{name:'Artifact Frame', src:'/img/frames/m15/new/fullart/a.png', masks:masks},
	{name:'Land Frame', src:'/img/frames/m15/new/fullart/l.png', masks:masks},
	{name:'Eldrazi Frame', src:'/img/frames/m15/new/fullart/c.png', masks:masks},
	{name:'Vehicle Frame', src:'/img/frames/m15/new/fullart/v.png', masks:masks},

	{name:'White Power/Toughness', src:'/img/frames/m15/regular/m15PTW.png', bounds:bounds},
	{name:'Blue Power/Toughness', src:'/img/frames/m15/regular/m15PTU.png', bounds:bounds},
	{name:'Black Power/Toughness', src:'/img/frames/m15/regular/m15PTB.png', bounds:bounds},
	{name:'Red Power/Toughness', src:'/img/frames/m15/regular/m15PTR.png', bounds:bounds},
	{name:'Green Power/Toughness', src:'/img/frames/m15/regular/m15PTG.png', bounds:bounds},
	{name:'Multicolored Power/Toughness', src:'/img/frames/m15/regular/m15PTM.png', bounds:bounds},
	{name:'Artifact Power/Toughness', src:'/img/frames/m15/regular/m15PTA.png', bounds:bounds},
	{name:'Colorless Power/Toughness', src:'/img/frames/m15/regular/m15PTC.png', bounds:bounds},
	{name:'Vehicle Power/Toughness', src:'/img/frames/m15/regular/m15PTV.png', bounds:bounds},

	{name:'White Land Frame', src:'/img/frames/m15/new/fullart/lw.png', masks:masks},
	{name:'Blue Land Frame', src:'/img/frames/m15/new/fullart/lu.png', masks:masks},
	{name:'Black Land Frame', src:'/img/frames/m15/new/fullart/lb.png', masks:masks},
	{name:'Red Land Frame', src:'/img/frames/m15/new/fullart/lr.png', masks:masks},
	{name:'Green Land Frame', src:'/img/frames/m15/new/fullart/lg.png', masks:masks},
	{name:'Multicolored Land Frame', src:'/img/frames/m15/new/fullart/lm.png', masks:masks},
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {

	//resets things so that every frame doesn't have to
	await resetCardIrregularities([2010,2814,0,0]);
	//sets card version
	card.version = 'm15ClearTextboxes';
	//art bounds
	card.artBounds = {x:0.062, y:0.1129, width:0.876, height:0.8096};
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
		type: {name:'Type', text:'', x:168/2010, y:1588/2814, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0324, color:'white'},
		rules: {name:'Rules Text', text:'', x:0.086, y:1780/2814, width:0.828, height:0.2875, size:0.0362, color:'white'},
		pt: {name:'Power/Toughness', text:'', x:0.7928, y:0.902, width:0.1367, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center'}
	});
}
//loads available frames
loadFramePack();
//Only for the main version as the webpage loads:
if (!card.text) {
	document.querySelector('#loadFrameVersion').click();
}