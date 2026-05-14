//defines available frames
availableFrames = [
	{name:'Post-M15', src:'/img/frames/m15/theList/regular.svg'},
	{name:'Pre-M15', src:'/img/frames/m15/theList/old.svg'}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = true;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = null;
//loads available frames
loadFramePack();