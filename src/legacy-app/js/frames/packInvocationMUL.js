//Create objects for common properties across available frames
var masks = [{src:'img/frames/invocation/accents.png', name:'Accents'}];
var bounds = {x:0.8587, y:0.8186, width:0.062, height:0.1258};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/invocation/mul/w.png', masks: masks},
	{name:'Blue Frame', src:'/img/frames/invocation/mul/u.png', masks: masks},
	{name:'Black Frame', src:'/img/frames/invocation/mul/b.png', masks: masks},
	{name:'Red Frame', src:'/img/frames/invocation/mul/r.png', masks: masks},
	{name:'Green Frame', src:'/img/frames/invocation/mul/g.png', masks: masks},
	{name:'Multicolored Frame', src:'/img/frames/invocation/mul/m.png', masks: masks},
	{name:'Artifact Frame', src:'/img/frames/invocation/mul/a.png', masks: masks},
	{name:'Power/Toughness', src:'/img/frames/invocation/mul/pt.png', bounds:bounds},
	{name:'Holo Stamp', src:'/img/frames/invocation/mul/stamp.png', bounds:{x: 644/1500, y:1874/2100, width:212/1500, height:124/2100}}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'invocation';
	//art bounds
	card.artBounds = {x:173/1500, y:313/2100, width:1150/1500, height:819/2100};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:0.9213, y:0.5910, width:0.12, height:0.0410, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.5, y:0.7762, width:0.75, height:0.2305};
	resetWatermark();
	//text
	loadTextOptions({ //old color: 24150E
		mana: {name:'Mana Cost', text:'', y:0.0613, width:0.93, height:78/2100, oneLine:true, size:78/1638, align:'right', manaCost:true, manaSpacing:0, shadowX:-0.001, shadowY:0.0029},
		title: {name:'Title', text:'', x:0.0834, y:0.05, width:0.8292, height:0.0515, oneLine:true, font:'belerenb', size:0.0381, color:'black'},
		type: {name:'Type', text:'', x:0.0767, y:1198/2100, width:0.8292, height:97/2100, oneLine:true, font:'belerenb', size:0.0324, color:'black'},
		rules: {name:'Rules Text', text:'', x:148 /1500, y:1349/2100 , width:1204/1500, height:579/2100, size:0.0362},
		pt: {name:'Power/Toughness', text:'', x:0.8707, y:0.8315, width:0.0387, height:0.0929, size:0.0372, font:'belerenbsc', align:'center', color:'black'}
	});
}
//loads available frames
loadFramePack();
