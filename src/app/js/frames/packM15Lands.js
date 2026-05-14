//Create objects for common properties across available frames
var masks = [{src:'/img/frames/m15/regular/m15MaskPinline.png', name:'Pinline'}, {src:'/img/frames/m15/regular/m15MaskTitle.png', name:'Title'}, {src:'/img/frames/m15/regular/m15MaskType.png', name:'Type'}, {src:'/img/frames/m15/regular/m15MaskRules.png', name:'Rules'}, {src:'/img/frames/m15/regular/m15MaskFrame.png', name:'Frame'}, {src:'/img/frames/m15/regular/m15MaskBorder.png', name:'Border'}];
var bounds = {x:0.3267, y:0.6491, width:0.3474, height:0.2496}
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/m15/regular/lw.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/m15/regular/lu.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/m15/regular/lb.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/m15/regular/lr.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/m15/regular/lg.png', masks:masks},
	{name:'Multicolored Frame', src:'/img/frames/m15/regular/lm.png', masks:masks},
	{name:'Colorless Frame', src:'/img/frames/m15/regular/ll.png', masks:masks},
	{name:'Plains Watermark', src:'/img/frames/m15/basics/w.png', bounds:bounds},
	{name:'Island Watermark', src:'/img/frames/m15/basics/u.png', bounds:bounds},
	{name:'Swamp Watermark', src:'/img/frames/m15/basics/b.png', bounds:bounds},
	{name:'Mountain Watermark', src:'/img/frames/m15/basics/r.png', bounds:bounds},
	{name:'Forest Watermark', src:'/img/frames/m15/basics/g.png', bounds:bounds},
	{name:'Wastes Watermark', src:'/img/frames/m15/basics/c.png', bounds:bounds}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = true;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = null;
//loads available frames
loadFramePack();