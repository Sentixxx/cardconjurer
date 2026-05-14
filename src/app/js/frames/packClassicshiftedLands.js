//Create objects for common properties across available frames
var masks = [{src:'/img/frames/custom/classicshifted/maskFrame.png', name:'Frame'}, {src:'/img/frames/custom/classicshifted/maskText.png', name:'Textbox'}, {src:'/img/frames/custom/classicshifted/pinline.svg', name:'Pinline'}, {src:'/img/frames/custom/classicshifted/dual.svg', name:'Dual Land Pinline'}];
var bounds = {x:0.3267, y:0.6491, width:0.3474, height:0.2496};
var bounds2 = {x:0.0267, y:0.0134, width:0.9467, height:0.1005};
//defines available frames
availableFrames = [
	{name:'Land Frame', src:'/img/frames/custom/classicshifted/l.png', masks:masks},
	{name:'White Land Frame', src:'/img/frames/custom/classicshifted/wl.png', masks:masks},
	{name:'Blue Land Frame', src:'/img/frames/custom/classicshifted/ul.png', masks:masks},
	{name:'Black Land Frame', src:'/img/frames/custom/classicshifted/bl.png', masks:masks},
	{name:'Red Land Frame', src:'/img/frames/custom/classicshifted/rl.png', masks:masks},
	{name:'Green Land Frame', src:'/img/frames/custom/classicshifted/gl.png', masks:masks},
	{name:'The Dark Land Frame', src:'/img/frames/custom/classicshifted/lands/theDark.png', masks:masks},
	{name:'Alliances Land Frame', src:'/img/frames/custom/classicshifted/lands/alliances.png', masks:masks},
	{name:'Mirage Land Frame', src:'/img/frames/custom/classicshifted/lands/mirage.png', masks:masks},
	{name:'Ice Age Land Frame', src:'/img/frames/custom/classicshifted/lands/iceAge.png', masks:masks},
	{name:'Homelands Land Frame', src:'/img/frames/custom/classicshifted/lands/homelands.png', masks:masks},
	{name:'Fallen Empires Land Frame', src:'/img/frames/custom/classicshifted/lands/fallenEmpires.png', masks:masks},
	{name:'Arabian Nights Land Frame', src:'/img/frames/custom/classicshifted/lands/arabianNights.png', masks:masks},
	{name:'Antiquities Land Frame', src:'/img/frames/custom/classicshifted/lands/antiquities.png', masks:masks},
	{name:'Plains Watermark', src:'/img/frames/m15/basics/w.png', bounds:bounds},
	{name:'Island Watermark', src:'/img/frames/m15/basics/u.png', bounds:bounds},
	{name:'Swamp Watermark', src:'/img/frames/m15/basics/b.png', bounds:bounds},
	{name:'Mountain Watermark', src:'/img/frames/m15/basics/r.png', bounds:bounds},
	{name:'Forest Watermark', src:'/img/frames/m15/basics/g.png', bounds:bounds},
	{name:'Wastes Watermark', src:'/img/frames/m15/basics/c.png', bounds:bounds},
	{name:'Snow Overlay', src:'/img/frames/custom/classicshifted/snow.png'},
	{name:'The Dark Legend Crown', src:'/img/frames/custom/classicshifted/crowns/theDark.png', bounds:bounds2, complementary:29},
	{name:'Alliances Legend Crown', src:'/img/frames/custom/classicshifted/crowns/alliances.png', bounds:bounds2, complementary:29},
	{name:'Mirage Legend Crown', src:'/img/frames/custom/classicshifted/crowns/mirage.png', bounds:bounds2, complementary:29},
	{name:'Ice Age Legend Crown', src:'/img/frames/custom/classicshifted/crowns/iceAge.png', bounds:bounds2, complementary:29},
	{name:'Homelands Legend Crown', src:'/img/frames/custom/classicshifted/crowns/homelands.png', bounds:bounds2, complementary:29},
	{name:'Fallen Empires Legend Crown', src:'/img/frames/custom/classicshifted/crowns/fallenEmpires.png', bounds:bounds2, complementary:29},
	{name:'Arabian Nights Legend Crown', src:'/img/frames/custom/classicshifted/crowns/arabianNights.png', bounds:bounds2, complementary:29},
	{name:'Antiquities Legend Crown', src:'/img/frames/custom/classicshifted/crowns/antiquities.png', bounds:bounds2, complementary:29},
	{name:'Legend Crown Border Cover', src:'/img/black.png', bounds:{x:0.0394, y:0.0277, width:0.9214, height:0.021}}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'classicshiftedLands';
	//art bounds
	card.artBounds = {x:0.08, y:0.0954, width:0.84, height:0.4653};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:0.9213, y:0.5958, width:0.12, height:0.0410, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.5, y:0.7762, width:0.75, height:0.2305};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', y:0.0462, width:0.9292, height:71/2100, oneLine:true, size:71/1638, align:'right', shadowX:-0.001, shadowY:0.0029, manaCost:true, manaSpacing:0},
		title: {name:'Title', text:'', x:0.0854, y:0.0372, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0381, color:'white', shadowX:0.002, shadowY:0.0015},
		type: {name:'Type', text:'', x:0.0854, y:0.571, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0324, color:'white', shadowX:0.002, shadowY:0.0015},
		rules: {name:'Rules Text', text:'', x:0.086, y:0.6329, width:0.828, height:0.2905, size:0.0362},
		pt: {name:'Power/Toughness', text:'', x:0.7928, y:0.902, width:0.1367, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center', color:'white', shadowX:0.002, shadowY:0.0015}
	});
}
//loads available frames
loadFramePack();