//Create objects for common properties across available frames
var masks = [{src:'/img/frames/m15/regular/m15MaskPinlineSuper.png', name:'Pinline'}, {src:'/img/frames/m15/regular/m15MaskType.png', name:'Type'}, {src:'/img/frames/m15/regular/m15MaskRules.png', name:'Rules'}, {src:'/img/frames/m15/regular/m15MaskBorder.png', name:'Border'}];
var masks2 = [{src:'/img/frames/m15/nickname/m15MaskNicknameLegendCrownStrokeless.png', name:'Strokeless Crown'}, {src:'/img/frames/m15/regular/m15MaskTitle.png', name:'Title'}, {src:'/img/frames/m15/nickname/m15NicknameMaskTrueName.png', name:'True Title'}];
var masks3 = [{src:'/img/frames/m15/nickname/m15MaskNicknameTitleStrokeless.png', name:'Strokeless Title'}, {src:'/img/frames/m15/regular/m15MaskTitle.png', name:'Title'}, {src:'/img/frames/m15/nickname/m15NicknameMaskTrueName.png', name:'True Title'}, {src:'/img/frames/m15/nickname/truenameAddon.svg', name:'Lower Section'}];
var bounds = {x:0.7573, y:0.8848, width:0.188, height:0.0733};
var bounds2 = {x:0.024, y:0.0172, width:0.952, height:0.1286};
var bounds3 = {x:0.0494, y:0.0405, width:0.9014, height:0.1053};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/m15/nickname/m15NicknameFrameW.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/m15/nickname/m15NicknameFrameU.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/m15/nickname/m15NicknameFrameB.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/m15/nickname/m15NicknameFrameR.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/m15/nickname/m15NicknameFrameG.png', masks:masks},
	{name:'Multicolored Frame', src:'/img/frames/m15/nickname/m15NicknameFrameM.png', masks:masks},
	{name:'Artifact Frame', src:'/img/frames/m15/nickname/m15NicknameFrameA.png', masks:masks},
	{name:'Land Frame', src:'/img/frames/m15/nickname/m15NicknameFrameL.png', masks:masks},
	{name:'White Crown', src:'/img/frames/m15/nickname/m15NicknameCrownW.png', masks:masks2, bounds:bounds2},
	{name:'Blue Crown', src:'/img/frames/m15/nickname/m15NicknameCrownU.png', masks:masks2, bounds:bounds2},
	{name:'Black Crown', src:'/img/frames/m15/nickname/m15NicknameCrownB.png', masks:masks2, bounds:bounds2},
	{name:'Red Crown', src:'/img/frames/m15/nickname/m15NicknameCrownR.png', masks:masks2, bounds:bounds2},
	{name:'Green Crown', src:'/img/frames/m15/nickname/m15NicknameCrownG.png', masks:masks2, bounds:bounds2},
	{name:'Multicolored Crown', src:'/img/frames/m15/nickname/m15NicknameCrownM.png', masks:masks2, bounds:bounds2},
	{name:'Artifact Crown', src:'/img/frames/m15/nickname/m15NicknameCrownA.png', masks:masks2, bounds:bounds2},
	{name:'Land Crown', src:'/img/frames/m15/nickname/m15NicknameCrownL.png', masks:masks2, bounds:bounds2},
	{name:'White Title', src:'/img/frames/m15/nickname/m15NicknameTitleW.png', masks:masks3, bounds:bounds3},
	{name:'Blue Title', src:'/img/frames/m15/nickname/m15NicknameTitleU.png', masks:masks3, bounds:bounds3},
	{name:'Black Title', src:'/img/frames/m15/nickname/m15NicknameTitleB.png', masks:masks3, bounds:bounds3},
	{name:'Red Title', src:'/img/frames/m15/nickname/m15NicknameTitleR.png', masks:masks3, bounds:bounds3},
	{name:'Green Title', src:'/img/frames/m15/nickname/m15NicknameTitleG.png', masks:masks3, bounds:bounds3},
	{name:'Multicolored Title', src:'/img/frames/m15/nickname/m15NicknameTitleM.png', masks:masks3, bounds:bounds3},
	{name:'Artifact Title', src:'/img/frames/m15/nickname/m15NicknameTitleA.png', masks:masks3, bounds:bounds3},
	{name:'Land Title', src:'/img/frames/m15/nickname/m15NicknameTitleL.png', masks:masks3, bounds:bounds3},
	{name:'White Power/Toughness', src:'/img/frames/m15/nickname/m15NicknamePTW.png', bounds:bounds},
	{name:'Blue Power/Toughness', src:'/img/frames/m15/nickname/m15NicknamePTU.png', bounds:bounds},
	{name:'Black Power/Toughness', src:'/img/frames/m15/nickname/m15NicknamePTB.png', bounds:bounds},
	{name:'Red Power/Toughness', src:'/img/frames/m15/nickname/m15NicknamePTR.png', bounds:bounds},
	{name:'Green Power/Toughness', src:'/img/frames/m15/nickname/m15NicknamePTG.png', bounds:bounds},
	{name:'Multicolored Power/Toughness', src:'/img/frames/m15/nickname/m15NicknamePTM.png', bounds:bounds},
	{name:'Artifact Power/Toughness', src:'/img/frames/m15/nickname/m15NicknamePTA.png', bounds:bounds},
	{name:'Colorless Power/Toughness', src:'/img/frames/m15/nickname/m15NicknamePTC.png', bounds:bounds}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'm15Nickname';
	//art bounds
	card.artBounds = {x:0, y:0, width:1, height:0.9224};
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
		nickname: {name:'Nickname', text:'', x:0.0854, y:0.0522, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0381, color:'white', shadowX:0.0014, shadowY:0.001},
		title: {name:'Title', text:'', x:0.14, y:0.1129, width:0.72, height:0.0243, oneLine:true, font:'mplantini', size:0.0229, color:'white', shadowX:0.0014, shadowY:0.001, align:'center'},
		type: {name:'Type', text:'', x:0.0854, y:0.5664, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0324, color:'white', shadowX:0.0014, shadowY:0.001},
		rules: {name:'Rules Text', text:'', x:0.086, y:0.6303, width:0.828, height:0.2875, size:0.0362, color:'white', shadowX:0.0014, shadowY:0.001},
		pt: {name:'Power/Toughness', text:'', x:0.7928, y:0.902, width:0.1367, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center', color:'white'}
	});
}
//loads available frames
loadFramePack();