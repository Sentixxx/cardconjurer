//Create objects for common properties across available frames
var bounds = {x:0.0234, y:0.0167, width:0.952, height:0.1286};
//defines available frames
availableFrames = [
	{name:'White Legend Crown', src:'/img/frames/modal/crowns/nickname/w.png', bounds:bounds, complementary:8},
	{name:'Blue Legend Crown', src:'/img/frames/modal/crowns/nickname/u.png', bounds:bounds, complementary:8},
	{name:'Black Legend Crown', src:'/img/frames/modal/crowns/nickname/b.png', bounds:bounds, complementary:8},
	{name:'Red Legend Crown', src:'/img/frames/modal/crowns/nickname/r.png', bounds:bounds, complementary:8},
	{name:'Green Legend Crown', src:'/img/frames/modal/crowns/nickname/g.png', bounds:bounds, complementary:8},
	{name:'Multicolored Legend Crown', src:'/img/frames/modal/crowns/nickname/m.png', bounds:bounds, complementary:8},
	{name:'Artifact Legend Crown', src:'/img/frames/modal/crowns/nickname/a.png', bounds:bounds, complementary:8},
	{name:'Land Legend Crown', src:'/img/frames/modal/crowns/nickname/l.png', bounds:bounds, complementary:8},
	{name:'Legend Crown Cutout', src:'/img/frames/modal/nickname/cutout.svg', erase:true}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = true;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = null;
//loads available frames
loadFramePack();