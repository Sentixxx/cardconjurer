//Create objects for common properties across available frames
var masks = [{src:'/img/frames/m15/regular/m15MaskPinline.png', name:'Pinline'}, {src:'/img/frames/m15/regular/m15MaskTitle.png', name:'Title'}, {src:'/img/frames/m15/regular/m15MaskType.png', name:'Type'}, {src:'/img/frames/m15/regular/m15MaskRules.png', name:'Rules'}, {src:'/img/frames/m15/regular/m15MaskFrame.png', name:'Frame'}, {src:'/img/frames/m15/regular/m15MaskBorder.png', name:'Border'}];
var ptBounds = {x:1351/2010, y:2395/2817, width:642/2010, height:271/2817};
var stampBounds = {x:714/2010, y:2490/2817, width:630/2010, height:182/2817};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/wanted/w.png'},
	{name:'Blue Frame', src:'/img/frames/wanted/u.png'},
	{name:'Black Frame', src:'/img/frames/wanted/b.png'},
	{name:'Red Frame', src:'/img/frames/wanted/r.png'},
	{name:'Green Frame', src:'/img/frames/wanted/g.png'},
	{name:'Multicolored Frame', src:'/img/frames/wanted/m.png'},
	{name:'Artifact Frame', src:'/img/frames/wanted/a.png'},

	{name:'White Power/Toughness', src:'/img/frames/wanted/pt/w.png', bounds: ptBounds},
	{name:'Blue Power/Toughness', src:'/img/frames/wanted/pt/u.png', bounds: ptBounds},
	{name:'Black Power/Toughness', src:'/img/frames/wanted/pt/b.png', bounds: ptBounds},
	{name:'Red Power/Toughness', src:'/img/frames/wanted/pt/r.png', bounds: ptBounds},
	{name:'Green Power/Toughness', src:'/img/frames/wanted/pt/g.png', bounds: ptBounds},
	{name:'Multicolored Power/Toughness', src:'/img/frames/wanted/pt/m.png', bounds: ptBounds},
	{name:'Artifact Power/Toughness', src:'/img/frames/wanted/pt/a.png', bounds: ptBounds},

	{name:'White Holo Stamp', src:'/img/frames/wanted/stamp/w.png', bounds: stampBounds},
	{name:'Blue Holo Stamp', src:'/img/frames/wanted/stamp/u.png', bounds: stampBounds},
	{name:'Black Holo Stamp', src:'/img/frames/wanted/stamp/b.png', bounds: stampBounds},
	{name:'Red Holo Stamp', src:'/img/frames/wanted/stamp/r.png', bounds: stampBounds},
	{name:'Green Holo Stamp', src:'/img/frames/wanted/stamp/g.png', bounds: stampBounds},
	{name:'Multicolored Holo Stamp', src:'/img/frames/wanted/stamp/m.png', bounds: stampBounds},
	{name:'Artifact Holo Stamp', src:'/img/frames/wanted/stamp/a.png', bounds: stampBounds}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'wanted';

	card.bottomInfoColor = 'black';
	card.hideBottomInfoBorder = true;
	setBottomInfoStyle();

	loadScript('/js/frames/manaSymbolsWanted.js');
	//art bounds
	card.artBounds = {x:215/2010, y:652/2817, width:1581/2010, height:1067/2817};
	autoFitArt();
	//set symbol bounds
	//1641,1725
	card.setSymbolBounds = {x:1860/2010, y:1782/2814, width:0.12, height:0.0410, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.5, y:0.7762, width:0.75, height:0.2305};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', size:95/2010, manaCost:true, manaPrefix:'wanted', vertical:true, noVerticalCenter:true, manaPlacement: {x:[1813/2010, 1813/2010, 1813/2010, 1813/2010, 1813/2010, 1813/2010], y:[626/2817, 733/2817, 840/2817, 947/2817, 1054/2817, 1161/2817]}},
		title: {name:'Title', text:'', x:61/2010, y:254/2817, width:1889/2010, height:175/2817, oneLine:true, font:'davisonamericana', size:175/2187, color:'#523c29', allCaps: true, align:'center'},
		subtitle: {name:'Subtitle', text:'', x:61/2010, y:445/2817, width:1889/2010, height:92/2817, oneLine:true, font:'davisonamericana', size:92/2187, color:'#523c29', allCaps: true, align:'center'},
		type: {name:'Type', text:'', x:151/2010, y:1760/2817, width:1490/2010, height:70/2817, oneLine:true, font:'officina', size:76/2817, color:'#523c29', allCaps: true},
		rules: {name:'Rules Text', text:'', x:155/2010, y:1857/2817, width:1703/2010, height:678/2817, size:0.0362, font:'decour', size:81/2187},
		pt: {name:'Power/Toughness', text:'', x:0.7928, y:2530/2817, width:0.1367, height:0.0372, size:0.0372, font:'arialblack', oneLine:true, align:'center', color:'#523c29'}
	});
}
//loads available frames
loadFramePack();