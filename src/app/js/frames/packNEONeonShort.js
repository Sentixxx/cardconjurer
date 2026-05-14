//Create objects for common properties across available frames
var masks = [{src:'/img/frames/neo/neon/short/frame.svg', name:'Frame'}];
var bounds = {x:0.7627, y:0.8886, width:0.1967, height:0.06};
var bounds2 = {x:0.1567, y:0.021, width:0.6867, height:0.0486};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/neo/neon/short/w.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/neo/neon/short/u.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/neo/neon/short/b.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/neo/neon/short/r.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/neo/neon/short/g.png', masks:masks},
	{name:'Multicolored Frame', src:'/img/frames/neo/neon/short/m.png', masks:masks},
	{name:'Artifact Frame', src:'/img/frames/neo/neon/short/a.png', masks:masks},
	{name:'Vehicle Frame', src:'/img/frames/neo/neon/short/v.png', masks:masks},
	{name:'White Power/Toughness', src:'/img/frames/neo/neon/pt/w.png', bounds:bounds},
	{name:'Blue Power/Toughness', src:'/img/frames/neo/neon/pt/u.png', bounds:bounds},
	{name:'Black Power/Toughness', src:'/img/frames/neo/neon/pt/b.png', bounds:bounds},
	{name:'Red Power/Toughness', src:'/img/frames/neo/neon/pt/r.png', bounds:bounds},
	{name:'Green Power/Toughness', src:'/img/frames/neo/neon/pt/g.png', bounds:bounds},
	{name:'Multicolored Power/Toughness', src:'/img/frames/neo/neon/pt/m.png', bounds:bounds},
	{name:'Artifact Power/Toughness', src:'/img/frames/neo/neon/pt/a.png', bounds:bounds},
	{name:'Vehicle Power/Toughness', src:'/img/frames/neo/neon/pt/v.png', bounds:bounds},
	{name:'White Legend Crown', src:'/img/frames/neo/neon/crown/w.png', bounds:bounds2},
	{name:'Blue Legend Crown', src:'/img/frames/neo/neon/crown/u.png', bounds:bounds2},
	{name:'Black Legend Crown', src:'/img/frames/neo/neon/crown/b.png', bounds:bounds2},
	{name:'Red Legend Crown', src:'/img/frames/neo/neon/crown/r.png', bounds:bounds2},
	{name:'Green Legend Crown', src:'/img/frames/neo/neon/crown/g.png', bounds:bounds2},
	{name:'Multicolored Legend Crown', src:'/img/frames/neo/neon/crown/m.png', bounds:bounds2},
	{name:'Artifact Legend Crown', src:'/img/frames/neo/neon/crown/a.png', bounds:bounds2},
	{name:'Rare Stamp', src:'/img/frames/neo/stamp.png', bounds:{x:0.4554, y:0.9172, width:0.0894, height:0.0320}}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'neoNeonShort';
	//art bounds
	card.artBounds = {x:0.0367, y:0.0643, width:0.9267, height:0.8548};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:0.9213, y:0.7272, width:0.12, height:0.0410, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.5, y:0.8415, width:0.75, height:0.1115};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', y:0.0613, width:0.9292, height:71/2100, oneLine:true, size:71/1638, align:'right', shadowX:-0.001, shadowY:0.0029, manaCost:true, manaSpacing:0},
		title: {name:'Title', text:'', x:0.0854, y:0.0522, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0381, color:'white'},
		type: {name:'Type', text:'', x:0.0854, y:0.7024, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0324, color:'white'},
		rules: {name:'Rules Text', text:'', x:0.086, y:0.7572, width:0.828, height:0.1543, size:0.0362, color:'white'},
		pt: {name:'Power/Toughness', text:'', x:0.7928, y:0.902, width:0.1367, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center', color:'white'}
	});
}
//loads available frames
loadFramePack();