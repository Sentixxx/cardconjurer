//Create objects for common properties across available frames
var masks = [];
var bounds = {x:244/1500, y:51/2100, width:1012/1500, height:64/2100};
//defines available frames
availableFrames = [
	{name:'White Inner Crown (Nyx)', src:'/img/frames/etched/regular/innerCrowns/nyx/w.png', bounds:bounds},
	{name:'Blue Inner Crown (Nyx)', src:'/img/frames/etched/regular/innerCrowns/nyx/u.png', bounds:bounds},
	{name:'Black Inner Crown (Nyx)', src:'/img/frames/etched/regular/innerCrowns/nyx/b.png', bounds:bounds},
	{name:'Red Inner Crown (Nyx)', src:'/img/frames/etched/regular/innerCrowns/nyx/r.png', bounds:bounds},
	{name:'Green Inner Crown (Nyx)', src:'/img/frames/etched/regular/innerCrowns/nyx/g.png', bounds:bounds},
	{name:'Multicolored Inner Crown (Nyx)', src:'/img/frames/etched/regular/innerCrowns/nyx/m.png', bounds:bounds},
	{name:'Artifact Inner Crown (Nyx)', src:'/img/frames/etched/regular/innerCrowns/nyx/a.png', bounds:bounds},

	{name:'White Inner Crown (Companion)', src:'/img/frames/etched/regular/innerCrowns/companion/w.png', bounds:bounds},
	{name:'Blue Inner Crow (Companion)', src:'/img/frames/etched/regular/innerCrowns/companion/u.png', bounds:bounds},
	{name:'Black Inner Crown (Companion)', src:'/img/frames/etched/regular/innerCrowns/companion/b.png', bounds:bounds},
	{name:'Red Inner Crown (Companion)', src:'/img/frames/etched/regular/innerCrowns/companion/r.png', bounds:bounds},
	{name:'Green Inner Crown (Companion)', src:'/img/frames/etched/regular/innerCrowns/companion/g.png', bounds:bounds},
	{name:'Multicolored Inner Crown (Companion)', src:'/img/frames/etched/regular/innerCrowns/companion/m.png', bounds:bounds},
	{name:'Artifact Inner Crown (Companion)', src:'/img/frames/etched/regular/innerCrowns/companion/a.png', bounds:bounds},
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = true;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = null;
//loads available frames
loadFramePack();