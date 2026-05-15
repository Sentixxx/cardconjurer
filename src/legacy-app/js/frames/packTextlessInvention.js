//Create objects for common properties across available frames
var masks = [{src:'/img/frames/textless/m15TextlessMaskPinline.png', name:'Pinline'}, {src:'/img/frames/m15/regular/m15MaskTitle.png', name:'Title'}, {src:'/img/frames/textless/m15TextlessMaskType.png', name:'Type'}, {src:'/img/frames/textless/invention/m15TextlessMaskInvention.png', name:'Frame'}, {src:'/img/frames/m15/regular/m15MaskBorder.png', name:'Border'}];
var bounds = {x:0.7573, y:0.8848, width:0.188, height:0.0733};
//defines available frames
availableFrames = [
	{name:'Invention Frame', src:'/img/frames/textless/invention/m15TextlessFrameInvention.png', masks:masks},
	{name:'White Frame', src:'/img/frames/textless/invention/m15TextlessFrameInventionW.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/textless/invention/m15TextlessFrameInventionU.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/textless/invention/m15TextlessFrameInventionB.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/textless/invention/m15TextlessFrameInventionR.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/textless/invention/m15TextlessFrameInventionG.png', masks:masks},
	{name:'Multicolored Frame', src:'/img/frames/textless/invention/m15TextlessFrameInventionM.png', masks:masks},
	{name:'Artifact Frame', src:'/img/frames/textless/invention/m15TextlessFrameInventionA.png', masks:masks},
	{name:'Colorless Frame', src:'/img/frames/textless/invention/m15TextlessFrameInventionL.png', masks:masks},
	{name:'Phyrexian Frame', src:'/img/frames/textless/invention/m15TextlessFrameInventionPhyrexian.png', masks:masks},
	{name:'Invention Power/Toughness', src:'/img/frames/m15/invention/inventionPT.png', bounds:bounds},
	{name:'White Power/Toughness', src:'/img/frames/m15/regular/m15PTW.png', bounds:bounds},
	{name:'Blue Power/Toughness', src:'/img/frames/m15/regular/m15PTU.png', bounds:bounds},
	{name:'Black Power/Toughness', src:'/img/frames/m15/regular/m15PTB.png', bounds:bounds},
	{name:'Red Power/Toughness', src:'/img/frames/m15/regular/m15PTR.png', bounds:bounds},
	{name:'Green Power/Toughness', src:'/img/frames/m15/regular/m15PTG.png', bounds:bounds},
	{name:'Multicolored Power/Toughness', src:'/img/frames/m15/regular/m15PTM.png', bounds:bounds},
	{name:'Artifact Power/Toughness', src:'/img/frames/m15/regular/m15PTA.png', bounds:bounds},
	{name:'Colorless Power/Toughness', src:'/img/frames/m15/regular/m15PTC.png', bounds:bounds}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'textlessInvention';
	//art bounds
	card.artBounds = {x:0, y:0, width:1, height:0.9224};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:0.9213, y:0.8439, width:0.12, height:0.0410, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:-1, y:-1, width:0.0007, height:0.0005};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', y:0.0613, width:0.9292, height:71/2100, oneLine:true, size:71/1638, align:'right', shadowX:-0.001, shadowY:0.0029, manaCost:true, manaSpacing:0},
		title: {name:'Title', text:'', x:0.0854, y:0.0522, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0381, shadow:'white', shadowX:-0.0007, shadowY:0.0005},
		type: {name:'Type', text:'', x:0.0854, y:0.8196, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0324, shadow:'white', shadowX:-0.0007, shadowY:0.0005},
		pt: {name:'Power/Toughness', text:'', x:0.7928, y:0.902, width:0.1367, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center', shadow:'white', shadowX:-0.0007, shadowY:0.0005}
	});
}
//loads available frames
loadFramePack();