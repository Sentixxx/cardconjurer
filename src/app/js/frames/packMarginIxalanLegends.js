//Create objects for common properties across available frames
var bounds = {x:-89/2010, y:-81/2814, width:2188/2010, height:2976/2814};
var ogBounds = {x:0, y:0, width:1, height:1};
//defines available frames
availableFrames = [
	{name:'Legends of Ixalan Margins', src:'/img/frames/ixalanLegends/margin.png', bounds:bounds, ogBounds:ogBounds}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;

document.querySelector('#loadFrameVersion').onclick = async function() {
	loadMarginVersion();

	await resetCardIrregularities({canvas:[getStandardWidth(), getStandardHeight(), 89/2010, 81/2814], resetOthers:false});

	drawTextBuffer();
	drawFrames();
	bottomInfoEdited();
	watermarkEdited();
	drawNewGuidelines();
}
//loads available frames
loadFramePack();