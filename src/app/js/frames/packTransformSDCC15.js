//defines available frames
availableFrames = [
	{name:'Frame', src:'/img/frames/m15/sdcc15/transformFront.svg'},
	{name:'Frame', src:'/img/frames/m15/sdcc15/transformBack.svg'},
	{name:'Power/Toughness', src:'/img/frames/m15/sdcc15/pt.svg'},
	{name:'Frame', src:'/img/frames/m15/sdcc15/ciPip.svg'}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'transformSDCC15';
	//art bounds
	card.artBounds = {x:0.0394, y:0.0281, width:0.9214, height:0.8929};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:0.9213, y:0.5910, width:0.12, height:0.0410, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.5, y:0.7762, width:0.75, height:0.2305};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', y:0.0613, width:0.9292, height:71/2100, oneLine:true, size:71/1638, align:'right', manaCost:true, manaSpacing:0},
		title: {name:'Title', text:'', x:0.16, y:0.0522, width:0.7547, height:0.0543, oneLine:true, font:'belerenb', size:0.0381, color:'#aaa'},
		type: {name:'Type', text:'', x:0.0854, y:0.5664, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0324, color:'#aaa'},
		rules: {name:'Rules Text', text:'', x:0.086, y:0.6303, width:0.828, height:0.2875, size:0.0362, color:'#aaa'},
		reminder: {name:'Reverse PT', text:'', x:0.086, y:0.842, width:0.838, height:0.0362, size:0.0291, oneLine:true, align:'right', font:'belerenbsc', color:'#aaa'},
		pt: {name:'Power/Toughness', text:'', x:0.7928, y:0.902, width:0.1367, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center', color:'#aaa'}
	});
}
//loads available frames
loadFramePack();