//Create objects for common properties across available frames
var bounds = {x:-0.044, y:-1/35, width:2186/2010, height:2974/2814};
var ogBounds = {x:0, y:0, width:1, height:1};
var masks = [{name:'Border Extension', src:'/img/frames/margins/blackBorderExtension.png'}, {name:'Borderless Border Extension', src:'/img/frames/margins/borderlessBorderExtension.png'}, {name:'Box Topper Border Extension', src:'/img/frames/margins/boxTopperBorderExtension.png'}, {name:'Cornered Border Extension', src:'/img/frames/margins/blackCorners.png'}];
//defines available frames
availableFrames = [
	{name:'Black Extension', src:'/img/frames/margins/blackBorderExtension.png', bounds:bounds},
	{name:'Extended Art Extension', src:'/img/frames/margins/new/extendedArt.png', bounds: bounds}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = loadMarginVersion;
//loads available frames
loadFramePack();