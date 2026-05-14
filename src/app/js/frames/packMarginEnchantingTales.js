//Create objects for common properties across available frames
var bounds = {x:-0.044, y:-1/35, width:2186/2010, height:2974/2814};
var ogBounds = {x:0, y:0, width:1, height:1};
//defines available frames
availableFrames = [
	{name:'White Extension', src:'/img/frames/enchantingTales/margin/w.png', bounds:bounds, ogBounds:ogBounds},
	{name:'Blue Extension', src:'/img/frames/enchantingTales/margin/u.png', bounds:bounds, ogBounds:ogBounds},
	{name:'Black Extension', src:'/img/frames/enchantingTales/margin/b.png', bounds:bounds, ogBounds:ogBounds},
	{name:'Red Extension', src:'/img/frames/enchantingTales/margin/r.png', bounds:bounds, ogBounds:ogBounds},
	{name:'Green Extension', src:'/img/frames/enchantingTales/margin/g.png', bounds:bounds, ogBounds:ogBounds},
	{name:'Multicolored Extension', src:'/img/frames/enchantingTales/margin/m.png', bounds:bounds, ogBounds:ogBounds},
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = loadMarginVersion;
//loads available frames
loadFramePack();