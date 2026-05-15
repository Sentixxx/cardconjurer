//Create objects for common properties across available frames
var masks = [{src:'/img/frames/m15/regular/m15MaskPinlineSuper.png', name:'Pinline'}, {src:'/img/frames/m15/regular/m15MaskTitle.png', name:'Title'}, {src:'/img/frames/m15/regular/m15MaskType.png', name:'Type'}, {src:'/img/frames/m15/regular/m15MaskRules.png', name:'Rules'}, {src:'/img/frames/m15/regular/m15MaskFrame.png', name:'Frame'}, {src:'/img/frames/m15/regular/m15MaskBorder.png', name:'Border'}];
var bounds = {x:0.7573, y:0.8848, width:0.188, height:0.0733};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/m15/boxTopper/m15BoxTopperFrameW.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/m15/boxTopper/m15BoxTopperFrameU.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/m15/boxTopper/m15BoxTopperFrameB.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/m15/boxTopper/m15BoxTopperFrameR.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/m15/boxTopper/m15BoxTopperFrameG.png', masks:masks},
	{name:'Multicolored Frame', src:'/img/frames/m15/boxTopper/m15BoxTopperFrameM.png', masks:masks},
	{name:'Artifact Frame', src:'/img/frames/m15/boxTopper/m15BoxTopperFrameA.png', masks:masks},
	{name:'Land Frame', src:'/img/frames/m15/boxTopper/m15BoxTopperFrameL.png', masks:masks},
	{name:'White Land Frame', src:'/img/frames/m15/boxTopper/m15BoxTopperFrameWL.png', masks:masks},
	{name:'Blue Land Frame', src:'/img/frames/m15/boxTopper/m15BoxTopperFrameUL.png', masks:masks},
	{name:'Black Land Frame', src:'/img/frames/m15/boxTopper/m15BoxTopperFrameBL.png', masks:masks},
	{name:'Red Land Frame', src:'/img/frames/m15/boxTopper/m15BoxTopperFrameRL.png', masks:masks},
	{name:'Green Land Frame', src:'/img/frames/m15/boxTopper/m15BoxTopperFrameGL.png', masks:masks},
	{name:'Multicolored Land Frame', src:'/img/frames/m15/boxTopper/m15BoxTopperFrameML.png', masks:masks},
	{name:'Vehicle Frame', src:'/img/frames/m15/boxTopper/m15BoxTopperFrameV.png', masks:masks},
	{name:'Colorless Frame', src:'/img/frames/m15/boxTopper/c.png', masks:masks},
	{name:'White Power/Toughness', src:'/img/frames/m15/regular/m15PTW.png', bounds:bounds},
	{name:'Blue Power/Toughness', src:'/img/frames/m15/regular/m15PTU.png', bounds:bounds},
	{name:'Black Power/Toughness', src:'/img/frames/m15/regular/m15PTB.png', bounds:bounds},
	{name:'Red Power/Toughness', src:'/img/frames/m15/regular/m15PTR.png', bounds:bounds},
	{name:'Green Power/Toughness', src:'/img/frames/m15/regular/m15PTG.png', bounds:bounds},
	{name:'Multicolored Power/Toughness', src:'/img/frames/m15/regular/m15PTM.png', bounds:bounds},
	{name:'Artifact Power/Toughness', src:'/img/frames/m15/regular/m15PTA.png', bounds:bounds},
	{name:'Vehicle Power/Toughness', src:'/img/frames/m15/regular/m15PTV.png', bounds:bounds},
	{name:'Colorless Power/Toughness', src:'/img/frames/m15/regular/m15PTC.png', bounds:bounds},
	{name:'Bevel Cutout for Nickname', src:'/img/black.png', bounds:{x:0.058, y:0.111, width:0.884, height:0.0381}, erase:true},
	{name:'Nickname Bevel', src:'/img/frames/m15/boxTopper/m15BoxTopperNicknameBevel.png', bounds:{x:0.058, y:0.111, width:0.884, height:0.0381}},
	{name:'White Nyx Frame', src:'/img/frames/extended/regular/nyx/w.png', masks:masks},
	{name:'Blue Nyx Frame', src:'/img/frames/extended/regular/nyx/u.png', masks:masks},
	{name:'Black Nyx Frame', src:'/img/frames/extended/regular/nyx/b.png', masks:masks},
	{name:'Red Nyx Frame', src:'/img/frames/extended/regular/nyx/r.png', masks:masks},
	{name:'Green Nyx Frame', src:'/img/frames/extended/regular/nyx/g.png', masks:masks},
	{name:'Multicolored Nyx Frame', src:'/img/frames/extended/regular/nyx/m.png', masks:masks},
	{name:'Artifact Nyx Frame', src:'/img/frames/extended/regular/nyx/a.png', masks:masks},
	{name:'White Snow Frame', src:'/img/frames/extended/regular/snow/w.png', masks:masks},
	{name:'Blue Snow Frame', src:'/img/frames/extended/regular/snow/u.png', masks:masks},
	{name:'Black Snow Frame', src:'/img/frames/extended/regular/snow/b.png', masks:masks},
	{name:'Red Snow Frame', src:'/img/frames/extended/regular/snow/r.png', masks:masks},
	{name:'Green Snow Frame', src:'/img/frames/extended/regular/snow/g.png', masks:masks},
	{name:'Multicolored Snow Frame', src:'/img/frames/extended/regular/snow/m.png', masks:masks},
	{name:'Artifact Snow Frame', src:'/img/frames/extended/regular/snow/a.png', masks:masks},
	{name:'Land Snow Frame', src:'/img/frames/extended/regular/snow/l.png', masks:masks},
	{name:'White Land Snow Frame', src:'/img/frames/extended/regular/snow/wl.png', masks:masks},
	{name:'Blue Land Snow Frame', src:'/img/frames/extended/regular/snow/ul.png', masks:masks},
	{name:'Black Land Snow Frame', src:'/img/frames/extended/regular/snow/bl.png', masks:masks},
	{name:'Red Land Snow Frame', src:'/img/frames/extended/regular/snow/rl.png', masks:masks},
	{name:'Green Land Snow Frame', src:'/img/frames/extended/regular/snow/gl.png', masks:masks},
	{name:'Multicolored Land Snow Frame', src:'/img/frames/extended/regular/snow/ml.png', masks:masks},
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'm15BoxTopper';
	//art bounds
	card.artBounds = {x:0, y:0.081, width:1, height:0.531};
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
		title: {name:'Title', text:'', x:0.0854, y:0.0522, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0386},
		type: {name:'Type', text:'', x:0.0854, y:0.5664, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0328, color:'white', shadowX:0.0014, shadowY:0.001},
		rules: {name:'Rules Text', text:'', x:0.086, y:0.6303, width:0.828, height:0.2875, size:0.0362},
		pt: {name:'Power/Toughness', text:'', x:0.7928, y:0.902, width:0.1367, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center'}
	});
}
//loads available frames
loadFramePack();