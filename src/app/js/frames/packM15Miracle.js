//Create objects for common properties across available frames
var bounds = {x:0.04, y:0.0286, width:0.92, height:0.5324};
//defines available frames
availableFrames = [
	{name:'White Miracle Frame', src:'/img/frames/m15/miracle/w.png', bounds:bounds},
	{name:'Blue Miracle Frame', src:'/img/frames/m15/miracle/u.png', bounds:bounds},
	{name:'Black Miracle Frame', src:'/img/frames/m15/miracle/b.png', bounds:bounds},
	{name:'Red Miracle Frame', src:'/img/frames/m15/miracle/r.png', bounds:bounds},
	{name:'Green Miracle Frame', src:'/img/frames/m15/miracle/g.png', bounds:bounds},
	{name:'Multicolored Miracle Frame', src:'/img/frames/m15/miracle/m.png', bounds:bounds},
	{name:'Artifact Miracle Frame', src:'/img/frames/m15/miracle/a.png', bounds:bounds},
	{name:'Land Miracle Frame', src:'/img/frames/m15/miracle/l.png', bounds:bounds}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = true;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = null;
//loads available frames
loadFramePack();