//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/token/dayNight/dayNight.png'}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'tokenDayNight';
	//art bounds
	card.artBounds = {x:0.04, y:0.0286, width:0.92, height:0.8905};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:0.5, y:0.9524, width:0.12, height:0.0410, vertical:'center', horizontal: 'center'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:-1, y:-1, width:0.0007, height:0.0005};
	resetWatermark();
	//text
	loadTextOptions({
		title: {name:'Title', text:'', x:0.0854, y:0.0522, width:0.8292, height:0.0543, oneLine:true, font:'belerenbsc', size:0.0381, color:'white', align:'center'},
		reminder: {name:'Reminder Text', text:'', x:0.06, y:0.1267, width:0.88, height:0.3733, size:0.0343, align:'center', color:'white', noVerticalCenter:true, font:'mplantini'},
		rules: {name:'Rules Text', text:'', x:0.06, y:0.6191, width:0.88, height:0.3, size:0.0362, align:'center', color:'white'}
	});
}
//loads available frames
loadFramePack();