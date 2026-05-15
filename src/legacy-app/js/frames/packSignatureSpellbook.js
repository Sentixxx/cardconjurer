//Create objects for common properties across available frames
var bounds = {x:0.7573, y:0.8848, width:0.188, height:0.0733};
//defines available frames
availableFrames = [
	{name:'White Frame (Gideon)', src:'/img/frames/m15/signatureSpellbook/gideon.png'},
	{name:'Blue Frame (Jace)', src:'/img/frames/m15/signatureSpellbook/jace.png'},
	{name:'Artifact Frame (Gideon)', src:'/img/frames/m15/signatureSpellbook/artifact.png'},
	{name:'White Power/Toughness', src:'/img/frames/m15/signatureSpellbook/gideonPT.png', bounds:bounds},
	{name:'Blue Power/Toughness', src:'/img/frames/m15/signatureSpellbook/jacePT.png', bounds:bounds},
	{name:'Artifact Power/Toughness', src:'/img/frames/m15/signatureSpellbook/artifactPT.png', bounds:bounds},
	{name:'Holo Stamp', src:'/img/frames/m15/m21/m15M21Stamp.png', bounds:{x:0.4727, y:0.892, width:0.0547, height:0.0391}},
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'signatureSpellbook';
	loadScript('/js/frames/manaSymbolsM21.js');
	// notify('To use the darker mana symbols on white cards, place a "DM21" (for "Dark M21") before the following mana symbols: wubrg, 0-9, and x.');
	//art bounds
	card.artBounds = {x:0.0767, y:0.1129, width:0.8476, height:0.4429};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:0.9213, y:0.5910, width:0.12, height:0.0410, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.5, y:0.7762, width:0.75, height:0.2305};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', y:0.0613, width:0.9292, height:71/2100, oneLine:true, size:71/1638, align:'right', manaCost:true, manaSpacing:0, manaPrefix:'m21'},
		title: {name:'Title', text:'', x:0.0854, y:0.0522, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0381, color:'white', shadowX:0.0014, shadowY:0.001},
		type: {name:'Type', text:'', x:0.0854, y:0.5664, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0324, color:'white', shadowX:0.0014, shadowY:0.001},
		rules: {name:'Rules Text', text:'', x:0.0967, y:0.6453, width:0.8067, height:0.2381, size:0.0362},
		pt: {name:'Power/Toughness', text:'', x:0.7928, y:0.902, width:0.1367, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center', color:'white'}
	});
}
//loads available frames
loadFramePack();