//Create objects for common properties across available frames
//defines available frames
availableFrames = [
	{name:'Modal DFC', src:'/img/frames/modal/helper/regular.png'},
	{name:'Transform DFC', src:'/img/frames/modal/helper/transform.png'}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'modalRegular';
	//art bounds
	card.artBounds = {x:0, y:0, width:1, height:1};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:0.5, y:0.9524, width:0.12, height:0.0410, vertical:'center', horizontal: 'center'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.5, y:0.7762, width:0.75, height:0.2305};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', y:0.081, width:0.9234, height:99/2100, oneLine:true, size:99/1638, align:'right', shadowX:-0.001, shadowY:0.0029, manaCost:true, manaSpacing:0},
		title: {name:'Title', text:'', x:0.22, y:0.0791, width:0.69, height:0.0534, oneLine:true, font:'belerenb', size:0.0534},
		mana2: {name:'Mana Cost 2', text:'', y:0.1696, width:0.9234, height:99/2100, oneLine:true, size:99/1638, align:'right', shadowX:-0.001, shadowY:0.0029, manaCost:true, manaSpacing:0},
		title2: {name:'Title 2', text:'', x:0.22, y:0.1681, width:0.69, height:0.0534, oneLine:true, font:'belerenb', size:0.0534},
		rules: {name:'Rules Text', text:'', x:0.0914, y:0.2439, width:0.8174, height:0.6762, size:0.0362},
	});
}
//loads available frames
loadFramePack();