//Create objects for common properties across available frames
var bounds = {x:0.164, y:0.0239, width:0.672, height:0.0239};
//defines available frames
availableFrames = [
	{name:'White Inner Crown (Nyx)', src:'/img/frames/m15/innerCrowns/m15InnerCrownWNyx.png', bounds:bounds},
	{name:'Blue Inner Crown (Nyx)', src:'/img/frames/m15/innerCrowns/m15InnerCrownUNyx.png', bounds:bounds},
	{name:'Black Inner Crown (Nyx)', src:'/img/frames/m15/innerCrowns/m15InnerCrownBNyx.png', bounds:bounds},
	{name:'Red Inner Crown (Nyx)', src:'/img/frames/m15/innerCrowns/m15InnerCrownRNyx.png', bounds:bounds},
	{name:'Green Inner Crown (Nyx)', src:'/img/frames/m15/innerCrowns/m15InnerCrownGNyx.png', bounds:bounds},
	{name:'Multicolored Inner Crown (Nyx)', src:'/img/frames/m15/innerCrowns/m15InnerCrownMNyx.png', bounds:bounds},
	{name:'Artifact Inner Crown (Nyx)', src:'/img/frames/m15/innerCrowns/m15InnerCrownANyx.png', bounds:bounds},

	{name:'White Inner Crown (Nyx Universes Beyond)', src:'/img/frames/m15/innerCrowns/m15InnerCrownWNyxUB.png', bounds:bounds},
	{name:'Blue Inner Crown (Nyx Universes Beyond)', src:'/img/frames/m15/innerCrowns/m15InnerCrownUNyxUB.png', bounds:bounds},
	{name:'Black Inner Crown (Nyx Universes Beyond)', src:'/img/frames/m15/innerCrowns/m15InnerCrownBNyxUB.png', bounds:bounds},
	{name:'Red Inner Crown (Nyx Universes Beyond)', src:'/img/frames/m15/innerCrowns/m15InnerCrownRNyxUB.png', bounds:bounds},
	{name:'Green Inner Crown (Nyx Universes Beyond)', src:'/img/frames/m15/innerCrowns/m15InnerCrownGNyxUB.png', bounds:bounds},
	{name:'Multicolored Inner Crown (Nyx Universes Beyond)', src:'/img/frames/m15/innerCrowns/m15InnerCrownMNyxUB.png', bounds:bounds},
	{name:'Artifact Inner Crown (Nyx Universes Beyond)', src:'/img/frames/m15/innerCrowns/m15InnerCrownANyxUB.png', bounds:bounds},

	{name:'White Inner Crown (Companion)', src:'/img/frames/m15/innerCrowns/m15InnerCrownWCompanion.png', bounds:bounds},
	{name:'Blue Inner Crown (Companion)', src:'/img/frames/m15/innerCrowns/m15InnerCrownUCompanion.png', bounds:bounds},
	{name:'Black Inner Crown (Companion)', src:'/img/frames/m15/innerCrowns/m15InnerCrownBCompanion.png', bounds:bounds},
	{name:'Red Inner Crown (Companion)', src:'/img/frames/m15/innerCrowns/m15InnerCrownRCompanion.png', bounds:bounds},
	{name:'Green Inner Crown (Companion)', src:'/img/frames/m15/innerCrowns/m15InnerCrownGCompanion.png', bounds:bounds},
	{name:'Multicolored Inner Crown (Companion)', src:'/img/frames/m15/innerCrowns/m15InnerCrownMCompanion.png', bounds:bounds},
	{name:'Artifact Inner Crown (Companion)', src:'/img/frames/m15/innerCrowns/m15InnerCrownACompanion.png', bounds:bounds}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = true;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = null;
//loads available frames
loadFramePack();