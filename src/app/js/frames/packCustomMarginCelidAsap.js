//Create objects for common properties across available frames
var bounds = {x:-0.044, y:0.6143, width:1.088, height:0.4143};
var ogBounds = {x:0, y:0, width:1, height:1};
//defines available frames
availableFrames = [
	{name:'White Extension', src:'/img/frames/custom/celid/asap/margins/w.png', bounds:bounds, ogBounds:ogBounds},
	{name:'Blue Extension', src:'/img/frames/custom/celid/asap/margins/u.png', bounds:bounds, ogBounds:ogBounds},
	{name:'Black Extension', src:'/img/frames/custom/celid/asap/margins/b.png', bounds:bounds, ogBounds:ogBounds},
	{name:'Red Extension', src:'/img/frames/custom/celid/asap/margins/r.png', bounds:bounds, ogBounds:ogBounds},
	{name:'Green Extension', src:'/img/frames/custom/celid/asap/margins/g.png', bounds:bounds, ogBounds:ogBounds},
	{name:'Multicolored Extension', src:'/img/frames/custom/celid/asap/margins/m.png', bounds:bounds, ogBounds:ogBounds},
	{name:'Artifact Extension', src:'/img/frames/custom/celid/asap/margins/a.png', bounds:bounds, ogBounds:ogBounds}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = loadMarginVersion;
//loads available frames
loadFramePack();