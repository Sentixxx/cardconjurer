//Create objects for common properties across available frames
var masks = [{src:'/img/frames/crystal/pinline.png', name:'Pinline'}, {src:'/img/frames/crystal/title.png', name:'Title'}, {src:'/img/frames/crystal/type.png', name:'Type'}, {src:'/img/frames/crystal/rules.png', name:'Rules'}, {src:'/img/frames/crystal/border.png', name:'Border'}];
var bounds = {x:1157/1500, y:1847/2100, width:294/1500, height:170/2100};
var crownBounds = {x:0, y:0, width:1, height:107/2100};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/crystal/w.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/crystal/u.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/crystal/b.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/crystal/r.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/crystal/g.png', masks:masks},
	{name:'Multicolored Frame', src:'/img/frames/crystal/m.png', masks:masks},
	{name:'Artifact Frame', src:'/img/frames/crystal/a.png', masks:masks},
	{name:'Land Frame', src:'/img/frames/crystal/l.png', masks:masks},

	{name:'White Power/Toughness', src:'/img/frames/crystal/pt/w.png', bounds:bounds},
	{name:'Blue Power/Toughness', src:'/img/frames/crystal/pt/u.png', bounds:bounds},
	{name:'Black Power/Toughness', src:'/img/frames/crystal/pt/b.png', bounds:bounds},
	{name:'Red Power/Toughness', src:'/img/frames/crystal/pt/r.png', bounds:bounds},
	{name:'Green Power/Toughness', src:'/img/frames/crystal/pt/g.png', bounds:bounds},
	{name:'Multicolored Power/Toughness', src:'/img/frames/crystal/pt/m.png', bounds:bounds},
	{name:'Artifact Power/Toughness', src:'/img/frames/crystal/pt/a.png', bounds:bounds},
	{name:'Colorless Power/Toughness', src:'/img/frames/crystal/pt/c.png', bounds:bounds},
	{name:'Land Power/Toughness', src:'/img/frames/crystal/pt/l.png', bounds:bounds},

	{name:'White Legend Crown', src:'/img/frames/crystal/crowns/w.png', bounds:crownBounds},
	{name:'Blue Legend Crown', src:'/img/frames/crystal/crowns/u.png', bounds:crownBounds},
	{name:'Black Legend Crown', src:'/img/frames/crystal/crowns/b.png', bounds:crownBounds},
	{name:'Red Legend Crown', src:'/img/frames/crystal/crowns/r.png', bounds:crownBounds},
	{name:'Green Legend Crown', src:'/img/frames/crystal/crowns/g.png', bounds:crownBounds},
	{name:'Multicolored Legend Crown', src:'/img/frames/crystal/crowns/m.png', bounds:crownBounds},
	{name:'Artifact Legend Crown', src:'/img/frames/crystal/crowns/a.png', bounds:crownBounds},
	{name:'Colorless Legend Crown', src:'/img/frames/crystal/crowns/c.png', bounds:crownBounds},
	{name:'Land Legend Crown', src:'/img/frames/crystal/crowns/l.png', bounds:crownBounds},
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	replacementMasks = {'Right Half':'img/frames/crystal/maskRightHalf.png'};
	//sets card version
	card.version = 'crystal';
	//art bounds
	card.artBounds = {x:0, y:0, width:1, height:0.9224};
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
		rules: {name:'Rules Text', text:'', x:142/1500, y:1342/2100, width:1207/1500, height:573/2100, size:0.0362, color:'white'},
		pt: {name:'Power/Toughness', text:'', x:1195/1500, y:1904/2100, width:218/1500, height:89/2100, size:0.0372, font:'belerenbsc', oneLine:true, align:'center', color:'white'}
	});
}
//loads available frames
loadFramePack();