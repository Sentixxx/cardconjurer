//defines available frames
availableFrames = [
	{name:'Weapon', src:'/img/frames/fab/generic/weapon.png'},
	{name:'Equipment (Gray)', src:'/img/frames/fab/generic/equipment.png'},
	{name:'Equipment (Gold)', src:'/img/frames/fab/generic/equipment2.png'},
	{name:'Generic Action', src:'/img/frames/fab/generic/action.png'},
	{name:'Pitch (1)', src:'/img/frames/fab/pitch/1.svg'},
	{name:'Pitch (2)', src:'/img/frames/fab/pitch/2.svg'},
	{name:'Pitch (3)', src:'/img/frames/fab/pitch/3.svg'},
	{name:'Spear', src:'/img/frames/fab/addons/spear.svg'},
	{name:'Shield', src:'/img/frames/fab/addons/shield.svg'}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = LoadFABVersion;
//loads available frames
loadFramePack();