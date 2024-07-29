//Create objects for common properties across available frames
var bounds = {x:-89/2010, y:-81/2814, width:2188/2010, height:2976/2814};
var ogBounds = {x:0, y:0, width:1, height:1};
var masks = [{src:'/img/frames/memoryCorridor/margins/maskHighlights.png', name:'Highlights'}];
//defines available frames
availableFrames = [
	{name:'White Extension', src:'/img/frames/memoryCorridor/margins/w.png', bounds:bounds, ogBounds:ogBounds, masks:masks},
	{name:'Blue Extension', src:'/img/frames/memoryCorridor/margins/u.png', bounds:bounds, ogBounds:ogBounds, masks:masks},
	{name:'Black Extension', src:'/img/frames/memoryCorridor/margins/b.png', bounds:bounds, ogBounds:ogBounds, masks:masks},
	{name:'Red Extension', src:'/img/frames/memoryCorridor/margins/r.png', bounds:bounds, ogBounds:ogBounds, masks:masks},
	{name:'Green Extension', src:'/img/frames/memoryCorridor/margins/g.png', bounds:bounds, ogBounds:ogBounds, masks:masks},
	{name:'Multicolored Extension', src:'/img/frames/memoryCorridor/margins/m.png', bounds:bounds, ogBounds:ogBounds, masks:masks},
	{name:'Artifact Extension', src:'/img/frames/memoryCorridor/margins/a.png', bounds:bounds, ogBounds:ogBounds, masks:masks},
	{name:'Land Extension', src:'/img/frames/memoryCorridor/margins/l.png', bounds:bounds, ogBounds:ogBounds, masks:masks},
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