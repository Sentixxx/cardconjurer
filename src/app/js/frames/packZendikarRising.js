//Create objects for common properties across available frames
var masks = [{src:'/img/frames/m15/zendikarRising/m15ZendikarRisingMaskPinline.png', name:'Pinline'}, {src:'/img/frames/m15/regular/m15MaskTitle.png', name:'Title'}, {src:'/img/frames/m15/regular/m15MaskType.png', name:'Type'}, {src:'/img/frames/m15/zendikarRising/m15ZendikarRisingMaskText.png', name:'Rules'}, {src:'/img/frames/m15/zendikarRising/m15ZendikarRisingMaskFrame.png', name:'Frame'}, {src:'/img/frames/m15/zendikarRising/m15ZendikarRisingMaskBorder.png', name:'Border'}, {src:'/img/frames/m15/zendikarRising/opaque.svg', name:'Opaque Portion'}];
var bounds = {x:0.7573, y:0.8848, width:0.188, height:0.0733};
var bounds2 = {x:0.0294, y:0.0234, width:0.9414, height:0.1167};
var bounds3 = {x:0.0374, y:0.0262, width:0.9254, height:0.1091};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/m15/zendikarRising/m15ZendikarRisingFrameW.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/m15/zendikarRising/m15ZendikarRisingFrameU.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/m15/zendikarRising/m15ZendikarRisingFrameB.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/m15/zendikarRising/m15ZendikarRisingFrameR.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/m15/zendikarRising/m15ZendikarRisingFrameG.png', masks:masks},
	{name:'Multicolored Frame', src:'/img/frames/m15/zendikarRising/m15ZendikarRisingFrameM.png', masks:masks},
	{name:'Artifact Frame', src:'/img/frames/m15/zendikarRising/m15ZendikarRisingFrameA.png', masks:masks},
	{name:'Land Frame', src:'/img/frames/m15/zendikarRising/m15ZendikarRisingFrameL.png', masks:masks},
	{name:'Colorless Frame', src:'/img/frames/m15/zendikarRising/m15ZendikarRisingFrameC.png', masks:masks},
	{name:'Colorless Frame (2)', src:'/img/frames/m15/zendikarRising/m15ZendikarRisingFrameCAlt.png', masks:masks},
	{name:'White Title', src:'/img/frames/m15/zendikarRising/m15ZendikarRisingTitleW.png', bounds:bounds3},
	{name:'Blue Title', src:'/img/frames/m15/zendikarRising/m15ZendikarRisingTitleU.png', bounds:bounds3},
	{name:'Black Title', src:'/img/frames/m15/zendikarRising/m15ZendikarRisingTitleB.png', bounds:bounds3},
	{name:'Red Title', src:'/img/frames/m15/zendikarRising/m15ZendikarRisingTitleR.png', bounds:bounds3},
	{name:'Green Title', src:'/img/frames/m15/zendikarRising/m15ZendikarRisingTitleG.png', bounds:bounds3},
	{name:'Multicolored Title', src:'/img/frames/m15/zendikarRising/m15ZendikarRisingTitleM.png', bounds:bounds3},
	{name:'Artifact Title', src:'/img/frames/m15/zendikarRising/m15ZendikarRisingTitleA.png', bounds:bounds3},
	{name:'Land Title', src:'/img/frames/m15/zendikarRising/m15ZendikarRisingTitleL.png', bounds:bounds3},
	{name:'Colorless Title', src:'/img/frames/m15/zendikarRising/m15ZendikarRisingTitleC.png', bounds:bounds3},
	{name:'White Crown', src:'/img/frames/m15/zendikarRising/m15ZendikarRisingCrownW.png', bounds:bounds2},
	{name:'Blue Crown', src:'/img/frames/m15/zendikarRising/m15ZendikarRisingCrownU.png', bounds:bounds2},
	{name:'Black Crown', src:'/img/frames/m15/zendikarRising/m15ZendikarRisingCrownB.png', bounds:bounds2},
	{name:'Red Crown', src:'/img/frames/m15/zendikarRising/m15ZendikarRisingCrownR.png', bounds:bounds2},
	{name:'Green Crown', src:'/img/frames/m15/zendikarRising/m15ZendikarRisingCrownG.png', bounds:bounds2},
	{name:'Multicolored Crown', src:'/img/frames/m15/zendikarRising/m15ZendikarRisingCrownM.png', bounds:bounds2},
	{name:'Artifact Crown', src:'/img/frames/m15/zendikarRising/m15ZendikarRisingCrownA.png', bounds:bounds2},
	{name:'Land Crown', src:'/img/frames/m15/zendikarRising/m15ZendikarRisingCrownL.png', bounds:bounds2},
	{name:'Colorless Crown', src:'/img/frames/m15/zendikarRising/m15ZendikarRisingCrownC.png', bounds:bounds2},
	{name:'White Power/Toughness', src:'/img/frames/m15/zendikarRising/m15ZendikarRisingPTW.png', bounds:bounds},
	{name:'Blue Power/Toughness', src:'/img/frames/m15/nickname/m15NicknamePTU.png', bounds:bounds},
	{name:'Black Power/Toughness', src:'/img/frames/m15/zendikarRising/m15ZendikarRisingPTB.png', bounds:bounds},
	{name:'Red Power/Toughness', src:'/img/frames/m15/nickname/m15NicknamePTR.png', bounds:bounds},
	{name:'Green Power/Toughness', src:'/img/frames/m15/nickname/m15NicknamePTG.png', bounds:bounds},
	{name:'Multicolored Power/Toughness', src:'/img/frames/m15/zendikarRising/m15ZendikarRisingPTM.png', bounds:bounds},
	{name:'Artifact Power/Toughness', src:'/img/frames/m15/nickname/m15NicknamePTA.png', bounds:bounds},
	{name:'Land Power/Toughness', src:'/img/frames/m15/nickname/m15NicknamePTC.png', bounds:bounds},
	{name:'Colorless Power/Toughness', src:'/img/frames/m15/zendikarRising/m15ZendikarRisingPTC.png', bounds:bounds}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'genericShowcase';
	//art bounds
	card.artBounds = {x:0.04, y:0.0286, width:0.92, height:0.8648};
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
		title: {name:'Title', text:'', x:0.0854, y:0.0522, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0381, color:'white', shadowX:0.0014, shadowY:0.001},
		type: {name:'Type', text:'', x:0.0854, y:0.5664, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0324, color:'white', shadowX:0.0014, shadowY:0.001},
		rules: {name:'Rules Text', text:'', x:0.086, y:0.6303, width:0.828, height:0.2875, size:0.0362, color:'white', shadowX:0.0014, shadowY:0.001},
		pt: {name:'Power/Toughness', text:'', x:0.7928, y:0.902, width:0.1367, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center', color:'white'}
	});
}
//loads available frames
loadFramePack();