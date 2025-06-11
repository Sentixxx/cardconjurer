//Create objects for common properties across available frames
var masks = [{src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/extended/masks/maskPinlines.png', name:'Pinlines'}, {src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/extended/masks/maskTitle.png', name:'Title'}, {src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/extended/masks/maskLowerFrame.png', name:'Lower Frame'}, {src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/extended/masks/maskFrame.png', name:'Frame'}, {src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/masks/maskRules.png', name:'Rules Text'}, {src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/extended/masks/maskLegendary.png', name:'Legendary'}, {src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/extended/masks/maskFloating.png', name:'Floating Frame'}, {src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/extended/masks/maskBorder.png', name:'Border'}];
var masks2 = [{src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/crowns/maskPinlines.png', name:'Pinlines'}];
var masks3 = [{src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/extended/masks/maskOverlayLegendary.png', name:'Legendary'}];
var bounds = {x:0, y:0, width:1, height:1};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/extended/w.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/extended/u.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/extended/b.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/extended/r.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/extended/g.png', masks:masks},
	{name:'Multicolored Frame', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/extended/m.png', masks:masks},
	{name:'Colorless Frame', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/extended/c.png', masks:masks},
	{name:'Land Frame', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/extended/L.png', masks:masks},
	{name:'Gold Inlay', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/extended/gold.png', masks:masks3},
	{name:'Nyx Inlay', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/extended/nyx.png', masks:masks3},
	
	{name:'White Power/Toughness', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/pt/w.png', bounds:bounds},
	{name:'Blue Power/Toughness', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/pt/u.png', bounds:bounds},
	{name:'Black Power/Toughness', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/pt/b.png', bounds:bounds},
	{name:'Red Power/Toughness', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/pt/r.png', bounds:bounds},
	{name:'Green Power/Toughness', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/pt/g.png', bounds:bounds},
	{name:'Multicolored Power/Toughness', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/pt/m.png', bounds:bounds},
	{name:'Colorless Power/Toughness', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/pt/c.png', bounds:bounds},
	{name:'Land Power/Toughness', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/pt/L.png', bounds:bounds},
	
	{name:'White Crown', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/crowns/w.png', bounds:bounds, masks:masks2, complementary:28},
	{name:'Blue Crown', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/crowns/u.png', bounds:bounds, masks:masks2, complementary:28},
	{name:'Black Crown', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/crowns/b.png', bounds:bounds, masks:masks2, complementary:28},
	{name:'Red Crown', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/crowns/r.png', bounds:bounds, masks:masks2, complementary:28},
	{name:'Green Crown', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/crowns/g.png', bounds:bounds, masks:masks2, complementary:28},
	{name:'Multicolored Crown', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/crowns/m.png', bounds:bounds, masks:masks2, complementary:28},
	{name:'Colorless Crown', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/crowns/c.png', bounds:bounds, masks:masks2, complementary:28},
	{name:'Land Crown', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/crowns/L.png', bounds:bounds, masks:masks2, complementary:28},
	{name:'Legend Crown Gold Inlay', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/crowns/gold.png', bounds:bounds},
	{name:'Legend Crown Nyx Inlay', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/crowns/nyx.png', bounds:bounds},
	
	{name:'Legend Crown Border Cover', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/blackBar.png', bounds:bounds, complementary:29},
	{name:'Legend Crown Gradient Corner Fill', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/extended/lowerGradient.png', bounds:bounds}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'stoneCutterDeluxeExtended';
	//art bounds
	card.artBounds = {x:0, y:236/2814, width:1, height:1420/2814};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:0.9213, y:0.5958, width:0.12, height:0.0410, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.5, y:0.7762, width:0.75, height:0.2305};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', y:0.0497, width:0.9292, height:71/2100, oneLine:true, size:71/1638, align:'right', shadowX:-0.001, shadowY:0.0029, manaCost:true, manaSpacing:0},
		title: {name:'Title', text:'', x:0.0854, y:0.0372, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0381, color:'white', shadowX:0.002, shadowY:0.0015},
		type: {name:'Type', text:'', x:0.0854, y:0.571, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0324, color:'white', shadowX:0.002, shadowY:0.0015},
		rules: {name:'Rules Text', text:'', x:0.086, y:0.6329, width:0.828, height:0.2905, size:0.0362},
		pt: {name:'Power/Toughness', text:'', x:0.7928, y:0.902, width:0.1367, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center', color:'white', shadowX:0.002, shadowY:0.0015}
	});
}
//loads available frames
loadFramePack();