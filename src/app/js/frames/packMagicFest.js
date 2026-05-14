//Create objects for common properties across available frames
var masks = [{src:'/img/frames/textless/magicFest/pinline.png', name:'Pinline'}, {src:'/img/frames/m15/regular/m15MaskTitle.png', name:'Title'}, {src:'/img/frames/textless/magicFest/frame.png', name:'Frame'}];
var bounds = {x:0.7573, y:0.8848, width:0.188, height:0.0733};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/textless/magicFest/w.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/textless/magicFest/u.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/textless/magicFest/b.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/textless/magicFest/r.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/textless/magicFest/g.png', masks:masks},
	{name:'Multicolored Frame', src:'/img/frames/textless/magicFest/m.png', masks:masks},
	{name:'Artifact Frame', src:'/img/frames/textless/magicFest/a.png', masks:masks},
	{name:'Colorless Frame', src:'/img/frames/textless/magicFest/l.png', masks:masks},
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
	card.version = 'magicFest';
	//art bounds
	card.artBounds = {x:0.062, y:0.0496, width:0.876, height:0.8639};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:0.5, y:0.9524, width:0.12, height:0.0410, vertical:'center', horizontal: 'center'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:-1, y:-1, width:0.0007, height:0.0005};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', y:0.0613, width:0.9292, height:71/2100, oneLine:true, size:71/1638, align:'right', shadowX:-0.001, shadowY:0.0029, manaCost:true, manaSpacing:0},
		title: {name:'Title', text:'', x:0.0854, y:0.0522, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0381, color:'white', shadowX:0.0014, shadowY:0.001},
		pt: {name:'Power/Toughness', text:'', x:0.7928, y:0.902, width:0.1367, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center', color:'black'}
	});
}
//loads available frames
loadFramePack();