//Create objects for common properties across available frames
var masks = [];
var ptBounds = {x:1507/2010, y:2464/2814, width:406/2010, height:200/2814};
var crownBounds = {x:4/2010, y:2/2814, width:1965/2010, height:72/2814};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/breakingNews/w.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/breakingNews/u.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/breakingNews/b.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/breakingNews/r.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/breakingNews/g.png', masks:masks},
	{name:'Multicolored Frame', src:'/img/frames/breakingNews/m.png', masks:masks},
	{name:'Artifact Frame', src:'/img/frames/breakingNews/a.png', masks:masks},
	{name:'Land Frame', src:'/img/frames/breakingNews/l.png', masks:masks},

	{name:'White Power/Toughness Box', src:'/img/frames/breakingNews/pt/w.png', bounds:ptBounds},
	{name:'Blue Power/Toughness Box', src:'/img/frames/breakingNews/pt/u.png', bounds:ptBounds},
	{name:'Black Power/Toughness Box', src:'/img/frames/breakingNews/pt/b.png', bounds:ptBounds},
	{name:'Red Power/Toughness Box', src:'/img/frames/breakingNews/pt/r.png', bounds:ptBounds},
	{name:'Green Power/Toughness Box', src:'/img/frames/breakingNews/pt/g.png', bounds:ptBounds},
	{name:'Multicolored Power/Toughness Box', src:'/img/frames/breakingNews/pt/m.png', bounds:ptBounds},
	{name:'Artifact Power/Toughness Box', src:'/img/frames/breakingNews/pt/a.png', bounds:ptBounds},

	{name:'White Legendary Crown', src:'/img/frames/breakingNews/crown/w.png', bounds:crownBounds},
	{name:'Blue Legendary Crown', src:'/img/frames/breakingNews/crown/u.png', bounds:crownBounds},
	{name:'Black Legendary Crown', src:'/img/frames/breakingNews/crown/b.png', bounds:crownBounds},
	{name:'Red Legendary Crown', src:'/img/frames/breakingNews/crown/r.png', bounds:crownBounds},
	{name:'Green Legendary Crown', src:'/img/frames/breakingNews/crown/g.png', bounds:crownBounds},
	{name:'Multicolored Legendary Crown', src:'/img/frames/breakingNews/crown/m.png', bounds:crownBounds},
	{name:'Artifact Legendary Crown', src:'/img/frames/breakingNews/crown/a.png', bounds:crownBounds},
	{name:'Land Legendary Crown', src:'/img/frames/breakingNews/crown/l.png', bounds:crownBounds},

	{name:'Holo Stamp', src:'/img/frames/breakingNews/stamp.png', bounds:{x:781/2010, y:2555/2814, width:447/2010, height:116/2814}}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'breakingNews';

	card.hideBottomInfoBorder = true;

	loadScript('/js/frames/manaSymbolsBreakingNews.js');

	//art bounds
	card.artBounds = {x:106/2010, y:479/2814, width:1802/2010, height:1135/2814};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:1851/2010, y:1734/2814, width:0.12, height:0.0410, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.5, y:0.7762, width:0.75, height:0.2305};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', x:1442/2010, y:113/2814, width:449/2010, height:71/2100, oneLine:true, size:71/1638, align:'right', manaCost:true, manaSpacing:0, manaPrefix:'breakingNews'},
		title: {name:'Title', text:'', x:258/2010, y:294/2814, width:1494/2010, height:112/2814, oneLine:true, font:'saloongirl', size:128/2010, allCaps:true, align:'center', color:'#332e2e'},
		type: {name:'Type', text:'', x:0.0854, y:1700/2814, width:0.8292, height:76/2814, oneLine:true, font:'saloongirl', size:130/2814, allCaps:true, color:'#332e2e'},
		rules: {name:'Rules Text', text:'', x:0.086, y:1841/2814, width:0.828, height:698/2814, size:0.0362},
		pt: {name:'Power/Toughness', text:'', x:1599/2010, y:2529/2814, width:0.1367, height:0.0372, size:99/2010, font:'saloongirl', oneLine:true, align:'center', color:'#332e2e'}
	});
}
//loads available frames
loadFramePack();