//Create objects for common properties across available frames
// var masks = [{src:'/img/frames/m15/regular/m15MaskPinline.png', name:'Pinline'}, {src:'/img/frames/m15/regular/m15MaskTitle.png', name:'Title'}, {src:'/img/frames/m15/regular/m15MaskType.png', name:'Type'}, {src:'/img/frames/m15/regular/m15MaskRules.png', name:'Rules'}, {src:'/img/frames/m15/regular/m15MaskFrame.png', name:'Frame'}, {src:'/img/frames/m15/regular/m15MaskBorder.png', name:'Border'}];
var masks = [{src:'/img/frames/custom/pokemon/border.png', name:'Border'}, {src:'/img/frames/custom/pokemon/background.png', name:'Background'}];
var boomerangMasks = [{src:'/img/frames/custom/pokemon/boomerangs/div.png', name:'Divider'}, {src:'/img/frames/custom/pokemon/boomerangs/left.png', name:'Left'}, {src:'/img/frames/custom/pokemon/boomerangs/right.png', name:'Right'}];
// var bounds = {x:0.7573, y:0.8848, width:0.188, height:0.0733};
//defines available frames
availableFrames = [
	{name: 'Psychic Frame', src:'/img/frames/custom/pokemon/psychic.png', masks:masks},
	{name: 'Water Frame', src:'/img/frames/custom/pokemon/water.png', masks:masks},
	{name: 'Lightning Frame', src:'/img/frames/custom/pokemon/lightning.png', masks:masks},
	{name: 'Metal Frame', src:'/img/frames/custom/pokemon/metal.png', masks:masks},
	{name: 'Fighting Frame', src:'/img/frames/custom/pokemon/fighting.png', masks:masks},
	{name: 'Fire Frame', src:'/img/frames/custom/pokemon/fire.png', masks:masks},
	{name: 'Grass Frame', src:'/img/frames/custom/pokemon/grass.png', masks:masks},
	{name: 'Colorless Frame', src:'/img/frames/custom/pokemon/colorless.png', masks:masks},
	{name: 'Darkness Frame', src:'/img/frames/custom/pokemon/dark.png', masks:masks},

	{name: 'Nickname Bar', src:'/img/frames/custom/pokemon/nickname.png'},
	{name: 'Nickname Bar 2', src:'/img/frames/custom/pokemon/nickname2.png'},
	{name: 'Nickname Bar 3', src:'/img/frames/custom/pokemon/nickname3.png'},

	{name: 'Psychic Boomerangs', src:'/img/frames/custom/pokemon/boomerangs/psychic.png', masks:boomerangMasks},
	{name: 'Water Boomerangs', src:'/img/frames/custom/pokemon/boomerangs/water.png', masks:boomerangMasks},
	{name: 'Lightning Boomerangs', src:'/img/frames/custom/pokemon/boomerangs/lightning.png', masks:boomerangMasks},
	{name: 'Metal Boomerangs', src:'/img/frames/custom/pokemon/boomerangs/metal.png', masks:boomerangMasks},
	{name: 'Fighting Boomerangs', src:'/img/frames/custom/pokemon/boomerangs/fighting.png', masks:boomerangMasks},
	{name: 'Fire Boomerangs', src:'/img/frames/custom/pokemon/boomerangs/fire.png', masks:boomerangMasks},
	{name: 'Grass Boomerangs', src:'/img/frames/custom/pokemon/boomerangs/grass.png', masks:boomerangMasks},
	{name: 'Colorless Boomerangs', src:'/img/frames/custom/pokemon/boomerangs/colorless.png', masks:boomerangMasks},
	{name: 'Darkness Boomerangs', src:'/img/frames/custom/pokemon/boomerangs/dark.png', masks:boomerangMasks}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'pokemon';
	loadScript('/js/frames/manaSymbolsPokemon.js');
	notify('Use the separate text entry for noncreature cards in order for the text to be spaced differently');
	notify('Try making keyword abilities bold using {bold}!');
	//art bounds
	card.artBounds = {x:172/1500, y:259/2100, width:1156/1500, height:819/2100};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:1356/1500, y:1140/2100, width:116/1500, height:61/2100, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.5, y:0.7762, width:0.75, height:0.2305};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', x:758/1500, y:142/2100, width:597/1500, height:102/2100, oneLine:true, size:64/1500, align:'right', manaCost:true, manaSpacing:0, manaPrefix:'pokemon'},
		title: {name:'Title', text:'', x:146/1500, y:153/2100, width:1195/1500, height:71/2100, oneLine:true, font:'gillsansbold', size:71/1500},
		nickname: {name:'Nickname', text:'', x:759/1500, y:219/2100, width:571/1500, height:44/2100, oneLine:true, font:'gillsansbolditalic', size:28/1500, align:'right'},
		type: {name:'Type', text:'', x:251/1500, y:1122/2100, width:1001/1500, height:42/2100, oneLine:true, font:'gillsansbolditalic', size:28/1500, align:'center'},
		rules: {name:'Rules Text', text:'', x:150/1500, y:1185/2100, width:1205/1500, height:629/2100, size:47/1500, font:'gillsans', manaPrefix:'pokemon'},
		rulesnoncreature: {name:'Rules Text (noncreature)', text:'', x:150/1500, y:1185/2100, width:1205/1500, height:785/2100, size:47/1500, font:'gillsans', manaPrefix:'pokemon'},
		// leftStatTitle: {name:'Left Stat Title', text:'', x:139/1500, y:1817/2100, width: 228/1500, height: 43/2100, size: 79/1500, font:'gillsansbold', align:'center'},
		middleStatTitle: {name:'Middle Stat Title', text:'power', x:629/1500, y:1817/2100, width: 228/1500, height: 43/2100, size: 79/1500, font:'gillsansbold', align:'center'},
		rightStatTitle: {name:'Right Stat Title', text:'toughness', x:1135/1500, y:1817/2100, width: 228/1500, height: 43/2100, size: 79/1500, font:'gillsansbold', align:'center'},
		// leftStat: {name:'Left Stat', text:'', x:139/1500, y:1880/2100, width: 228/1500, height: 61/2100, size: 61/1500, font:'gillsansbold', align:'center', manaPrefix:'pokemon'},
		middleStat: {name:'Middle Stat', text:'', x:585/1500, y:1872/2100, width: 300/1500, height: 102/2100, size: 79/1500, font:'gillsansbold', align:'center', manaPrefix:'pokemon'},
		pt: {name:'Right Stat', text:'', x:1098/1500, y:1872/2100, width: 300/1500, height: 102/2100, size: 79/1500, font:'gillsansbold', align:'center', manaPrefix:'pokemon'},
		// pt: {name:'Power/Toughness', text:'', x:1189/1500, y:1894/2100, width:205/1500, height:78/2100, size:61/1500, font:'gillsansbold', oneLine:true, align:'center'}
	});

	loadBottomInfo({
		top: {text:'Illus. {elemidinfo-artist}', x:85/1500, y:1969/2100, width:600/1500, height:25/2100, oneLine:true, font:'gillsansbold', size:25/1500, align:'left'},
		bottom: {text:'{elemidinfo-number} {elemidinfo-rarity}', x:1005/1500, y:1969/2100, width:411/1500, height:25/2100, oneLine:true, font:'gillsansbold', size:25/1500, align:'right'},
	});
}
//loads available frames
loadFramePack();
//Only for the main version as the webpage loads:
if (!card.text) {
	document.querySelector('#loadFrameVersion').click();
}