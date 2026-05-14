//Create objects for common properties across available frames
var bounds = {x:0.7574, y:0.8839, width:0.196, height:0.0781};
//defines available frames
availableFrames = [
	{name:'Multicolored Frame', src:'/img/frames/custom/feuerAmeise/ixalan/m.png'},
	{name:'Multicolored Power/Toughness', src:'/img/frames/custom/feuerAmeise/ixalan/pt.png', bounds:bounds},
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'feuerAmeiseIxalan';
	document.querySelector('#info-number').value = document.querySelector('#info-number').value.replace(card.infoYear, 'FeuerAmeise');
	bottomInfoEdited();
	//art bounds
	card.artBounds = {x:0.0394, y:0.0286, width:0.9214, height:0.8939};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:0.9213, y:0.5910, width:0.12, height:0.0410, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.5, y:0.7762, width:0.75, height:0.2305};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', y:0.0613, width:0.8734, height:71/2100, oneLine:true, size:71/1638, align:'right', shadowX:-0.001, shadowY:0.0029, manaCost:true, manaSpacing:0},
		title: {name:'Title', text:'', x:0.1267, y:0.0522, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0381, color:'white'},
		type: {name:'Type', text:'', x:0.086, y:0.5681, width:0.828, height:0.0543, oneLine:true, font:'belerenb', size:0.0324, color:'white'},
		rules: {name:'Rules Text', text:'', x:0.0974, y:0.6303, width:0.8054, height:0.2477, size:0.0362, color:'white', shadowX:0.0027, shadowY:0.002},
		pt: {name:'Power/Toughness', text:'', x:0.7947, y:0.9043, width:0.1367, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center', color:'white'}
	});
}
//loads available frames
loadFramePack();
//Only for the main version as the webpage loads:
if (!card.text) {
	document.querySelector('#loadFrameVersion').click();
}