//Create objects for common properties across available frames
var masks = [{src:'/img/frames/custom/brawl/floating.svg', name:'Crown Without Pinlines'}, {src:'/img/frames/custom/brawl/center.svg', name:'Center'}, {src:'/img/frames/custom/brawl/second.svg', name:'Second'}, {src:'/img/frames/custom/brawl/third.svg', name:'Third'}, {src:'/img/frames/custom/brawl/wings.svg', name:'Wings'}];
var bounds = {x:0.0094, y:0.0005, width:0.9814, height:0.1853};
//defines available frames
availableFrames = [
	{name:'White Crown', src:'/img/frames/m15/transform/crowns/brawl/w.png', masks:masks, bounds:bounds, complementary:8},
	{name:'Blue Crown', src:'/img/frames/m15/transform/crowns/brawl/u.png', masks:masks, bounds:bounds, complementary:8},
	{name:'Black Crown', src:'/img/frames/m15/transform/crowns/brawl/b.png', masks:masks, bounds:bounds, complementary:8},
	{name:'Red Crown', src:'/img/frames/m15/transform/crowns/brawl/r.png', masks:masks, bounds:bounds, complementary:8},
	{name:'Green Crown', src:'/img/frames/m15/transform/crowns/brawl/g.png', masks:masks, bounds:bounds, complementary:8},
	{name:'Multicolored Crown', src:'/img/frames/m15/transform/crowns/brawl/m.png', masks:masks, bounds:bounds, complementary:8},
	{name:'Artifact Crown', src:'/img/frames/m15/transform/crowns/brawl/a.png', masks:masks, bounds:bounds, complementary:8},
	{name:'Land Crown', src:'/img/frames/m15/transform/crowns/brawl/l.png', masks:masks, bounds:bounds, complementary:8},
	{name:'Legend Crown Cover', src:'/img/frames/m15/transform/crowns/brawl/cover.svg'},
	{name:'Legend Crown Cutout', src:'/img/frames/modal/crowns/cutout.svg', erase:true}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = true;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = null;
//loads available frames
loadFramePack();