//Create objects for common properties across available frames
var masks = [{src:'/img/frames/snc/gilded/frame.svg', name:'Frame'}];
var bounds = {x:0.05, y:0.0177, width:0.9, height:0.0958};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/snc/gilded/colored/w.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/snc/gilded/colored/u.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/snc/gilded/colored/b.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/snc/gilded/colored/r.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/snc/gilded/colored/g.png', masks:masks},
	{name:'Multicolored Frame', src:'/img/frames/snc/gilded/colored/m.png', masks:masks},
	{name:'Artifact Frame', src:'/img/frames/snc/gilded/colored/a.png', masks:masks},
	{name:'Power/Toughness', src:'/img/frames/snc/gilded/colored/pt.png', bounds:{x:0.7707, y:0.8843, width:0.1694, height:0.0639}},
	{name:'White Legend Crown', src:'/img/frames/snc/gilded/colored/crowns/w.png', bounds:bounds},
	{name:'Blue Legend Crown', src:'/img/frames/snc/gilded/colored/crowns/u.png', bounds:bounds},
	{name:'Black Legend Crown', src:'/img/frames/snc/gilded/colored/crowns/b.png', bounds:bounds},
	{name:'Red Legend Crown', src:'/img/frames/snc/gilded/colored/crowns/r.png', bounds:bounds},
	{name:'Green Legend Crown', src:'/img/frames/snc/gilded/colored/crowns/g.png', bounds:bounds},
	{name:'Multicolored Legend Crown', src:'/img/frames/snc/gilded/colored/crowns/m.png', bounds:bounds},
	{name:'Artifact Legend Crown', src:'/img/frames/snc/gilded/colored/crowns/a.png', bounds:bounds},

];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'sncGildedColored';
	//art bounds
	card.artBounds = {x:0.078, y:0.1124, width:0.844, height:0.4448};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:0.9213, y:0.5910, width:0.12, height:0.0410, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.5, y:0.7762, width:0.75, height:0.2305};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', y:0.0629, width:0.928, height:71/2100, oneLine:true, size:71/1638, align:'right', shadowX:-0.001, shadowY:0.0029, manaCost:true, manaSpacing:0},
		title: {name:'Title', text:'', x:0.0854, y:0.0522, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0381, color:'white', shadowX:0.002, shadowY:0.0015},
		type: {name:'Type', text:'', x:0.0854, y:0.5664, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0324, color:'white', shadowX:0.002, shadowY:0.0015},
		rules: {name:'Rules Text', text:'', x:0.086, y:0.6303, width:0.828, height:0.2875, size:0.0362, color:'white', shadowX:0.002, shadowY:0.0015},
		pt: {name:'Power/Toughness', text:'', x:0.788, y:0.9, width:0.1367, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center', color:'white'}
	});
}
//loads available frames
loadFramePack();
//Only for the main version as the webpage loads:
if (!card.text) {
	document.querySelector('#loadFrameVersion').click();
}