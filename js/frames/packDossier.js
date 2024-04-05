//Create objects for common properties across available frames
var masks = [];
var crownBounds = {x:33/2010, y:0, width:1790/2010, height:419/2814};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/dossier/w.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/dossier/u.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/dossier/b.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/dossier/r.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/dossier/g.png', masks:masks},
	{name:'Multicolor Frame', src:'/img/frames/dossier/m.png', masks:masks},
	{name:'Artifact Frame', src:'/img/frames/dossier/a.png', masks:masks},

	{name:'Power/Toughness Box', src:'/img/frames/dossier/pt.png', bounds:{x: 1538/2010, y:2468/2814, width: 392/2010, height: 195/2814}},

	{name:'White Legendary Crown', src:'/img/frames/dossier/crown/w.png', bounds: crownBounds},
	{name:'Blue Legendary Crown', src:'/img/frames/dossier/crown/u.png', bounds: crownBounds},
	{name:'Black Legendary Crown', src:'/img/frames/dossier/crown/b.png', bounds: crownBounds},
	{name:'Red Legendary Crown', src:'/img/frames/dossier/crown/r.png', bounds: crownBounds},
	{name:'Green Legendary Crown', src:'/img/frames/dossier/crown/g.png', bounds: crownBounds},
	{name:'Multicolor Legendary Crown', src:'/img/frames/dossier/crown/m.png', bounds: crownBounds},
	{name:'Artifact Legendary Crown', src:'/img/frames/dossier/crown/a.png', bounds: crownBounds},

	{name:'Holo Stamp', src:'/img/frames/dossier/stamp.png', bounds: {x:857/2010, y:2540/2814, width:295/2010, height:134/2814}}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	// notify("To change the color of your mana cost, use {manacolor#}, but replace '#' with your desired color. 'white', 'blue', 'black', 'red', and 'green', as well as hex/html color codes are currently supported.", 15)
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'dossier';
	loadScript('/js/frames/manaSymbolsOutlineAlt.js');
	//art bounds
	card.artBounds = {x:103/2010, y:365/2814, width:1766/2010, height:1149/2814};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:1829/2010, y:0.5910, width:0.12, height:0.0410, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.5, y:0.7762, width:0.75, height:0.2305};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', y:0.0613, width:1804/2010, height:71/2100, oneLine:true, size:71/1638, align:'right', manaCost:true, rotation: 1, manaSpacing:-0.0008, manaPrefix:'outlineAlt'},
		title: {name:'Title', text:'', x:0.0854, y:132/2814, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0381, rotation: 1},
		type: {name:'Type', text:'', x:0.0854, y:0.5664, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0324, rotation: -0.5},
		rules: {name:'Rules Text', text:'', x:0.086, y:0.6303, width:0.828, height:0.2875, size:0.0362, font:'specialelite'},
		pt: {name:'Power/Toughness', text:'', x:0.7928, y:2534/2814, width:0.1367, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center', rotation: -2.5}
	});
}
//loads available frames
loadFramePack();