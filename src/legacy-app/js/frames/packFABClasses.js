//defines available frames
availableFrames = [
	{name:'Brute', src:'/img/frames/fab/classes/brute.png'},
	{name:'Guardian', src:'/img/frames/fab/classes/guardian.png'},
	{name:'Illusionist', src:'/img/frames/fab/classes/illusionist.png'},
	{name:'Mechanologist', src:'/img/frames/fab/classes/mechanologist.png'},
	{name:'Ninja', src:'/img/frames/fab/classes/ninja.png'},
	{name:'Ranger', src:'/img/frames/fab/classes/ranger.png'},
	{name:'Runeblade', src:'/img/frames/fab/classes/runeblade.png'},
	{name:'Warrior', src:'/img/frames/fab/classes/warrior.png'},
	{name:'Wizard', src:'/img/frames/fab/classes/wizard.png'},
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