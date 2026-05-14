//Create objects for common properties across available frames
var masks = [{src:'/img/frames/dmu/stainedGlass/rules.svg', name:'Rules'}];
var masks2 = [{src:'/img/frames/dmu/stainedGlass/crown.svg', name:'Inner Crown'}];
var bounds = {x:0.7747, y:0.8872, width:0.1747, height:0.0605};
var bounds2 = {x:0.1134, y:0.0139, width:0.7734, height:0.0262};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/dmu/stainedGlass/w.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/dmu/stainedGlass/u.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/dmu/stainedGlass/b.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/dmu/stainedGlass/r.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/dmu/stainedGlass/g.png', masks:masks},
	{name:'Multicolored Frame', src:'/img/frames/dmu/stainedGlass/m.png', masks:masks},
	{name:'White Power/Toughness', src:'/img/frames/dmu/stainedGlass/pt/w.png', bounds:bounds},
	{name:'Blue Power/Toughness', src:'/img/frames/dmu/stainedGlass/pt/u.png', bounds:bounds},
	{name:'Black Power/Toughness', src:'/img/frames/dmu/stainedGlass/pt/b.png', bounds:bounds},
	{name:'Red Power/Toughness', src:'/img/frames/dmu/stainedGlass/pt/r.png', bounds:bounds},
	{name:'Green Power/Toughness', src:'/img/frames/dmu/stainedGlass/pt/g.png', bounds:bounds},
	{name:'Multicolored Power/Toughness', src:'/img/frames/dmu/stainedGlass/pt/m.png', bounds:bounds},
	{name:'White Legend Crown', src:'/img/frames/dmu/stainedGlass/crowns/w.png', bounds:bounds2, masks:masks2},
	{name:'Blue Legend Crown', src:'/img/frames/dmu/stainedGlass/crowns/u.png', bounds:bounds2, masks:masks2},
	{name:'Black Legend Crown', src:'/img/frames/dmu/stainedGlass/crowns/b.png', bounds:bounds2, masks:masks2},
	{name:'Red Legend Crown', src:'/img/frames/dmu/stainedGlass/crowns/r.png', bounds:bounds2, masks:masks2},
	{name:'Green Legend Crown', src:'/img/frames/dmu/stainedGlass/crowns/g.png', bounds:bounds2, masks:masks2},
	{name:'Multicolored Legend Crown', src:'/img/frames/dmu/stainedGlass/crowns/m.png', bounds:bounds2, masks:masks2},
	{name:'Rare Stamp', src:'/img/frames/dmu/stamp.png', bounds:{x:0.4554, y:0.9172, width:0.0894, height:0.0320}}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'dmuStainedGlass';
	//art bounds
	card.artBounds = {x:0.04, y:0.1105, width:0.92, height:0.4462};
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
		title: {name:'Title', text:'', x:0.0854, y:0.0522, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0381, color:"white"},
		type: {name:'Type', text:'', x:0.0854, y:0.5664, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0324, color:"white"},
		rules: {name:'Rules Text', text:'', x:0.086, y:0.6303, width:0.828, height:0.281, size:0.0362, color:"white"},
		pt: {name:'Power/Toughness', text:'', x:0.7928, y:0.902, width:0.1367, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center', color:"white"}
	});
}
//loads available frames
loadFramePack();