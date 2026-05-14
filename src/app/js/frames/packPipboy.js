//Create objects for common properties across available frames
var masks = [{src:'/img/frames/m15/regular/m15MaskPinline.png', name:'Pinline'}, {src:'/img/frames/m15/regular/m15MaskTitle.png', name:'Title'}, {src:'/img/frames/m15/regular/m15MaskType.png', name:'Type'}, {src:'/img/frames/m15/regular/m15MaskRules.png', name:'Rules'}, {src:'/img/frames/m15/regular/m15MaskFrame.png', name:'Frame'}, {src:'/img/frames/m15/regular/m15MaskBorder.png', name:'Border'}];
var bounds = {x:157/2010, y:362/2814, width:1697/2010, height:1152/2814};
var crownBounds = {x:41/2010, y:39/2814, width:1794/2010, height:143/2814};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/pipboy/w.png'},
	{name:'Blue Frame', src:'/img/frames/pipboy/u.png'},
	{name:'Black Frame', src:'/img/frames/pipboy/b.png'},
	{name:'Red Frame', src:'/img/frames/pipboy/r.png'},
	{name:'Green Frame', src:'/img/frames/pipboy/g.png'},
	{name:'Multicolored Frame', src:'/img/frames/pipboy/m.png'},
	{name:'Artifact Frame', src:'/img/frames/pipboy/a.png'},

	{name:'Power/Toughness Box', src: '/img/frames/pipboy/pt.png', bounds:{x:1515/2010, y:2034/2814, width:461/2010, height:639/2814}},

	{name:'White Legend Crown', src:'/img/frames/pipboy/crown/w.png', bounds: crownBounds},
	{name:'Blue Legend Crown', src:'/img/frames/pipboy/crown/u.png', bounds: crownBounds},
	{name:'Black Legend Crown', src:'/img/frames/pipboy/crown/b.png', bounds: crownBounds},
	{name:'Red Legend Crown', src:'/img/frames/pipboy/crown/r.png', bounds: crownBounds},
	{name:'Green Legend Crown', src:'/img/frames/pipboy/crown/g.png', bounds: crownBounds},
	{name:'Multicolored Legend Crown', src:'/img/frames/pipboy/crown/m.png', bounds: crownBounds},
	{name:'Artifact Legend Crown', src:'/img/frames/pipboy/crown/a.png', bounds: crownBounds},

	{name:'Gold Holo Stamp', src: '/img/frames/pipboy/stamp.png', bounds: {x:849/2010, y:2513/2814, width:312/2010, height: 188/2814}},
	{name:'Gray Holo Stamp', src: '/img/frames/pipboy/stampGray.png', bounds: {x:849/2010, y:2513/2814, width:312/2010, height: 188/2814}},

	{name:'Nickname Overlay', src: '/img/frames/pipboy/nickname.png', complementary: 18},
	{name:'Screen Cover', src: '/img/frames/pipboy/cover.png', erase: true}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	replacementMasks = {'Right Half':'/img/frames/pipboy/maskRight.png'};
	//sets card version
	card.version = 'pipboy';
	//art bounds
	card.artBounds = bounds;
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
		title: {name:'Title', text:'', x:0.0854, y:0.0522, width:0.8292, height:0.0543, oneLine:true, font:'ocra', size:89/2814, kerning:-0.0074, color:'white'},
		nickname: {name:'Nickname', text:'', x:0.14, y:335/2814, width:0.72, height:50/2814, oneLine:true, font:'neosansitalic', size:61/2814, color:'white', align:'center'},
		type: {name:'Type', text:'', x:0.0854, y:0.5664, width:0.8292, height:0.0543, oneLine:true, font:'neosans', size:82/2814, color:'white'},
		rules: {name:'Rules Text', text:'', x:207/2010, y:1815/2814, width:1596/2010, height:729/2814, size:76/2814, font:'neosans', color:'white'},
		pt: {name:'Power/Toughness', text:'', x:0.7928, y:0.902, width:0.1367, height:0.0372, size:0.0372, font:'ocra', oneLine:true, align:'center', color:'white'}
	});
}
//loads available frames
loadFramePack();