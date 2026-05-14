//Create objects for common properties across available frames
var masks = [{src:'/img/frames/attraction/maskPinline.png', name:'Pinline'}, {src:'/img/frames/attraction/maskBorder.png', name:'Border'}];
//defines available frames
availableFrames = [
	{name:'Attraction Frame', src:'/img/frames/attraction/attraction.png', masks:masks},
	{name:'Light 2', src:'/img/frames/attraction/2.png', bounds:{x:1362/1500, y:1443/2100, width:65/1500, height:65/2100}},
	{name:'Light 3', src:'/img/frames/attraction/3.png', bounds:{x:1362/1500, y:1543/2100, width:65/1500, height:65/2100}},
	{name:'Light 4', src:'/img/frames/attraction/4.png', bounds:{x:1362/1500, y:1643/2100, width:65/1500, height:65/2100}},
	{name:'Light 5', src:'/img/frames/attraction/5.png', bounds:{x:1362/1500, y:1743/2100, width:65/1500, height:65/2100}},
	{name:'Light 6', src:'/img/frames/attraction/6.png', bounds:{x:1362/1500, y:1843/2100, width:65/1500, height:65/2100}},
	{name:'Holo Stamp', src:'/img/frames/m15/holoStamps/m15HoloStampA2.png', bounds:{x:0.436, y:0.9034, width:0.128, height:0.0458}},
	{name:'Acorn Holo Stamp', src:'/img/frames/m15/holoStamps/acorn.png', bounds:{x:0.4554, y:0.9129, width:0.0894, height:0.0381}}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'attraction';
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
		title: {name:'Title', text:'', x:232/1500, y:111/2100, width:1036/1500, height:125/2100, oneLine:true, font:'belerenb', size:0.0381, align:'center', color:'white'},
		type: {name:'Type', text:'', x:0.0854, y:0.5664, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0324, color:'white'},
		rules: {name:'Rules Text', text:'', x:0.086, y:0.6303, width:0.828, height:0.2875, size:0.0362},
		pt: {name:'Power/Toughness', text:'', x:0.7928, y:0.902, width:0.1367, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center'}
	});
}
//loads available frames
loadFramePack();
//Only for the main version as the webpage loads:
if (!card.text) {
	document.querySelector('#loadFrameVersion').click();
}