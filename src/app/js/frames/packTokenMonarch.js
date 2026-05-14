//Create objects for common properties across available frames
var masks = [{src:'/img/frames/token/monarch/pinline.svg', name:'Pinline (With Bevel)'}, {src:'/img/frames/token/monarch/pinline2.svg', name:'Pinline'}, {src:'/img/frames/token/monarch/type.svg', name:'Type'}, {src:'/img/frames/token/monarch/rules.svg', name:'Rules'}];
//defines available frames
availableFrames = [
	{name:'Monarch Frame', src:'/img/frames/token/monarch/monarch.png', masks:masks}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'tokenMonarch';
	//art bounds
	card.artBounds = {x:0.04, y:0.0286, width:0.92, height:0.8953};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:0.9213, y:0.6553, width:0.12, height:0.0410, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.5, y:0.8177, width:0.75, height:0.1472};
	resetWatermark();
	//text
	loadTextOptions({
		title: {name:'Title', text:'', x:0.0854, y:0.6315, width:0.8292, height:0.0543, oneLine:true, font:'belerenbsc', size:0.0381, color:'#f4ce80', align:'center'},
		rules: {name:'Rules Text', text:'', x:0.086, y:0.6953, width:0.828, height:0.2239, size:0.0362},
	});
}
//loads available frames
loadFramePack();