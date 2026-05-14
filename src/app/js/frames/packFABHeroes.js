//defines available frames
availableFrames = [
	{name:'Aria', src:'/img/frames/fab/heroes/aria.png'},
	{name:'Demonastery', src:'/img/frames/fab/heroes/demonastery.png'},
	{name:'Metrix', src:'/img/frames/fab/heroes/metrix.png'},
	{name:'Misteria', src:'/img/frames/fab/heroes/misteria.png'},
	{name:'Savage Lands', src:'/img/frames/fab/heroes/savageLands.png'},
	{name:'Solana', src:'/img/frames/fab/heroes/solana.png'},
	{name:'Solana (Special)', src:'/img/frames/fab/heroes/solana2.png'},
	{name:'The Pits', src:'/img/frames/fab/heroes/thePits.png'},
	{name:'Volcor', src:'/img/frames/fab/heroes/volcor.png'}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = LoadFABVersion;
//loads available frames
loadFramePack();