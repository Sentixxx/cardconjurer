//Create objects for common properties across available frames
var masks = [{src:'/img/frames/pixelTMT/masks/maskTitle.png', name:'Title'}, {src:'/img/frames/pixelTMT/masks/maskType.png', name:'Type'}, {src:'/img/frames/pixelTMT/masks/maskRules.png', name:'Rules'}, {src:'/img/frames/pixelTMT/masks/maskTextBoxes.png', name:'Text Boxes'}, {src:'/img/frames/pixelTMT/masks/maskPinlines.png', name:'Full Pinlines'}, {src:'/img/frames/pixelTMT/masks/maskWhitePinlines.png', name:'White Pinlines'}, {src:'/img/frames/pixelTMT/masks/maskSingleColorPinlines.png', name:'Single Color Pinlines'}, {src:'/img/frames/pixelTMT/masks/maskDualLight.png', name:'Light Color Dual Pinlines'}, {src:'/img/frames/pixelTMT/masks/maskDualDark.png', name:'Dark Color Dual Pinlines'}, {src:'/img/frames/pixelTMT/masks/maskBorder.png', name:'Border'}];
var masks2 = [{src:'/img/frames/pixelTMT/pt/masks/maskInnerFill.png', name:'Inner Fill'}, {src:'/img/frames/pixelTMT/pt/masks/maskWhitePinline.png', name:'White Pinlines'}, {src:'/img/frames/pixelTMT/pt/masks/maskSingle.png', name:'Single Color Pinlines'}, {src:'/img/frames/pixelTMT/pt/masks/maskDualLight.png', name:'Light Color Dual Pinlines'}, {src:'/img/frames/pixelTMT/pt/masks/maskDualDark.png', name:'Dark Color Dual Pinlines'}];
var bounds = {x:1146/1500, y:1861/2100, width:274/1500, height:140/2100};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/pixelTMT/w.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/pixelTMT/u.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/pixelTMT/b.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/pixelTMT/r.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/pixelTMT/g.png', masks:masks},
	{name:'Multicolored Frame', src:'/img/frames/pixelTMT/m.png', masks:masks},
	{name:'Artifact Frame', src:'/img/frames/pixelTMT/a.png', masks:masks},
	{name:'Colorless Frame', src:'/img/frames/pixelTMT/c.png', masks:masks},
	{name:'White (Alt) Frame', src:'/img/frames/pixelTMT/wAlt.png', masks:masks},


	{name:'White Power/Toughness', src:'/img/frames/pixelTMT/pt/w.png', masks:masks2,  complementary: 'PT Cover'},
	{name:'Blue Power/Toughness', src:'/img/frames/pixelTMT/pt/u.png', masks:masks2,  complementary: 'PT Cover'},
	{name:'Black Power/Toughness', src:'/img/frames/pixelTMT/pt/b.png', masks:masks2,  complementary: 'PT Cover'},
	{name:'Red Power/Toughness', src:'/img/frames/pixelTMT/pt/r.png',masks:masks2,  complementary: 'PT Cover'},
	{name:'Green Power/Toughness', src:'/img/frames/pixelTMT/pt/g.png', masks:masks2,  complementary: 'PT Cover'},
	{name:'Multicolored Power/Toughness', src:'/img/frames/pixelTMT/pt/m.png', masks:masks2,  complementary: 'PT Cover'},
	{name:'Artifact Power/Toughness', src:'/img/frames/pixelTMT/pt/a.png', masks:masks2,  complementary: 'PT Cover'},
	{name:'Colorless Power/Toughness', src:'/img/frames/pixelTMT/pt/c.png', masks:masks2, complementary: 'PT Cover'},
	{name:'White (Alt) Power/Toughness', src:'/img/frames/pixelTMT/pt/wAlt.png', masks:masks2,  complementary: 'PT Cover'},

	{name:'The Teenage Mutant Ninja Turtles', src:'/img/frames/pixelTMT/characters/4turtle.png'},
	{name:'Leonardo', src:'/img/frames/pixelTMT/characters/leo.png'},
	{name:'Raphael', src:'/img/frames/pixelTMT/characters/raph.png'},
	{name:'Donatello', src:'/img/frames/pixelTMT/characters/don.png'},
	{name:'Michelangelo', src:'/img/frames/pixelTMT/characters/michael.png'},
	{name:'April', src:'/img/frames/pixelTMT/characters/april.png'},
	{name:'Bebop', src:'/img/frames/pixelTMT/characters/bebop.png'},
	{name:'Casey Jones', src:'/img/frames/pixelTMT/characters/casey.png'},
	{name:'Krang', src:'/img/frames/pixelTMT/characters/krang.png'},
	{name:'Mouser', src:'/img/frames/pixelTMT/characters/mouser.png'},
	{name:'Pizza', src:'/img/frames/pixelTMT/characters/pizza.png'},
	{name:'Rocksteady', src:'/img/frames/pixelTMT/characters/rocksteady.png'},
	{name:'Shredder', src:'/img/frames/pixelTMT/characters/shredder.png'},
	{name:'Splinter', src:'/img/frames/pixelTMT/characters/splinter.png'},
	{name:'Super Combo', src:'/img/frames/pixelTMT/characters/superCombo.png'},


	{name:'PT Cover', src:'/img/frames/pixelTMT/ptCover.png', erase:true}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	replacementMasks = {
		'Right Half': {src: '/img/frames/pixelTMT/masks/maskRightHalf.png', preserveAlpha: true},
		'Left Half': {src: '/img/frames/pixelTMT/masks/maskLeftHalf.png', preserveAlpha: true}
	};
	//sets card version
	card.version = 'pixelTMT';

	loadScript('/js/frames/manaSymbolsPixel.js');

	//art bounds
	card.artBounds = {x:0, y:0, width:1, height:0.9320};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:0.9213, y:0.5910, width:0.12, height:0.0460, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.5, y:0.7692, width:0.75, height:0.2305};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', y:194/2814, width:0.9292, height:71/2100, oneLine:true, size:71/1638, align:'right', manaCost:true, manaSpacing:0, manaPrefix:'pixel'},
		title: {name:'Title', text:'', x:155/2010, y:125/2814, width:1500/2010, height:220/2814, oneLine:true, font:'PixelFont-Regular', size:0.0480, allCaps:true, color:'white'},
		type: {name:'Type', text:'', x:155/2010, y:0.5664, width:1489/2010, height:0.0543, oneLine:true, font:'PixelFont-Regular', size:0.0400, allCaps:true, color:'white'},
		rules: {name:'Rules Text', text:'', x:155/2010, y:1810/2814, width:1710/2010, height:690/2814, size:0.0362, font:'PixelFont-Regular', color:'white'},
		pt: {name:'Power/Toughness', text:'', x:1641/2010, y:2454/2814, width:0.1367, height:0.0372, size:0.0430, font:'PixelFont-Regular', oneLine:true, align:'center', color:'white'}
	});
}
//loads available frames
loadFramePack();