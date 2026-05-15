//Create objects for common properties across available frames
var masks = [{src:'/img/frames/modal/short/shortModalMaskPinline.png', name:'Pinline'}, {src:'/img/frames/modal/modalMaskTitle.png', name:'Title'}, {src:'/img/frames/modal/short/shortMaskType.png', name:'Type'}, {src:'/img/frames/modal/short/shortModalMaskText.png', name:'Rules'}, {src:'/img/frames/modal/titleMDFCArrow.svg', name:'MDFC Arrow'}, {src:'/img/frames/modal/modalMaskReminder.png', name:'Flipside'}, {src:'/img/frames/modal/short/shortModalMaskBorder.png', name:'Border'}];
var bounds = {x:0.7573, y:0.8848, width:0.188, height:0.0733};
//defines available frames
availableFrames = [
	{name:'White Frame (Front)', src:'/img/frames/modal/short/shortModalFrameWF.png', masks:masks},
	{name:'Blue Frame (Front)', src:'/img/frames/modal/short/shortModalFrameUF.png', masks:masks},
	{name:'Black Frame (Front)', src:'/img/frames/modal/short/shortModalFrameBF.png', masks:masks},
	{name:'Red Frame (Front)', src:'/img/frames/modal/short/shortModalFrameRF.png', masks:masks},
	{name:'Green Frame (Front)', src:'/img/frames/modal/short/shortModalFrameGF.png', masks:masks},
	{name:'White Frame (Back)', src:'/img/frames/modal/short/shortModalFrameWB.png', masks:masks},
	{name:'Blue Frame (Back)', src:'/img/frames/modal/short/shortModalFrameUB.png', masks:masks},
	{name:'Black Frame (Back)', src:'/img/frames/modal/short/shortModalFrameBB.png', masks:masks},
	{name:'Red Frame (Back)', src:'/img/frames/modal/short/shortModalFrameRB.png', masks:masks},
	{name:'Green Frame (Back)', src:'/img/frames/modal/short/shortModalFrameGB.png', masks:masks},
	{name:'White Power/Toughness', src:'/img/frames/m15/regular/m15PTW.png', bounds:bounds},
	{name:'Blue Power/Toughness', src:'/img/frames/m15/regular/m15PTU.png', bounds:bounds},
	{name:'Black Power/Toughness', src:'/img/frames/m15/regular/m15PTB.png', bounds:bounds},
	{name:'Red Power/Toughness', src:'/img/frames/m15/regular/m15PTR.png', bounds:bounds},
	{name:'Green Power/Toughness', src:'/img/frames/m15/regular/m15PTG.png', bounds:bounds}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'modalShort';
	//art bounds
	card.artBounds = {x:0, y:0, width:1, height:0.9224};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:0.9213, y:0.7272, width:0.12, height:0.0410, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.5, y:0.7762, width:0.75, height:0.2305};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', y:0.0613, width:0.9292, height:71/2100, oneLine:true, size:71/1638, align:'right', shadowX:-0.001, shadowY:0.0029, manaCost:true, manaSpacing:0},
		title: {name:'Title', text:'', x:0.1614, y:0.0522, width:0.7534, height:0.0543, oneLine:true, font:'belerenb', size:0.0381},
		type: {name:'Type', text:'', x:0.0854, y:0.7024, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0324},
		rules: {name:'Rules Text', text:'', x:0.086, y:0.7647, width:0.828, height:0.1239, size:0.0362},
		flipsideType: {name:'Flipside Type', text:'', x:0.068, y:0.892, width:0.364, height:0.0391, size:0.0234, color:'white', oneLine:true, font:'belerenb'},
		flipSideReminder: {name:'Flipside Text', text:'', x:0.068, y:0.892, width:0.364, height:0.0391, size:0.0258, color:'white', oneLine:true, align:'right'},
		pt: {name:'Power/Toughness', text:'', x:0.7928, y:0.902, width:0.1367, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center'}
	});
}
//loads available frames
loadFramePack();
//Only for the main version as the webpage loads:
if (!card.text) {
	document.querySelector('#loadFrameVersion').click();
}