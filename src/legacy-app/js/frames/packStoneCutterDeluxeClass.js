//Create objects for common properties across available frames
var masks = [{src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/class/masks/maskFrame.png', name:'Frame'}, {src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/class/masks/maskRules.png', name:'Rules'}, {src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/class/masks/maskBorderless.png', name:'Borderless'}, {src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/class/masks/maskBorder.png', name:'Border'}];
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/class/w.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/class/u.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/class/b.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/class/r.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/class/g.png', masks:masks},
	{name:'Multicolored Frame', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/class/m.png', masks:masks},
	{name:'Colorless Frame', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/class/c.png', masks:masks},
	{name:'Land Frame', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/class/L.png', masks:masks},
	{name:'Gold Inlay', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/class/gold.png'},
	{name:'Nyx Inlay', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/class/nyx.png'}
];
// Notification
notify('When you load a Class frame version, a "Class" tab will appear. This tab controls the placement and levels for Class abilities.')
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'classStoneCutterDeluxe';
	card.onload = '/js/frames/versionClass.js';
	loadScript('/js/frames/versionClass.js');
	//art bounds
	card.artBounds = {x:0.0723, y:0.1080, width:0.4250, height:0.7343};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:0.9227, y:0.8850, width:0.12, height:0.0381, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.5214, y:0.4748, width:0.38, height:0.6767};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', y:0.0558, width:0.9292, height:71/2100, oneLine:true, size:71/1638, align:'right', shadowX:-0.001, shadowY:0.0029, manaCost:true, manaSpacing:0},
		title: {name:'Title', text:'', x:0.0854, y:0.0458, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0381, color:'white', shadowX:0.002, shadowY:0.0015},
		type: {name:'Type', text:'', x:0.0854, y:0.8572, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0324, color:'white', shadowX:0.002, shadowY:0.0015},
		level0c: {name:'1 - Text', text:'{i}(Gain the next level as a sorcery to add its ability.){/i}{lns}{bar}{lns}', x:0.5248, y:0.1129, width:0.400, height:0.2096, size:0.0305},
		level1a: {name:'2 - Cost', text:'{2}:', x:0.5303, y:0, width:0.3967, height:0.0277, size:0.0277},
		level1b: {name:'2 - Name', text:'Level 2', x:0.5100, y:0, width:0.3967, height:0.0281, size:0.0281, align:'right'},
		level1c: {name:'2 - Text', text:'', x:0.5248, y:0, width:0.400, height:0.2091, size:0.0305},
		level2a: {name:'3 - Cost', text:'{3}:', x:0.5303, y:0, width:0.3967, height:0.0277, size:0.0277},
		level2b: {name:'3 - Name', text:'Level 3', x:0.5100, y:0, width:0.3967, height:0.0281, size:0.0281, align:'right'},
		level2c: {name:'3 - Text', text:'', x:0.5248, y:0, width:0.400, height:0.2091, size:0.0305},
		level3a: {name:'4 - Cost', text:'{4}:', x:0.5303, y:0, width:0.3967, height:0.0277, size:0.0277},
		level3b: {name:'4 - Name', text:'Level 4', x:0.5100, y:0, width:0.3967, height:0.0281, size:0.0281, align:'right'},
		level3c: {name:'4 - Text', text:'', x:0.5248, y:0, width:0.400, height:0, size:0.0305}
	});
}
//loads available frames
loadFramePack();