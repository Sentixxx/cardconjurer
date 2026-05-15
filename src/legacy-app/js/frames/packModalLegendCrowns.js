//Create objects for common properties across available frames
// var masks = [{src:'/img/frames/m15/crowns/m15MaskLegendCrown.png', name:'Crown Without Pinlines'}, {src:'/img/frames/m15/crowns/m15MaskLegendCrownPinline.png', name:'Crown With Pinlines'}];
var bounds = {x:0.0274, y:0.0191, width:0.9454, height:0.1667};
//defines available frames
availableFrames = [
	{name:'White Legend Crown', src:'/img/frames/modal/crowns/regular/w.png', bounds:bounds, complementary:8},
	{name:'Blue Legend Crown', src:'/img/frames/modal/crowns/regular/u.png', bounds:bounds, complementary:8},
	{name:'Black Legend Crown', src:'/img/frames/modal/crowns/regular/b.png', bounds:bounds, complementary:8},
	{name:'Red Legend Crown', src:'/img/frames/modal/crowns/regular/r.png', bounds:bounds, complementary:8},
	{name:'Green Legend Crown', src:'/img/frames/modal/crowns/regular/g.png', bounds:bounds, complementary:8},
	{name:'Multicolored Legend Crown', src:'/img/frames/modal/crowns/regular/m.png', bounds:bounds, complementary:8},
	{name:'Artifact Legend Crown', src:'/img/frames/modal/crowns/regular/a.png', bounds:bounds, complementary:8},
	{name:'Land Legend Crown', src:'/img/frames/modal/crowns/regular/l.png', bounds:bounds, complementary:8},
	{name:'Legend Crown Border Cover', src:'/img/frames/modal/crowns/regular/cover.svg'}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = true;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = null;
//loads available frames
loadFramePack();