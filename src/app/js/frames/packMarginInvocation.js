//Create objects for common properties across available frames
var bounds = {x:-0.044, y:-1/35, width:1.088, height:37/35};
var ogBounds = {x:0, y:0, width:1, height:1};
//defines available frames
availableFrames = [
	{name:'White Extension', src:'/img/frames/invocation/margins/w.png', bounds:bounds, ogBounds:ogBounds},
	{name:'Blue Extension', src:'/img/frames/invocation/margins/u.png', bounds:bounds, ogBounds:ogBounds},
	{name:'Black Extension', src:'/img/frames/invocation/margins/b.png', bounds:bounds, ogBounds:ogBounds},
	{name:'Red Extension', src:'/img/frames/invocation/margins/r.png', bounds:bounds, ogBounds:ogBounds},
	{name:'Green Extension', src:'/img/frames/invocation/margins/g.png', bounds:bounds, ogBounds:ogBounds},
	{name:'Multicolored Extension', src:'/img/frames/invocation/margins/m.png', bounds:bounds, ogBounds:ogBounds},
	{name:'Artifact Extension', src:'/img/frames/invocation/margins/a.png', bounds:bounds, ogBounds:ogBounds},

	{name:'White Extension (Multiverse Legends)', src:'/img/frames/invocation/mul/margins/w.png', bounds:bounds, ogBounds:ogBounds},
	{name:'Blue Extension (Multiverse Legends)', src:'/img/frames/invocation/mul/margins/u.png', bounds:bounds, ogBounds:ogBounds},
	{name:'Black Extension (Multiverse Legends)', src:'/img/frames/invocation/mul/margins/b.png', bounds:bounds, ogBounds:ogBounds},
	{name:'Red Extension (Multiverse Legends)', src:'/img/frames/invocation/mul/margins/r.png', bounds:bounds, ogBounds:ogBounds},
	{name:'Green Extension (Multiverse Legends)', src:'/img/frames/invocation/mul/margins/g.png', bounds:bounds, ogBounds:ogBounds},
	{name:'Multicolored Extension (Multiverse Legends)', src:'/img/frames/invocation/mul/margins/m.png', bounds:bounds, ogBounds:ogBounds},
	{name:'Artifact Extension (Multiverse Legends)', src:'/img/frames/invocation/mul/margins/a.png', bounds:bounds, ogBounds:ogBounds},

	{name:'White Extension (Extended Art)', src:'/img/frames/akh/invocation/extended/margins/w.png', bounds:bounds, ogBounds:ogBounds},
	{name:'Blue Extension (Extended Art)', src:'/img/frames/akh/invocation/extended/margins/u.png', bounds:bounds, ogBounds:ogBounds},
	{name:'Black Extension (Extended Art)', src:'/img/frames/akh/invocation/extended/margins/b.png', bounds:bounds, ogBounds:ogBounds},
	{name:'Red Extension (Extended Art)', src:'/img/frames/akh/invocation/extended/margins/r.png', bounds:bounds, ogBounds:ogBounds},
	{name:'Green Extension (Extended Art)', src:'/img/frames/akh/invocation/extended/margins/g.png', bounds:bounds, ogBounds:ogBounds},
	{name:'Multicolored Extension (Extended Art)', src:'/img/frames/akh/invocation/extended/margins/m.png', bounds:bounds, ogBounds:ogBounds},
	{name:'Artifact Extension (Extended Art)', src:'/img/frames/akh/invocation/extended/margins/a.png', bounds:bounds, ogBounds:ogBounds}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = loadMarginVersion;
//loads available frames
loadFramePack();