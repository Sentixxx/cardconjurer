//Create objects for common properties across available frames
var masks = [{src:'/img/frames/neo/ninja/frame.svg', name:'Frame'}];
var bounds = {x:0.7634, y:0.8829, width:0.196, height:0.0648};
var bounds2 = {x:0.0367, y:0.0186, width:0.9267, height:0.0324};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/neo/ninja/w.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/neo/ninja/u.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/neo/ninja/b.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/neo/ninja/r.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/neo/ninja/g.png', masks:masks},
	{name:'Multicolored Frame', src:'/img/frames/neo/ninja/m.png', masks:masks},
	{name:'Artifact Frame', src:'/img/frames/neo/ninja/a.png', masks:masks},
	{name:'White Power/Toughness', src:'/img/frames/neo/ninja/pt/w.png', bounds:bounds},
	{name:'Blue Power/Toughness', src:'/img/frames/neo/ninja/pt/u.png', bounds:bounds},
	{name:'Black Power/Toughness', src:'/img/frames/neo/ninja/pt/b.png', bounds:bounds},
	{name:'Red Power/Toughness', src:'/img/frames/neo/ninja/pt/r.png', bounds:bounds},
	{name:'Green Power/Toughness', src:'/img/frames/neo/ninja/pt/g.png', bounds:bounds},
	{name:'Multicolored Power/Toughness', src:'/img/frames/neo/ninja/pt/m.png', bounds:bounds},
	{name:'Artifact Power/Toughness', src:'/img/frames/neo/ninja/pt/a.png', bounds:bounds},
	{name:'White Legend Crown', src:'/img/frames/neo/ninja/crown/w.png', bounds:bounds2},
	{name:'Blue Legend Crown', src:'/img/frames/neo/ninja/crown/u.png', bounds:bounds2},
	{name:'Black Legend Crown', src:'/img/frames/neo/ninja/crown/b.png', bounds:bounds2},
	{name:'Red Legend Crown', src:'/img/frames/neo/ninja/crown/r.png', bounds:bounds2},
	{name:'Green Legend Crown', src:'/img/frames/neo/ninja/crown/g.png', bounds:bounds2},
	{name:'Multicolored Legend Crown', src:'/img/frames/neo/ninja/crown/m.png', bounds:bounds2},
	{name:'Artifact Legend Crown', src:'/img/frames/neo/ninja/crown/a.png', bounds:bounds2},
	{name:'Rare Stamp', src:'/img/frames/neo/stamp.png', bounds:{x:0.4554, y:0.9172, width:0.0894, height:0.0320}}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'neoNinja';
	//art bounds
	card.artBounds = {x:0.04, y:0.1129, width:0.92, height:0.442};
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
		title: {name:'Title', text:'', x:0.0854, y:0.0522, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0381, color:'white'},
		type: {name:'Type', text:'', x:0.0854, y:0.5664, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0324, color:'white'},
		rules: {name:'Rules Text', text:'', x:0.086, y:0.6281, width:0.828, height:0.2762, size:0.0362, color:'white'},
		pt: {name:'Power/Toughness', text:'', x:0.7928, y:0.8996, width:0.1367, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center', color:'white'}
	});
}
//loads available frames
loadFramePack();