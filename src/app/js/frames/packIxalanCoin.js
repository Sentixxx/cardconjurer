//Create objects for common properties across available frames
var masks = [];
var ptBounds = {x:0/1500, y:0/2100, width:1500/1500, height:2100/2100};
var crownBounds = {x:0/1500, y:0/2100, width:1500/1500, height:2100/2100};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/ixalanCoin/w.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/ixalanCoin/u.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/ixalanCoin/b.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/ixalanCoin/r.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/ixalanCoin/g.png', masks:masks},
	{name:'Multicolored Frame', src:'/img/frames/ixalanCoin/m.png', masks:masks},
	// {name:'Artifact Frame', src:'/img/frames/ixalanCoin/a.png', masks:masks},
	// {name:'Colorless Frame', src:'/img/frames/ixalanCoin/c.png', masks:masks},

	{name:'White Power/Toughness', src:'/img/frames/ixalanCoin/pt/w.png', bounds:ptBounds},
	{name:'Blue Power/Toughness', src:'/img/frames/ixalanCoin/pt/u.png', bounds:ptBounds},
	{name:'Black Power/Toughness', src:'/img/frames/ixalanCoin/pt/b.png', bounds:ptBounds},
	{name:'Red Power/Toughness', src:'/img/frames/ixalanCoin/pt/r.png', bounds:ptBounds},
	{name:'Green Power/Toughness', src:'/img/frames/ixalanCoin/pt/g.png', bounds:ptBounds},
	{name:'Multicolored Power/Toughness', src:'/img/frames/ixalanCoin/pt/m.png', bounds:ptBounds},
	// {name:'Artifact Power/Toughness', src:'/img/frames/ixalanCoin/pt/a.png', bounds:ptBounds},
	// {name:'Colorless Power/Toughness', src:'/img/frames/ixalanCoin/pt/c.png', bounds:ptBounds},

	{name:'White Legendary Crown', src:'/img/frames/ixalanCoin/crown/w.png', bounds:crownBounds},
	{name:'Blue Legendary Crown', src:'/img/frames/ixalanCoin/crown/u.png', bounds:crownBounds},
	{name:'Black Legendary Crown', src:'/img/frames/ixalanCoin/crown/b.png', bounds:crownBounds},
	{name:'Red Power/Toughness', src:'/img/frames/ixalanCoin/crown/r.png', bounds:crownBounds},
	{name:'Green Legendary Crown', src:'/img/frames/ixalanCoin/crown/g.png', bounds:crownBounds},
	{name:'Multicolored Legendary Crown', src:'/img/frames/ixalanCoin/crown/m.png', bounds:crownBounds},
	// {name:'Artifact Legendary Crown', src:'/img/frames/ixalanCoin/crown/a.png', bounds:crownBounds},
	// {name:'Colorless Legendary Crown', src:'/img/frames/ixalanCoin/crown/c.png', bounds:crownBounds},

	{name:'Coin Background', src:'/img/frames/ixalanCoin/coinCover.png'},
	{name:'Coin', src:'/img/frames/ixalanCoin/coin.png'},
	{name:'Holo Stamp', src:'/img/frames/ixalanCoin/stamp.png'}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	// notify("To change the color of your mana cost, use {manacolor#}, but replace '#' with your desired color. 'white', 'blue', 'black', 'red', and 'green', as well as hex/html color codes are currently supported.", 15)
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	replacementMasks = {'Right Half':'img/frames/ixalanCoin/maskFrame.png'};
	//sets card version
	card.version = 'ixalanCoin';
	//art bounds
	card.artBounds = {x:131/1500, y:233/2100, width:1235 /1500, height:926/2100};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:1376/1500, y:1242/2100, width:0.12, height:0.0410, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.5, y:0.7762, width:0.75, height:0.2305};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', x:-5/1500, y:131/2100, width:0.9292, height:71/2100, oneLine:true, size:71/1638, align:'right', shadowX:-0.001, shadowY:0.0029, manaCost:true, manaSpacing:0},
		title: {name:'Title', text:'', x:124/1500, y:108/2100, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0381, color:'white'},
		type: {name:'Type', text:'', x:123/1500, y:1182/2100, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0324, color:'white'},
		rules: {name:'Rules Text', text:'', x:129/1500, y:1332/2100, width:1242/1500, height:579/2100, size:0.0362, color:'white'},
		pt: {name:'Power/Toughness', text:'', x:0.7928, y:0.902, width:0.1367, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center', color:'white'}
	});
}
//loads available frames
loadFramePack();