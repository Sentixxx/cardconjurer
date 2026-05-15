//Create objects for common properties across available frames
var masks = [{src:'/img/frames/m15/regular/m15MaskPinline.png', name:'Pinline'}, {src:'/img/frames/m15/regular/m15MaskTitle.png', name:'Title'}, {src:'/img/frames/m15/regular/m15MaskType.png', name:'Type'}, {src:'/img/frames/m15/regular/m15MaskRules.png', name:'Rules'}, {src:'/img/frames/m15/regular/m15MaskFrame.png', name:'Frame'}, {src:'/img/frames/m15/regular/m15MaskBorder.png', name:'Border'}];
// var bounds = {x:0.7573, y:0.8848, width:0.188, height:0.0733};
//defines available frames
availableFrames = [
	{name:'Purple Frame', src:'/img/frames/m15/custom/purple.png', masks:masks},
	{name:'Midnight Frame', src:'/img/frames/m15/custom/m15Midnight.png', masks:masks},
	{name:'PT Inner Fill', src:'/img/frames/m15/custom/m15CustomPTInnerFill.png', bounds:{x:0.79, y:0.8977, width:0.1414, height:0.04}}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = true;
//loads available frames
loadFramePack();