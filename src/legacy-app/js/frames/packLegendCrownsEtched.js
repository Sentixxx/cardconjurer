//Create objects for common properties across available frames
var masks = [];
var bounds = {x:0.0307, y:0.0191, width:0.9387, height:0.092};
//defines available frames
availableFrames = [
	{name:'White Legend Crown', src:'/img/frames/etched/regular/crowns/w.png', bounds:bounds, complementary:9},
	{name:'Blue Legend Crown', src:'/img/frames/etched/regular/crowns/u.png', bounds:bounds, complementary:9},
	{name:'Black Legend Crown', src:'/img/frames/etched/regular/crowns/b.png', bounds:bounds, complementary:9},
	{name:'Red Legend Crown', src:'/img/frames/etched/regular/crowns/r.png', bounds:bounds, complementary:9},
	{name:'Green Legend Crown', src:'/img/frames/etched/regular/crowns/g.png', bounds:bounds, complementary:9},
	{name:'Multicolored Legend Crown', src:'/img/frames/etched/regular/crowns/m.png', bounds:bounds, complementary:9},
	{name:'Artifact Legend Crown', src:'/img/frames/etched/regular/crowns/a.png', bounds:bounds, complementary:9},
	{name:'Land Crown', src:'/img/frames/etched/regular/crowns/l.png', bounds:bounds, complementary:9},
	{name:'Colorless Crown', src:'/img/frames/etched/regular/crowns/c.png', bounds:bounds, complementary:9},
	{name:'Legend Crown Cover', src:'/img/frames/etched/regular/crowns/cover.svg'}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = true;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = null;
//loads available frames
loadFramePack();