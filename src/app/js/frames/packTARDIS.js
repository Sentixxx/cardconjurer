//Create objects for common properties across available frames
var masks = [];
var bounds = {x:115/1500, y:45/2100, width:1270/1500, height:450/2100};
var stampBounds = {x:662/1500, y:1909/2100, width:176/1500, height:80/2100};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/tardis/w.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/tardis/u.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/tardis/b.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/tardis/r.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/tardis/g.png', masks:masks},
	{name:'Multicolored Frame', src:'/img/frames/tardis/m.png', masks:masks},
	{name:'Artifact Frame', src:'/img/frames/tardis/a.png', masks:masks},
	{name:'Land Frame', src:'/img/frames/tardis/l.png', masks:masks},
	{name:'Power/Toughness', src:'/img/frames/tardis/pt.png', bounds:{x:1133/1500, y:1850/2100, width:299/1500, height:173/2100}},
	{name:'White Legendary Crown', src:'/img/frames/tardis/crowns/w.png', bounds:bounds},
	{name:'Blue Legendary Crown', src:'/img/frames/tardis/crowns/u.png', bounds:bounds},
	{name:'Black Legendary Crown', src:'/img/frames/tardis/crowns/b.png', bounds:bounds},
	{name:'Red Legendary Crown', src:'/img/frames/tardis/crowns/r.png', bounds:bounds},
	{name:'Green Legendary Crown', src:'/img/frames/tardis/crowns/g.png', bounds:bounds},
	{name:'Multicolored Legendary Crown', src:'/img/frames/tardis/crowns/m.png', bounds:bounds},
	{name:'Artifact Legendary Crown', src:'/img/frames/tardis/crowns/a.png', bounds:bounds},
	{name:'Land Legendary Crown', src:'/img/frames/tardis/crowns/l.png', bounds:bounds},
	{name:'Gold Holo Stamp', src: '/img/frames/tardis/stamp.png', bounds:stampBounds},
	{name:'Gray Holo Stamp', src: '/img/frames/tardis/grayStamp.png', bounds:stampBounds}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'tardis';
	card.showsFlavorBar = false;
	//art bounds
	card.artBounds = {x:115/1500, y:264/2100, width:1271/1500, height:898/2100};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:1337/1500, y:1241/2100, width:86/1500, height:86/2100, vertical:'center', horizontal: 'center'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.5, y:0.7762, width:0.75, height:0.2305};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', y:131/2100, width:1390/1500, height:71/2100, oneLine:true, size:71/1638, align:'right', manaCost:true, manaSpacing:0},
		title: {name:'Title', text:'', x:0.0854, y:111/2100, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:79/2100, font:'gillsans', color:'white', allCaps:true},
		type: {name:'Type', text:'', x:0.0854, y:0.5664, width:1113/1500, height:0.0543, oneLine:true, font:'belerenb', size:0.0324, font:'gillsans', color:'white', allCaps:true},
		rules: {name:'Rules Text', text:'', x:129/1500, y:1337/2100, width:1242/1500, height:578/2100, size:0.0362, color:'white'},
		pt: {name:'Power/Toughness', text:'', x:1193/1500, y:1891/2100, width:195/1500, height:78/2100, size:0.0372, font:'belerenbsc', oneLine:true, align:'center', color:'white'}
	});
}
//loads available frames
loadFramePack();
//Only for the main version as the webpage loads:
if (!card.text) {
	document.querySelector('#loadFrameVersion').click();
}