//defines available frames
availableFrames = [
	{name:'Fabled Action', src:'/img/frames/fab/fabled/fabled.png'},
	{name:'Pitch (1)', src:'/img/frames/fab/fabled/1.svg'},
	{name:'Pitch (2)', src:'/img/frames/fab/fabled/2.svg'},
	{name:'Pitch (3)', src:'/img/frames/fab/fabled/3.svg'}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = LoadFABVersion;
//loads available frames
loadFramePack();