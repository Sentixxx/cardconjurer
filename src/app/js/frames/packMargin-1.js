//Create objects for common properties across available frames
var bounds = {x:-0.044, y:-1/35, width:1.088, height:37/35};
var ogBounds = {x:0, y:0, width:1, height:1};
var masks = [{name:'Border Extension', src:'/img/frames/margins/blackBorderExtension.png'}, {name:'Borderless Border Extension', src:'/img/frames/margins/borderlessBorderExtension.png'}, {name:'Box Topper Border Extension', src:'/img/frames/margins/boxTopperBorderExtension.png'}, {name:'Cornered Border Extension', src:'/img/frames/margins/blackCorners.png'}];
//defines available frames
availableFrames = [
	{name:'Black Extension', src:'/img/frames/margins/blackBorderExtension.png', bounds:bounds},
	{name:'Borderless Extension', src:'/img/frames/margins/borderlessBorderExtension.png', bounds:bounds},
	{name:'Borderless Extension (Bottom Bar)', src:'/img/frames/margins/borderlessBottomBarExtension.png', bounds:bounds},
	{name:'Box Topper Extension', src:'/img/frames/margins/boxTopperBorderExtension.png', bounds:bounds},
	{name:'Box Topper Extension (Short)', src:'/img/frames/margins/boxTopperShortBorderExtension.png', bounds:bounds},
	{name:'Box Topper Extension (Planeswalker)', src:'/img/frames/planeswalker/boxTopper/margin.png', bounds:bounds},
	{name:'Box Topper Extension (Promo / Tall Art)', src:'/img/frames/promo/extended/margin.png', bounds:bounds},
	{name:'Black Extension (Cornered)', src:'/img/frames/margins/blackCorners.png', bounds:bounds},
	{name:'White Border Extension', src:'/img/frames/white.png', ogBounds:ogBounds, bounds:bounds, masks:masks, noDefaultMask:true},
	{name:'Silver Border Extension', src:'/img/frames/silver.png', ogBounds:ogBounds, bounds:bounds, masks:masks, noDefaultMask:true},
	{name:'Gold Border Extension', src:'/img/frames/gold.png', ogBounds:ogBounds, bounds:bounds, masks:masks, noDefaultMask:true},
	{name:'Pokemon Border Extension', src:'/img/frames/custom/pokemon/extension.png', ogBounds:ogBounds, bounds:bounds, masks:masks, noDefaultMask:true}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = loadMarginVersion;
//loads available frames
loadFramePack();