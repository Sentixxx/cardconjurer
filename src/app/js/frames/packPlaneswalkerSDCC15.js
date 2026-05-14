//Create objects for common properties across available frames
var masks = [{src:'/img/frames/planeswalker/regular/planeswalkerMaskPinline.png', name:'Pinline'}, {src:'/img/frames/planeswalker/regular/planeswalkerMaskTitle.png', name:'Title'}, {src:'/img/frames/planeswalker/regular/planeswalkerMaskType.png', name:'Type'}, {src:'/img/frames/planeswalker/regular/planeswalkerMaskBorder.png', name:'Border'}, {src:'/img/frames/planeswalker/maskLoyalty.png', name:'Loyalty'}];
//defines available frames
availableFrames = [
	{name:'Frame', src:'/img/frames/planeswalker/sdcc15/frame.svg', masks:masks},
	{name:'Transform Frame', src:'/img/frames/planeswalker/sdcc15/transform.svg', masks:masks}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'planeswalkerSDCC15';
	card.onload = '/js/frames/versionPlaneswalker.js';
	loadScript('/js/frames/versionPlaneswalker.js');
	//art bounds
	card.artBounds = {x:0.0394, y:0.0281, width:0.9214, height:0.8929};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:0.9227, y:0.5891, width:0.12, height:0.0381, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.5, y:0.7762, width:0.75, height:0.2305};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', y:0.0481, width:0.9292, height:71/2100, oneLine:true, size:71/1638, align:'right', shadowX:-0.001, shadowY:0.0029, manaCost:true, manaSpacing:0},
		title: {name:'Title', text:'', x:0.0867, y:0.0372, width:0.8267, height:0.0548, oneLine:true, font:'belerenb', size:0.0381, color:'#aaa'},
		type: {name:'Type', text:'', x:0.0867, y:0.5625, width:0.8267, height:0.0548, oneLine:true, font:'belerenb', size:0.0324, color:'#aaa'},
		ability0: {name:'Ability 1', text:'', x:0.18, y:0.6239, width:0.7467, height:0.0972, size:0.0353, color:'#aaa'},
		ability1: {name:'Ability 2', text:'', x:0.18, y:0, width:0.7467, height:0.0972, size:0.0353, color:'#aaa'},
		ability2: {name:'Ability 3', text:'', x:0.18, y:0, width:0.7467, height:0.0972, size:0.0353, color:'#aaa'},
		ability3: {name:'Ability 4', text:'', x:0.18, y:0, width:0.7467, height:0, size:0.0353, color:'#aaa'},
		loyalty: {name:'Loyalty', text:'', x:0.806, y:0.902, width:0.14, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center', color:'#aaa'}
	});
}
//loads available frames
loadFramePack();