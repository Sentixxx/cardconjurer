//Create objects for common properties across available frames
var masks = [{src:'/img/frames/m15/new/pinline.png', name:'Pinline'}, {src:'/img/frames/m15/new/title.png', name:'Title'}, {src:'/img/frames/m15/new/type.png', name:'Type'}, {src:'/img/frames/m15/new/rules.png', name:'Rules'}, {src:'/img/frames/m15/new/frame.png', name:'Frame'}, {src:'/img/frames/m15/new/border.png', name:'Border'}];
var bounds = {x:329/2010, y:70/2814, width:1353/2010, height:64/2814};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/m15/new/nyx/w.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/m15/new/nyx/u.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/m15/new/nyx/b.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/m15/new/nyx/r.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/m15/new/nyx/g.png', masks:masks},
	{name:'Multicolored Frame', src:'/img/frames/m15/new/nyx/m.png', masks:masks},
	{name:'Artifact Frame', src:'/img/frames/m15/new/nyx/a.png', masks:masks},

	{name:'White Inner Crown (Companion)', src:'/img/frames/m15/innerCrowns/new/companion/w.png', bounds:bounds},
	{name:'Blue Inner Crown (Companion)', src:'/img/frames/m15/innerCrowns/new/companion/u.png', bounds:bounds},
	{name:'Black Inner Crown (Companion)', src:'/img/frames/m15/innerCrowns/new/companion/b.png', bounds:bounds},
	{name:'Red Inner Crown (Companion)', src:'/img/frames/m15/innerCrowns/new/companion/r.png', bounds:bounds},
	{name:'Green Inner Crown (Companion)', src:'/img/frames/m15/innerCrowns/new/companion/g.png', bounds:bounds},
	{name:'Multicolored Inner Crown (Companion)', src:'/img/frames/m15/innerCrowns/new/companion/m.png', bounds:bounds},
	{name:'Artifact Inner Crown (Companion)', src:'/img/frames/m15/innerCrowns/new/companion/a.png', bounds:bounds}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = true;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = null;
//loads available frames
loadFramePack();