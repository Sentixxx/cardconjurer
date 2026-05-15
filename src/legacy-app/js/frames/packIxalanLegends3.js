//Create objects for common properties across available frames
var ptBounds = {x:1507/2010, y:2488/2814, width:418/2010, height:208/2814};
var crownBounds = {x:159/2010, y:52/2814, width:1694/2010, height:83/2814};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/ixalanLegends/w3.png'},
	{name:'Blue Frame', src:'/img/frames/ixalanLegends/u3.png'},
	{name:'Black Frame', src:'/img/frames/ixalanLegends/b3.png'},
	{name:'Red Frame', src:'/img/frames/ixalanLegends/r3.png'},
	{name:'Green Frame', src:'/img/frames/ixalanLegends/g3.png'},
	{name:'Multicolored Frame', src:'/img/frames/ixalanLegends/m3.png'},
	{name:'Artifact Frame', src:'/img/frames/ixalanLegends/a3.png'},
	{name:'Land Frame', src:'/img/frames/ixalanLegends/l3.png'},

	{name:'White Power/Toughness', src:'/img/frames/ixalanLegends/pt/w.png', bounds: ptBounds},
	{name:'Blue Power/Toughness', src:'/img/frames/ixalanLegends/pt/u.png', bounds: ptBounds},
	{name:'Black Power/Toughness', src:'/img/frames/ixalanLegends/pt/b.png', bounds: ptBounds},
	{name:'Red Power/Toughness', src:'/img/frames/ixalanLegends/pt/r.png', bounds: ptBounds},
	{name:'Green Power/Toughness', src:'/img/frames/ixalanLegends/pt/g.png', bounds: ptBounds},
	{name:'Multicolored Power/Toughness', src:'/img/frames/ixalanLegends/pt/m.png', bounds: ptBounds},
	{name:'Artifact Power/Toughness', src:'/img/frames/ixalanLegends/pt/a.png', bounds: ptBounds},
	{name:'Land Power/Toughness', src:'/img/frames/ixalanLegends/pt/l.png', bounds: ptBounds},

	{name:'White Legendary Crown', src:'/img/frames/ixalanLegends/crown/w.png', bounds: crownBounds},
	{name:'Blue Legendary Crown', src:'/img/frames/ixalanLegends/crown/u.png', bounds: crownBounds},
	{name:'Black Legendary Crown', src:'/img/frames/ixalanLegends/crown/b.png', bounds: crownBounds},
	{name:'Red Legendary Crown', src:'/img/frames/ixalanLegends/crown/r.png', bounds: crownBounds},
	{name:'Green Legendary Crown', src:'/img/frames/ixalanLegends/crown/g.png', bounds: crownBounds},
	{name:'Multicolored Legendary Crown', src:'/img/frames/ixalanLegends/crown/m.png', bounds: crownBounds},
	{name:'Artifact Legendary Crown', src:'/img/frames/ixalanLegends/crown/a.png', bounds: crownBounds},
	{name:'Land Legendary Crown', src:'/img/frames/ixalanLegends/crown/l.png', bounds: crownBounds}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'ixalanLegends';
	//art bounds
	card.artBounds = {x:128/2010, y:323/2814, width:1759/2010, height:1239/2814};
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
		title: {name:'Title', text:'', x:0.0854, y:0.0522, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0381},
		type: {name:'Type', text:'', x:0.0854, y:0.5664, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0324},
		rules: {name:'Rules Text', text:'', x:0.086, y:0.6303, width:0.828, height:0.2875, size:0.0362},
		pt: {name:'Power/Toughness', text:'', x:0.7928, y:0.902, width:0.1367, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center'}
	});
}
//loads available frames
loadFramePack();
//Only for the main version as the webpage loads:
if (!card.text) {
	document.querySelector('#loadFrameVersion').click();
}