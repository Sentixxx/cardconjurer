//Create objects for common properties across available frames
var bounds = {x:0.4394, y:0.9015, width:0.1214, height:0.051};
//defines available frames
availableFrames = [
	{name:'White Holo Stamp', src:'/img/frames/planeswalker/holo/w.png', bounds:bounds},
	{name:'Blue Holo Stamp', src:'/img/frames/planeswalker/holo/u.png', bounds:bounds},
	{name:'Black Holo Stamp', src:'/img/frames/planeswalker/holo/b.png', bounds:bounds},
	{name:'Red Holo Stamp', src:'/img/frames/planeswalker/holo/r.png', bounds:bounds},
	{name:'Green Holo Stamp', src:'/img/frames/planeswalker/holo/g.png', bounds:bounds},
	{name:'Multicolored Holo Stamp', src:'/img/frames/planeswalker/holo/m.png', bounds:bounds},
	{name:'Artifact Holo Stamp', src:'/img/frames/planeswalker/holo/a.png', bounds:bounds},
	{name:'Land Holo Stamp', src:'/img/frames/planeswalker/holo/l.png', bounds:bounds}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = true;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = null;
//loads available frames
loadFramePack();