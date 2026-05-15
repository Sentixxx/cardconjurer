//Create objects for common properties across available frames
var masks = [{src:'/img/frames/snc/basics/pinline.svg', name:'Pinline'}, {src:'/img/frames/snc/basics/title.svg', name:'Title'}, {src:'/img/frames/snc/basics/type.svg', name:'Type'}, {src:'/img/frames/snc/basics/border.svg', name:'Border'}];
var bounds = {x:0.42, y:0.7867, width:0.16, height:0.1143};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/snc/basics/w.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/snc/basics/u.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/snc/basics/b.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/snc/basics/r.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/snc/basics/g.png', masks:masks},
	{name:'Multicolored Frame', src:'/img/frames/snc/basics/m.png', masks:masks},
	{name:'Colorless Frame', src:'/img/frames/snc/basics/l.png', masks:masks},
	{name:'White Mana Symbol', src:'/img/frames/textless/zendikar/sw.svg', bounds:bounds},
	{name:'Blue Mana Symbol', src:'/img/frames/textless/zendikar/su.svg', bounds:bounds},
	{name:'Black Mana Symbol', src:'/img/frames/textless/zendikar/sb.svg', bounds:bounds},
	{name:'Red Mana Symbol', src:'/img/frames/textless/zendikar/sr.svg', bounds:bounds},
	{name:'Green Mana Symbol', src:'/img/frames/textless/zendikar/sg.svg', bounds:bounds},
	{name:'Colorless Mana Symbol', src:'/img/frames/textless/zendikar/sc.svg', bounds:bounds}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'zendikarBasic';
	//art bounds
	card.artBounds = {x:0.04, y:0.0286, width:0.92, height:0.9};
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
		title: {name:'Title', text:'', x:0.0854, y:0.0522, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0381},
		type: {name:'Type (Left)', text:'', x:0.0854, y:0.8196, width:0.3347, height:0.0543, oneLine:true, font:'belerenb', size:0.0324},
		typeright: {name:'Type (Right)', text:'', x:0.58, y:0.8196, width:0.28, height:0.0543, oneLine:true, font:'belerenb', size:0.0324, align:'center'}
	});
}
//loads available frames
loadFramePack();