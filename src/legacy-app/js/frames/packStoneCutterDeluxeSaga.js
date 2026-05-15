//Create objects for common properties across available frames
var masks = [{src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/saga/masks/maskPinlines.png', name:'Banner Pinline'}, {src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/saga/masks/maskBanner.png', name:'Banner'}, {src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/saga/masks/maskBannerRight.png', name:'Banner (Right)'}, {src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/saga/masks/maskBorderless.png', name:'Borderless'}, {src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/class/masks/maskBorder.png', name:'Border'}];
var masks2 = [{src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/crowns/maskPinlines.png', name:'Pinlines'}];
var bounds = {x:0, y:14/2814, width:1, height:1};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/saga/w.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/saga/u.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/saga/b.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/saga/r.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/saga/g.png', masks:masks},
	{name:'Multicolored Frame', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/saga/m.png', masks:masks},
	{name:'Colorless Frame', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/saga/c.png', masks:masks},
	{name:'Land Frame', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/saga/L.png', masks:masks},
	{name:'Banner Pinstripe (Multicolored)', src:'/img/frames/saga/sagaMidStripe.png', bounds:{x:0.0727, y:0.3058, width:0.0087, height:0.4762}},
	{name:'Gold Inlay', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/saga/gold.png'},
	{name:'Nyx Inlay', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/saga/nyx.png'},

	{name:'White Crown', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/crowns/w.png', bounds:bounds, masks:masks2, complementary:21},
	{name:'Blue Crown', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/crowns/u.png', bounds:bounds, masks:masks2, complementary:21},
	{name:'Black Crown', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/crowns/b.png', bounds:bounds, masks:masks2, complementary:21},
	{name:'Red Crown', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/crowns/r.png', bounds:bounds, masks:masks2, complementary:21},
	{name:'Green Crown', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/crowns/g.png', bounds:bounds, masks:masks2, complementary:21},
	{name:'Multicolored Crown', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/crowns/m.png', bounds:bounds, masks:masks2, complementary:21},
	{name:'Colorless Crown', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/crowns/c.png', bounds:bounds, masks:masks2, complementary:21},
	{name:'Land Crown', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/crowns/L.png', bounds:bounds, masks:masks2, complementary:21},
	{name:'Legend Crown Gold Inlay', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/crowns/gold.png', bounds:bounds},
	{name:'Legend Crown Nyx Inlay', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/crowns/nyx.png', bounds:bounds},
	
	{name:'Legend Crown Border Cover', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/blackBar.png', bounds:bounds}
];
// Notification
notify('When you load the Saga frame version, a "Saga" tab will appear. This tab controls the placement and chapter counts for Saga chapters.')
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'sagaStoneCutterDeluxe';
	card.onload = '/js/frames/versionSaga.js';
	loadScript('/js/frames/versionSaga.js');
	//art bounds
	card.artBounds = {x:0.4995, y:0.1087, width:0.4253, height:0.734};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:0.9227, y:0.8850, width:0.12, height:0.0381, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.3027, y:0.4748, width:0.3547, height:0.6767};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', y:0.0558, width:0.9292, height:71/2100, oneLine:true, size:71/1638, align:'right', shadowX:-0.001, shadowY:0.0029, manaCost:true, manaSpacing:0},
		title: {name:'Title', text:'', x:0.0854, y:0.0458, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0381, color:'white', shadowX:0.002, shadowY:0.0015},
		type: {name:'Type', text:'', x:0.0854, y:0.8572, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0324, color:'white', shadowX:0.002, shadowY:0.0015},
		ability0: {name:'Ability 1', text:'', x:0.1334, y:0.2896, width:0.3334, height:0.1786, size:0.0305},
		ability1: {name:'Ability 2', text:'', x:0.1334, y:0, width:0.3334, height:0.1786, size:0.0305},
		ability2: {name:'Ability 3', text:'', x:0.1334, y:0, width:0.3334, height:0.1786, size:0.0305},
		ability3: {name:'Ability 4', text:'', x:0.1334, y:0, width:0.3334, height:0, size:0.0305},
		reminder: {name:'Reminder Text', text:'{i}(As this Saga enters and after your draw step, add a lore counter. Sacrifice after III.)', x:0.0867, y:0.1129, width:0.38, height:0.1772, size:0.0281, shadowColor:'white'}
	});
}
//loads available frames
loadFramePack();