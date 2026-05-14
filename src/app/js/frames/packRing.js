//Create objects for common properties across available frames
var masks = [{src:'/img/frames/lotr/title.png', name:'Title'}, {src:'/img/frames/lotr/type.png', name:'Type'}, {src:'/img/frames/lotr/rules.png', name:'Rules'}, {src:'/img/frames/lotr/border.png', name:'Border'}];
var ptBounds = {x:1148/1500, y:1857/2100, width:268/1500, height:134/2100};
var crownBounds = {x:0/1500, y:0/2100, width:1500/1500, height:272/2100};
var stampBounds = {x:644/1500, y:1893/2100, width:212/1500, height:95/2100};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/lotr/w.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/lotr/u.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/lotr/b.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/lotr/r.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/lotr/g.png', masks:masks},
	{name:'Multicolored Frame', src:'/img/frames/lotr/m.png', masks:masks},
	{name:'Artifact Frame', src:'/img/frames/lotr/a.png', masks:masks},
	{name:'Land Frame', src:'/img/frames/lotr/l.png', masks:masks},

	{name:'White Power/Toughness', src:'/img/frames/lotr/pt/w.png', bounds:ptBounds},
	{name:'Blue Power/Toughness', src:'/img/frames/lotr/pt/u.png', bounds:ptBounds},
	{name:'Black Power/Toughness', src:'/img/frames/lotr/pt/b.png', bounds:ptBounds},
	{name:'Red Power/Toughness', src:'/img/frames/lotr/pt/r.png', bounds:ptBounds},
	{name:'Green Power/Toughness', src:'/img/frames/lotr/pt/g.png', bounds:ptBounds},
	{name:'Multicolored Power/Toughness', src:'/img/frames/lotr/pt/m.png', bounds:ptBounds},
	{name:'Artifact Power/Toughness', src:'/img/frames/lotr/pt/a.png', bounds:ptBounds},
	{name:'Land Power/Toughness', src:'/img/frames/lotr/pt/l.png', bounds:ptBounds},

	{name:'White Legendary Crown', src:'/img/frames/lotr/crown/w.png', bounds:crownBounds},
	{name:'Blue Legendary Crown', src:'/img/frames/lotr/crown/u.png', bounds:crownBounds},
	{name:'Black Legendary Crown', src:'/img/frames/lotr/crown/b.png', bounds:crownBounds},
	{name:'Red Legendary Crown', src:'/img/frames/lotr/crown/r.png', bounds:crownBounds},
	{name:'Green Legendary Crown', src:'/img/frames/lotr/crown/g.png', bounds:crownBounds},
	{name:'Multicolored Legendary Crown', src:'/img/frames/lotr/crown/m.png', bounds:crownBounds},
	{name:'Artifact Legendary Crown', src:'/img/frames/lotr/crown/a.png', bounds:crownBounds},
	{name:'Land Legendary Crown', src:'/img/frames/lotr/crown/l.png', bounds:crownBounds},

	{name:'White Holo Stamp', src:'/img/frames/lotr/stamp/w.png', bounds:stampBounds},
	{name:'Blue Holo Stamp', src:'/img/frames/lotr/stamp/u.png', bounds:stampBounds},
	{name:'Black Holo Stamp', src:'/img/frames/lotr/stamp/b.png', bounds:stampBounds},
	{name:'Red Holo Stamp', src:'/img/frames/lotr/stamp/r.png', bounds:stampBounds},
	{name:'Green Holo Stamp', src:'/img/frames/lotr/stamp/g.png', bounds:stampBounds},
	{name:'Multicolored Holo Stamp', src:'/img/frames/lotr/stamp/m.png', bounds:stampBounds},
	{name:'Artifact Holo Stamp', src:'/img/frames/lotr/stamp/a.png', bounds:stampBounds},
	{name:'Land Holo Stamp', src:'/img/frames/lotr/stamp/l.png', bounds:stampBounds},
	{name:'Gray Holo Stamp', src:'/img/frames/lotr/stamp/gray.png', bounds:stampBounds},
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	// notify("To change the color of your mana cost, use {manacolor#}, but replace '#' with your desired color. 'white', 'blue', 'black', 'red', and 'green', as well as hex/html color codes are currently supported.", 15)
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	replacementMasks = {'Right Half':'img/frames/lotr/maskRightHalf.png'};
	//sets card version
	card.version = 'ring';
	//art bounds
	card.artBounds = {x:149/1500, y:252/2100, width:1202/1500, height:918/2100};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:1376/1500, y:1242/2100, width:0.12, height:0.0410, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.5, y:0.7762, width:0.75, height:0.2305};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', y:143/2100, width:1384/1500, height:71/2100, oneLine:true, size:71/1638, align:'right', shadowX:-0.001, shadowY:0.0029, manaCost:true, manaSpacing:0},
		title: {name:'Title', text:'', x:0.0854, y:120/2100, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0381, color:'white'},
		type: {name:'Type', text:'', x:0.0854, y:0.5664, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0324, color:'white'},
		rules: {name:'Rules Text', text:'', x:0.086, y:0.6303, width:0.828, height:0.2875, size:0.0362},
		pt: {name:'Power/Toughness', text:'', x:1184/1500, y:1887/2100, width:0.1367, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center', color:'white'}
	});
}
//loads available frames
loadFramePack();