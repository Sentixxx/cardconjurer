//Create objects for common properties across available frames
var masks = [{src:'/img/frames/mysticalArchive/margin/maskPinline.png', name:'Pinline'}, {src:'/img/frames/mysticalArchive/margin/maskPinlineRight.png', name:'Pinline (Right)'}];
var bounds = {x:-0.044, y:-1/35, width:2186/2010, height:2974/2814};
var ogBounds = {x:0, y:0, width:1, height:1};
//defines available frames
availableFrames = [
	{name:'White Extension', src:'/img/frames/mysticalArchive/margin/w.png', bounds:bounds, ogBounds:ogBounds, masks:masks},
	{name:'Blue Extension', src:'/img/frames/mysticalArchive/margin/u.png', bounds:bounds, ogBounds:ogBounds, masks:masks},
	{name:'Black Extension', src:'/img/frames/mysticalArchive/margin/b.png', bounds:bounds, ogBounds:ogBounds, masks:masks},
	{name:'Red Extension', src:'/img/frames/mysticalArchive/margin/r.png', bounds:bounds, ogBounds:ogBounds, masks:masks},
	{name:'Green Extension', src:'/img/frames/mysticalArchive/margin/g.png', bounds:bounds, ogBounds:ogBounds, masks:masks},
	{name:'Multicolored Extension', src:'/img/frames/mysticalArchive/margin/m.png', bounds:bounds, ogBounds:ogBounds, masks:masks},
	{name:'Artifact Extension', src:'/img/frames/mysticalArchive/margin/a.png', bounds:bounds, ogBounds:ogBounds, masks:masks},
	{name:'Land Extension', src:'/img/frames/mysticalArchive/margin/l.png', bounds:bounds, ogBounds:ogBounds, masks:masks}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = loadMarginVersion;
//loads available frames
loadFramePack();