//Create objects for common properties across available frames
var masks = [{src:'/img/frames/neo/samurai/frame.svg', name:'Frame'}, {src:'/img/frames/neo/samurai/frame2.svg', name:'Rules & Accents'}];
var bounds = {x:0.7634, y:0.8858, width:0.1954, height:0.0677};
var bounds2 = {x:0.0294, y:0.0162, width:0.942, height:0.0753};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/neo/samurai/w.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/neo/samurai/u.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/neo/samurai/b.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/neo/samurai/r.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/neo/samurai/g.png', masks:masks},
	{name:'Multicolored Frame', src:'/img/frames/neo/samurai/m.png', masks:masks},
	{name:'Artifact Overlay', src:'/img/frames/neo/samurai/a.png', masks:masks},
	{name:'White Power/Toughness', src:'/img/frames/neo/samurai/pt/w.png', bounds:bounds},
	{name:'Blue Power/Toughness', src:'/img/frames/neo/samurai/pt/u.png', bounds:bounds},
	{name:'Black Power/Toughness', src:'/img/frames/neo/samurai/pt/b.png', bounds:bounds},
	{name:'Red Power/Toughness', src:'/img/frames/neo/samurai/pt/r.png', bounds:bounds},
	{name:'Green Power/Toughness', src:'/img/frames/neo/samurai/pt/g.png', bounds:bounds},
	{name:'Multicolored Power/Toughness', src:'/img/frames/neo/samurai/pt/m.png', bounds:bounds},
	{name:'White Legend Crown', src:'/img/frames/neo/samurai/crown/w.png', bounds:bounds2},
	{name:'Blue Legend Crown', src:'/img/frames/neo/samurai/crown/u.png', bounds:bounds2},
	{name:'Black Legend Crown', src:'/img/frames/neo/samurai/crown/b.png', bounds:bounds2},
	{name:'Red Legend Crown', src:'/img/frames/neo/samurai/crown/r.png', bounds:bounds2},
	{name:'Green Legend Crown', src:'/img/frames/neo/samurai/crown/g.png', bounds:bounds2},
	{name:'Multicolored Legend Crown', src:'/img/frames/neo/samurai/crown/m.png', bounds:bounds2},
	{name:'Rare Stamp', src:'/img/frames/neo/samurai/stamp.png', bounds:{x:0.4354, y:0.9072, width:0.1294, height:0.042}}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'neoSamurai';
	//art bounds
	card.artBounds = {x:0.04, y:0.1253, width:0.92, height:0.4410};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:0.916, y:0.5910, width:0.12, height:0.0410, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.5, y:0.7762, width:0.75, height:0.2305};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', y:0.0777, width:0.9292, height:71/2100, oneLine:true, size:71/1638, align:'right', shadowX:-0.001, shadowY:0.0029, manaCost:true, manaSpacing:0},
		title: {name:'Title', text:'', x:0.0854, y:0.0686, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0381, color:'white'},
		type: {name:'Type', text:'', x:0.0854, y:0.5664, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0324, color:'white'},
		rules: {name:'Rules Text', text:'', x:0.086, y:0.6303, width:0.828, height:0.2762, size:0.0362, color:'white'},
		pt: {name:'Power/Toughness', text:'', x:0.7928, y:0.9062, width:0.1367, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center', color:'white'}
	});
}
//loads available frames
loadFramePack();