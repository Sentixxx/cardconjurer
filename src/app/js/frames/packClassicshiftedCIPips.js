//Create objects for common properties across available frames
var masks = [{src:'/img/frames/m15/ciPips/firstHalf.svg', name:'First Half'}, {src:'/img/frames/m15/ciPips/secondHalf.svg', name:'Second Half'}, {src:'/img/frames/m15/ciPips/firstThird.svg', name:'First Third'}, {src:'/img/frames/m15/ciPips/secondThird.svg', name:'Second Third'}, {src:'/img/frames/m15/ciPips/thirdThird.svg', name:'Third Third'}];
var bounds = {x:-0.0034, y:0.0058, width:1, height:1};
//defines available frames
availableFrames = [
	{name:'White Pip', src:'/img/frames/m15/ciPips/w.svg', masks:masks, complementary:5, bounds:bounds},
	{name:'Blue Pip', src:'/img/frames/m15/ciPips/u.svg', masks:masks, complementary:5, bounds:bounds},
	{name:'Black Pip', src:'/img/frames/m15/ciPips/b.svg', masks:masks, complementary:5, bounds:bounds},
	{name:'Red Pip', src:'/img/frames/m15/ciPips/r.svg', masks:masks, complementary:5, bounds:bounds},
	{name:'Green Pip', src:'/img/frames/m15/ciPips/g.svg', masks:masks, complementary:5, bounds:bounds},
	{name:'Color Identity Pip Base', src:'/img/frames/m15/ciPips/base.png', bounds:{x:0.0734, y:0.5805, width:0.0467, height:0.0334}}
];
// notify
notify('When using color identity pips, we recommend that you shift your Type text to the right with "{right66}".', 15);
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = true;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = null;
//loads available frames
loadFramePack();