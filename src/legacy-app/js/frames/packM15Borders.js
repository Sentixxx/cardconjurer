//Create objects for common properties across available frames
var masks = [{src:'/img/frames/m15/m15MaskBorderSliver.png', name:'Border'}, {src:'/img/frames/m15/m15MaskBorderSliverCrown.png', name:'Border (With Crown)'}, {src:'/img/frames/m15/regular/m15MaskBorder.png', name:'Full Border'}];
//defines available frames
availableFrames = [
	{name:'White Border', src:'/img/frames/white.png', masks:masks, noDefaultMask:true},
	{name:'Silver Border', src:'/img/frames/silver.png', masks:masks, noDefaultMask:true},
	{name:'Gold Border', src:'/img/frames/gold.png', masks:masks, noDefaultMask:true}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = true;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = null;
//loads available frames
loadFramePack();