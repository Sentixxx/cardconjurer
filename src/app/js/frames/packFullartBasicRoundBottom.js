//Create objects for common properties across available frames
var masks = [{src:'/img/frames/textless/zendikar/pinline.png', name:'Pinline'}, {src:'/img/frames/m15/regular/m15MaskTitle.png', name:'Title'}, {src:'/img/frames/textless/zendikar/type.png', name:'Type'}, {src:'/img/frames/textless/zendikar/frame.png', name:'Frame'}, {src:'/img/frames/m15/regular/m15MaskBorder.png', name:'Border'}];
var bounds = {x:0.42, y:0.7867, width:0.16, height:0.1143};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/textless/snowBasics/w2.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/textless/snowBasics/u2.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/textless/snowBasics/b2.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/textless/snowBasics/r2.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/textless/snowBasics/g2.png', masks:masks}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'fullartBasicRoundBottom';
	//art bounds
	card.artBounds = {x:0.078, y:0.1129, width:0.844, height:0.7248};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:0.9213, y:0.8739, width:0.12, height:0.0410, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:-1, y:-1, width:0.0007, height:0.0005};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', y:0.0613, width:0.9292, height:71/2100, oneLine:true, size:71/1638, align:'right', shadowX:-0.001, shadowY:0.0029, manaCost:true, manaSpacing:0},
		title: {name:'Title', text:'', x:0.0854, y:0.0522, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0381},
		type: {name:'Type (Left)', text:'', x:0.0854, y:0.8481, width:0.3347, height:0.0543, oneLine:true, font:'belerenb', size:0.0324},
		typeright: {name:'Type (Right)', text:'', x:0.58, y:0.8481, width:0.28, height:0.0543, oneLine:true, font:'belerenb', size:0.0324, align:'center'}
	});
}
//loads available frames
loadFramePack();