//Create objects for common properties across available frames
var masks = [{src:'/img/frames/m15/crowns/m15MaskLegendCrown.png', name:'Crown Without Pinlines'}, {src:'/img/frames/m15/crowns/m15MaskLegendCrownPinline.png', name:'Crown With Pinlines'}];
var bounds = {x:0.0274, y:0.0191, width:0.9454, height:0.1667};
//defines available frames
availableFrames = [
	{name:'White Legend Crown', src:'/img/frames/m15/transform/crowns/ub/regular/w.png', masks:masks, bounds:bounds, complementary:16},
	{name:'Blue Legend Crown', src:'/img/frames/m15/transform/crowns/ub/regular/u.png', masks:masks, bounds:bounds, complementary:16},
	{name:'Black Legend Crown', src:'/img/frames/m15/transform/crowns/ub/regular/b.png', masks:masks, bounds:bounds, complementary:16},
	{name:'Red Legend Crown', src:'/img/frames/m15/transform/crowns/ub/regular/r.png', masks:masks, bounds:bounds, complementary:16},
	{name:'Green Legend Crown', src:'/img/frames/m15/transform/crowns/ub/regular/g.png', masks:masks, bounds:bounds, complementary:16},
	{name:'Multicolored Legend Crown', src:'/img/frames/m15/transform/crowns/ub/regular/m.png', masks:masks, bounds:bounds, complementary:16},
	{name:'Artifact Legend Crown', src:'/img/frames/m15/transform/crowns/ub/regular/a.png', masks:masks, bounds:bounds, complementary:16},
	{name:'Land Legend Crown', src:'/img/frames/m15/transform/crowns/ub/regular/l.png', masks:masks, bounds:bounds, complementary:16},
	{name:'White Legend Crown (Back)', src:'/img/frames/m15/transform/crowns/ub/regular/new/w.png', masks:masks, bounds:bounds, complementary:16},
	{name:'Blue Legend Crown (Back)', src:'/img/frames/m15/transform/crowns/ub/regular/new/u.png', masks:masks, bounds:bounds, complementary:16},
	{name:'Black Legend Crown (Back)', src:'/img/frames/m15/transform/crowns/ub/regular/new/b.png', masks:masks, bounds:bounds, complementary:16},
	{name:'Red Legend Crown (Back)', src:'/img/frames/m15/transform/crowns/ub/regular/new/r.png', masks:masks, bounds:bounds, complementary:16},
	{name:'Green Legend Crown (Back)', src:'/img/frames/m15/transform/crowns/ub/regular/new/g.png', masks:masks, bounds:bounds, complementary:16},
	{name:'Multicolored Legend Crown (Back)', src:'/img/frames/m15/transform/crowns/ub/regular/new/m.png', masks:masks, bounds:bounds, complementary:16},
	{name:'Artifact Legend Crown (Back)', src:'/img/frames/m15/transform/crowns/ub/regular/new/a.png', masks:masks, bounds:bounds, complementary:16},
	{name:'Land Legend Crown (Back)', src:'/img/frames/m15/transform/crowns/ub/regular/new/l.png', masks:masks, bounds:bounds, complementary:16},
	{name:'Legend Crown Border Cover', src:'/img/black.png', bounds:{x:0.0394, y:0.0277, width:0.9214, height:0.0177}}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = true;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = null;
//loads available frames
loadFramePack();