//Create objects for common properties across available frames
var masks = [{src:'/img/frames/m15/regular/m15MaskPinline.png', name:'Pinline'}, {src:'/img/frames/m15/regular/m15MaskTitle.png', name:'Title'}, {src:'/img/frames/m15/regular/m15MaskType.png', name:'Type'}, {src:'/img/frames/m15/regular/m15MaskRules.png', name:'Rules'}, {src:'/img/frames/m15/regular/m15MaskFrame.png', name:'Frame'}, {src:'/img/frames/m15/regular/m15MaskBorder.png', name:'Border'}];
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/m15/devoid/m15DevoidFrameW.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/m15/devoid/m15DevoidFrameU.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/m15/devoid/m15DevoidFrameB.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/m15/devoid/m15DevoidFrameR.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/m15/devoid/m15DevoidFrameG.png', masks:masks},
	{name:'Multicolored Frame', src:'/img/frames/m15/devoid/m15DevoidFrameM.png', masks:masks},
	{name:'Artifact Frame', src:'/img/frames/m15/devoid/m15DevoidFrameA.png', masks:masks},
	{name:'Land Frame', src:'/img/frames/m15/devoid/m15DevoidFrameL.png', masks:masks},
	{name:'Devoid Power/Toughness', src:'/img/frames/m15/devoid/m15DevoidPT.png', bounds:{x:0.7573, y:0.8848, width:0.188, height:0.0733}}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//art bounds
	card.artBounds = {x:0.04, y:0.1039, width:0.92, height:0.9229};
	autoFitArt();
}
//loads available frames
loadFramePack();