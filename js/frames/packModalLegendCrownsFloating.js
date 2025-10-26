//Create objects for common properties across available frames
var bounds = {x:0.0307, y:0.0191, width:0.9387, height:0.1024};
//defines available frames
availableFrames = [
	{name:'White Legend Crown', src:'/img/frames/modal/crowns/floating/w.png', bounds:bounds, complementary:8},
	{name:'Blue Legend Crown', src:'/img/frames/modal/crowns/floating/u.png', bounds:bounds, complementary:8},
	{name:'Black Legend Crown', src:'/img/frames/modal/crowns/floating/b.png', bounds:bounds, complementary:8},
	{name:'Red Legend Crown', src:'/img/frames/modal/crowns/floating/r.png', bounds:bounds, complementary:8},
	{name:'Green Legend Crown', src:'/img/frames/modal/crowns/floating/g.png', bounds:bounds, complementary:8},
	{name:'Multicolored Legend Crown', src:'/img/frames/modal/crowns/floating/m.png', bounds:bounds, complementary:8},
	{name:'Artifact Legend Crown', src:'/img/frames/modal/crowns/floating/a.png', bounds:bounds, complementary:8},
	{name:'Land Legend Crown', src:'/img/frames/modal/crowns/floating/l.png', bounds:bounds, complementary:8},
	{name:'Legend Crown Border Cover', src:'/img/black.png', bounds:{x:0.0394, y:0.0277, width:0.9214, height:0.0177}},
	{name:'Legend Crown Cutout', src:'/img/frames/modal/crowns/cutout.svg', erase:true},
	{name:'Legend Crown Outline (Place this under crown layer)', src:'/img/frames/m15/crowns/m15CrownFloatingOutline.png', bounds:{x:0.028, y:0.0172, width:0.944, height:0.1062}}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = true;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = null;
//loads available frames
loadFramePack();