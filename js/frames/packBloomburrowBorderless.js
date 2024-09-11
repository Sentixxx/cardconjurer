//defines available frames
availableFrames = [
	{name:'Creature Frame', src:'/img/frames/bloomburrowBorderless/creature.png'},
	{name:'Noncreature Frame', src:'/img/frames/bloomburrowBorderless/noncreature.png'},
	{name:'Legendary Accents', src:'/img/frames/bloomburrowBorderless/crown.png'}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'bloomburrowBorderless';
	//art bounds
	card.artBounds = {x:0, y:0, width:1, height:2659/2814};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:0.9213, y:1671/2814, width:0.12, height:0.0410, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.5, y:0.7762, width:0.75, height:0.2305};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', y:0.0613, width:0.9292, height:71/2100, oneLine:true, size:71/1638, align:'right', shadowX:-0.001, shadowY:0.0029, manaCost:true, manaSpacing:0},
		title: {name:'Title', text:'', x:0.0854, y:0.0522, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0381, color:'white'},
		type: {name:'Type', text:'', x:0.0854, y:1602/2814, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0324, color:'white'},
		rules: {name:'Rules Text', text:'', x:173/2010, y:1818/2814, width:1664/2010, height:684/2814, size:0.0362, color:'white'},
		pt: {name:'Power/Toughness', text:'', x:1594/2010, y:2546/2814, width:275/2010, height:105/2814, size:0.0372, font:'belerenbsc', oneLine:true, align:'center', color:'white'}
	});
}
//loads available frames
loadFramePack();