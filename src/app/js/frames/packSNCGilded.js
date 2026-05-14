//Create objects for common properties across available frames
var masks1 = [{src:'/img/frames/snc/gilded/frame.svg', name:'Frame'}];
var masks2 = [{src:'/img/frames/snc/gilded/frame.svg', name:'Frame'}];
var bounds = {x:0.7707, y:0.8843, width:0.1694, height:0.0639};
//defines available frames
availableFrames = [
	{name:'Regular Frame', src:'/img/frames/snc/gilded/m.png', masks:masks1},
	{name:'Legendary Frame', src:'/img/frames/snc/gilded/legendary/m.png', masks:masks2},
	{name:'Power/Toughness', src:'/img/frames/snc/gilded/pt/m.png', bounds:bounds},

];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'sncGilded';
	//art bounds
	card.artBounds = {x:0.064, y:0.0372, width:0.872, height:0.8843};
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
		title: {name:'Title', text:'', x:0.0854, y:0.0522, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0381, color:'white'},
		type: {name:'Type', text:'', x:0.0854, y:0.5664, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0324, color:'white'},
		rules: {name:'Rules Text', text:'', x:0.086, y:0.6303, width:0.828, height:0.2875, size:0.0362, color:'white'},
		pt: {name:'Power/Toughness', text:'', x:0.788, y:0.9, width:0.1367, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center', color:'white'}
	});
}
//loads available frames
loadFramePack();
//Only for the main version as the webpage loads:
if (!card.text) {
	document.querySelector('#loadFrameVersion').click();
}