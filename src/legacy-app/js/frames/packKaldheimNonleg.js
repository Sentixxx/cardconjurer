//Create objects for common properties across available frames
var masks = [{src:'/img/frames/kaldheim/nonleg/details.png', name:'Details'}, {src:'/img/frames/kaldheim/nonleg/pinline.png', name:'Pinline'}, {src:'/img/frames/kaldheim/nonleg/title.png', name:'Title'}, {src:'/img/frames/kaldheim/maskType.png', name:'Type'}, {src:'/img/frames/kaldheim/maskTextbox.png', name:'Rules'}, {src:'/img/frames/kaldheim/nonleg/border.png', name:'Border'}, {src:'/img/frames/kaldheim/nonleg/frame.png', name:'Frame'}];
var masks2 = [{src:'/img/frames/kaldheim/maskPTCorners.png', name:'Corners'}, {src:'/img/frames/kaldheim/maskPTCornersRight.png', name:'Corners (right)'}];
var bounds = {x:0.7627, y:0.8853, width:0.188, height:0.0724};
var bounds2 = {x:0.02, y:0.03, width:0.098, height:0.0591};
var bounds3 = {x:0.03, y:0.8886, width:0.438, height:0.0429};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/kaldheim/nonleg/w.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/kaldheim/nonleg/u.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/kaldheim/nonleg/b.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/kaldheim/nonleg/r.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/kaldheim/nonleg/g.png', masks:masks},
	{name:'Multicolored Frame', src:'/img/frames/kaldheim/nonleg/m.png', masks:masks},
	{name:'Artifact Frame', src:'/img/frames/kaldheim/nonleg/a.png', masks:masks},
	{name:'White Power/Toughness', src:'/img/frames/kaldheim/ptW.png', bounds:bounds, masks:masks2},
	{name:'Blue Power/Toughness', src:'/img/frames/kaldheim/ptU.png', bounds:bounds, masks:masks2},
	{name:'Black Power/Toughness', src:'/img/frames/kaldheim/ptB.png', bounds:bounds, masks:masks2},
	{name:'Red Power/Toughness', src:'/img/frames/kaldheim/ptR.png', bounds:bounds, masks:masks2},
	{name:'Green Power/Toughness', src:'/img/frames/kaldheim/ptG.png', bounds:bounds, masks:masks2},
	{name:'Multicolored Power/Toughness', src:'/img/frames/kaldheim/ptM.png', bounds:bounds, masks:masks2},
	{name:'Artifact Power/Toughness', src:'/img/frames/kaldheim/ptA.png', bounds:bounds, masks:masks2},
	{name:'White Icon (Front)', src:'/img/frames/kaldheim/modal/wft.png', bounds:bounds2},
	{name:'Blue Icon (Front)', src:'/img/frames/kaldheim/modal/uft.png', bounds:bounds2},
	{name:'Black Icon (Front)', src:'/img/frames/kaldheim/modal/bft.png', bounds:bounds2},
	{name:'Red Icon (Front)', src:'/img/frames/kaldheim/modal/rft.png', bounds:bounds2},
	{name:'Green Icon (Front)', src:'/img/frames/kaldheim/modal/gft.png', bounds:bounds2},
	{name:'Multicolored Icon (Front)', src:'/img/frames/kaldheim/modal/mft.png', bounds:bounds2},
	{name:'Artifact Icon (Front)', src:'/img/frames/kaldheim/modal/aft.png', bounds:bounds3},
	{name:'White Reminder (Front)', src:'/img/frames/kaldheim/modal/wfb.png', bounds:bounds3},
	{name:'Blue Reminder (Front)', src:'/img/frames/kaldheim/modal/ufb.png', bounds:bounds3},
	{name:'Black Reminder (Front)', src:'/img/frames/kaldheim/modal/bfb.png', bounds:bounds3},
	{name:'Red Reminder (Front)', src:'/img/frames/kaldheim/modal/rfb.png', bounds:bounds3},
	{name:'Green Reminder (Front)', src:'/img/frames/kaldheim/modal/gfb.png', bounds:bounds3},
	{name:'Multicolored Reminder (Front)', src:'/img/frames/kaldheim/modal/mfb.png', bounds:bounds3},
	{name:'Artifact Reminder (Front)', src:'/img/frames/kaldheim/modal/afb.png', bounds:bounds3},
	{name:'White Icon (Back)', src:'/img/frames/kaldheim/modal/wbt.png', bounds:bounds2},
	{name:'Blue Icon (Back)', src:'/img/frames/kaldheim/modal/ubt.png', bounds:bounds2},
	{name:'Black Icon (Back)', src:'/img/frames/kaldheim/modal/bbt.png', bounds:bounds2},
	{name:'Red Icon (Back)', src:'/img/frames/kaldheim/modal/rbt.png', bounds:bounds2},
	{name:'Green Icon (Back)', src:'/img/frames/kaldheim/modal/gbt.png', bounds:bounds2},
	{name:'Multicolored Icon (Back)', src:'/img/frames/kaldheim/modal/mbt.png', bounds:bounds2},
	{name:'Artifact Icon (Back)', src:'/img/frames/kaldheim/modal/abt.png', bounds:bounds3},
	{name:'White Reminder (Back)', src:'/img/frames/kaldheim/modal/wbb.png', bounds:bounds3},
	{name:'Blue Reminder (Back)', src:'/img/frames/kaldheim/modal/ubb.png', bounds:bounds3},
	{name:'Black Reminder (Back)', src:'/img/frames/kaldheim/modal/bbb.png', bounds:bounds3},
	{name:'Red Reminder (Back)', src:'/img/frames/kaldheim/modal/rbb.png', bounds:bounds3},
	{name:'Green Reminder (Back)', src:'/img/frames/kaldheim/modal/gbb.png', bounds:bounds3},
	{name:'Multicolored Reminder (Back)', src:'/img/frames/kaldheim/modal/mbb.png', bounds:bounds3},
	{name:'Artifact Reminder (Back)', src:'/img/frames/kaldheim/modal/abb.png', bounds:bounds3}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	notify('If you make MDFC cards with this frame, we recommend adding "{right90}" before your card title.', 5)
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'm15Regular';
	//art bounds
	card.artBounds = {x:0.1047, y:0.0929, width:0.7907, height:0.4848};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:0.9213, y:0.6081, width:0.12, height:0.04, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.5, y:0.7762, width:0.75, height:0.2305};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', y:0.0462, width:0.9292, height:71/2100, oneLine:true, size:71/1638, align:'right', shadowX:-0.001, shadowY:0.0029, manaCost:true, manaSpacing:0},
		title: {name:'Title', text:'', x:0.0667, y:0.0362, width:0.8667, height:0.0543, oneLine:true, font:'belerenb', color:'white', size:0.0381, shadowX:0.0027, shadowY:0.002},
		type: {name:'Type', text:'', x:0.0734, y:0.5829, width:0.8534, height:0.0543, oneLine:true, font:'belerenb', color:'white', size:0.0324, shadowX:0.0027, shadowY:0.002},
		rules: {name:'Rules Text', text:'', x:0.086, y:0.6405, width:0.828, height:0.2739, size:0.0362},
		pt: {name:'Power/Toughness', text:'', x:0.7954, y:0.9029, width:0.1367, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center'},
		flipsideType: {name:'Flipside Type', text:'', x:0.068, y:0.892, width:0.364, height:0.0391, size:0.0234, color:'white', oneLine:true, font:'belerenb', shadowX:0.0014, shadowY:0.001},
		flipSideReminder: {name:'Flipside Text', text:'', x:0.068, y:0.892, width:0.364, height:0.0391, size:0.0258, color:'white', oneLine:true, align:'right', shadowX:0.0014, shadowY:0.001}
	});
}
//loads available frames
loadFramePack();