//Create objects for common properties across available frames
var masks = [{src:'/img/frames/m15/crowns/new/maskCrown.png', name:'Crown Without Pinlines'}, {src:'/img/frames/m15/crowns/new/maskCrownPinline.png', name:'Crown With Pinlines'}];
var bounds = {x:44/2010, y:53/2814, width:1922/2010, height:493/2814};
//defines available frames
availableFrames = [
	{name:'White Legend Crown', src:'/img/frames/m15/crowns/new/w.png', masks:masks, bounds:bounds, complementary:9},
	{name:'Blue Legend Crown', src:'/img/frames/m15/crowns/new/u.png', masks:masks, bounds:bounds, complementary:9},
	{name:'Black Legend Crown', src:'/img/frames/m15/crowns/new/b.png', masks:masks, bounds:bounds, complementary:9},
	{name:'Red Legend Crown', src:'/img/frames/m15/crowns/new/r.png', masks:masks, bounds:bounds, complementary:9},
	{name:'Green Legend Crown', src:'/img/frames/m15/crowns/new/g.png', masks:masks, bounds:bounds, complementary:9},
	{name:'Multicolored Legend Crown', src:'/img/frames/m15/crowns/new/m.png', masks:masks, bounds:bounds, complementary:9},
	{name:'Artifact Legend Crown', src:'/img/frames/m15/crowns/new/a.png', masks:masks, bounds:bounds, complementary:9},
	{name:'Land Legend Crown', src:'/img/frames/m15/crowns/new/l.png', masks:masks, bounds:bounds, complementary:9},
	{name:'Colorless Legend Crown', src:'/img/frames/m15/crowns/new/c.png', masks:masks, bounds:bounds, complementary:9},
	{name:'Legend Crown Border Cover', src:'/img/black.png', bounds:{x:0, y:0, width:1, height:137/2814}}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = true;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = null;
//loads available frames
loadFramePack();