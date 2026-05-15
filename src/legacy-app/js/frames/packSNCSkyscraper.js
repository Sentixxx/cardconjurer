//Create objects for common properties across available frames
var masks = [{src:'/img/frames/snc/skyscraper/title.svg', name:'Title'}, {src:'/img/frames/snc/skyscraper/type.svg', name:'Type'}, {src:'/img/frames/snc/skyscraper/pinline.svg', name:'Pinline'}, {src:'/img/frames/snc/skyscraper/rules.svg', name:'Rules'}, {src:'/img/frames/snc/skyscraper/frame.svg', name:'Frame'}, {src:'/img/frames/snc/skyscraper/border.svg', name:'Border'}];
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/snc/skyscraper/w.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/snc/skyscraper/u.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/snc/skyscraper/b.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/snc/skyscraper/r.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/snc/skyscraper/g.png', masks:masks},
	{name:'Multicolored Frame', src:'/img/frames/snc/skyscraper/m.png', masks:masks},
	{name:'Colorless Frame', src:'/img/frames/snc/skyscraper/c.png', masks:masks},
	{name:'Rare Stamp', src:'/img/frames/snc/stamp.png', bounds:{x:0.4554, y:0.9172, width:0.0894, height:0.0320}}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'sncSkyscraper';
	//art bounds
	card.artBounds = {x:0.0767, y:0.1129, width:0.8476, height:0.4429};
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
		title: {name:'Title', text:'', x:0.0854, y:0.0522, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0381, color:'white', shadowX:0.002, shadowY:0.0015},
		type: {name:'Type', text:'', x:0.0854, y:0.5664, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0324},
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