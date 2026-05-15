//Create objects for common properties across available frames
var masks = [{src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/planeswalker/extended/masks/maskPinlines.png', name:'Pinlines'}, {src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/planeswalker/extended/masks/maskTitle.png', name:'Title'}, {src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/planeswalker/extended/masks/maskLowerFrame.png', name:'Lower Frame'}, {src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/planeswalker/extended/masks/maskLegendary.png', name:'Legendary'}, {src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/planeswalker/extended/masks/maskFloating.png', name:'Floating'}, {src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/planeswalker/extended/masks/maskBorder.png', name:'Border'}];
var masks2 = [{src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/crowns/maskPinlines.png', name:'Pinlines'}];
var masks3 = [{src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/planeswalker/extended/masks/maskOverlayLegendary.png', name:'Legendary'}];
var bounds = {x:0, y:0, width:1, height:1};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/planeswalker/extended/w.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/planeswalker/extended/u.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/planeswalker/extended/b.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/planeswalker/extended/r.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/planeswalker/extended/g.png', masks:masks},
	{name:'Multicolored Frame', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/planeswalker/extended/m.png', masks:masks},
	{name:'Colorless Frame', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/planeswalker/extended/c.png', masks:masks},
	{name:'Gold Inlay', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/planeswalker/extended/gold.png', masks:masks3},
	{name:'Nyx Inlay', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/planeswalker/extended/nyx.png', masks:masks3},
	
	{name:'White Loyalty Badge', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/planeswalker/loyalty/w.png', bounds:bounds},
	{name:'Blue Loyalty Badge', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/planeswalker/loyalty/u.png', bounds:bounds},
	{name:'Black Loyalty Badge', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/planeswalker/loyalty/b.png', bounds:bounds},
	{name:'Red Loyalty Badge', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/planeswalker/loyalty/r.png', bounds:bounds},
	{name:'Green Loyalty Badge', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/planeswalker/loyalty/g.png', bounds:bounds},
	{name:'Multicolored Loyalty Badge', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/planeswalker/loyalty/m.png', bounds:bounds},
	{name:'Colorless Loyalty Badge', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/planeswalker/loyalty/c.png', bounds:bounds},
	
	{name:'White Crown', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/crowns/w.png', bounds:bounds, masks:masks2, complementary:25},
	{name:'Blue Crown', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/crowns/u.png', bounds:bounds, masks:masks2, complementary:25},
	{name:'Black Crown', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/crowns/b.png', bounds:bounds, masks:masks2, complementary:25},
	{name:'Red Crown', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/crowns/r.png', bounds:bounds, masks:masks2, complementary:25},
	{name:'Green Crown', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/crowns/g.png', bounds:bounds, masks:masks2, complementary:25},
	{name:'Multicolored Crown', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/crowns/m.png', bounds:bounds, masks:masks2, complementary:25},
	{name:'Colorless Crown', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/crowns/c.png', bounds:bounds, masks:masks2, complementary:25},
	{name:'Legend Crown Gold Inlay', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/crowns/gold.png', bounds:bounds},
	{name:'Legend Crown Nyx Inlay', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/crowns/nyx.png', bounds:bounds},
	
	{name:'Legend Crown Border Cover', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/blackBar.png', bounds:bounds, complementary:26},
	{name:'Legend Crown Gradient Corner Fill', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/planeswalker/extended/lowerGradient.png', bounds:bounds}
];
// Notification
notify('When you load a Planeswalker frame version, a "Planeswalker" tab will appear. This tab controls the placement and loyalty costs for Planeswalker abilities.', 10)
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'planeswalkerStoneCutterDeluxe';
	card.onload = '/js/frames/versionPlaneswalker.js';
	loadScript('/js/frames/versionPlaneswalker.js');
	//art bounds
	card.artBounds = {x:0.068, y:0.101, width:0.864, height:0.8143};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:0.9227, y:0.5891, width:0.12, height:0.0381, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.5, y:0.7762, width:0.75, height:0.2305};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', y:0.0497, width:0.9292, height:71/2100, oneLine:true, size:71/1638, align:'right', shadowX:-0.001, shadowY:0.0029, manaCost:true, manaSpacing:0},
		title: {name:'Title', text:'', x:0.0867, y:0.0372, width:0.8267, height:0.0548, oneLine:true, font:'belerenb', size:0.0381, color:'white', shadowX:0.002, shadowY:0.0015},
		type: {name:'Type', text:'', x:0.0867, y:0.5625, width:0.8267, height:0.0548, oneLine:true, font:'belerenb', size:0.0324, color:'white', shadowX:0.002, shadowY:0.0015},
		ability0: {name:'Ability 1', text:'', x:0.18, y:0.6239, width:0.7467, height:0.0972, size:0.0353},
		ability1: {name:'Ability 2', text:'', x:0.18, y:0, width:0.7467, height:0.0972, size:0.0353},
		ability2: {name:'Ability 3', text:'', x:0.18, y:0, width:0.7467, height:0.0972, size:0.0353},
		ability3: {name:'Ability 4', text:'', x:0.18, y:0, width:0.7467, height:0, size:0.0353},
		loyalty: {name:'Loyalty', text:'', x:0.806, y:0.902, width:0.14, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center', color:'white'}
	});
}
//loads available frames
loadFramePack();