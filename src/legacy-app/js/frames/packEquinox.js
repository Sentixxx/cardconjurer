//Create objects for common properties across available frames
var masks = [{src:'/img/frames/m15/equinox/pinline.png', name:'Pinline'}, {src:'/img/frames/m15/equinox/title.svg', name:'Title'}, {src:'/img/frames/m15/equinox/type.svg', name:'Type'}, {src:'/img/frames/m15/equinox/text.png', name:'Rules'}];
var bounds = {x:0.7787, y:0.8777, width:0.1747, height:0.0686};
var masks2 = [{src:'/img/frames/m15/equinox/back/pinline.svg', name:'Pinline'}, {src:'/img/frames/m15/equinox/back/title.svg', name:'Title'}, {src:'/img/frames/m15/equinox/back/type.svg', name:'Type'}, {src:'/img/frames/m15/equinox/back/text.svg', name:'Rules'}];
var bounds2 = {x:0.7794, y:0.8839, width:0.1827, height:0.0639};
var stampBounds = {x:576/1500, y:1897/2100, width:348/1500, height:203/2100};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/m15/equinox/w.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/m15/equinox/u.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/m15/equinox/b.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/m15/equinox/r.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/m15/equinox/g.png', masks:masks},
	{name:'Multicolored Frame', src:'/img/frames/m15/equinox/m.png', masks:masks},
	{name:'Artifact Frame', src:'/img/frames/m15/equinox/a.png', masks:masks},
	{name:'Land Frame', src:'/img/frames/m15/equinox/l.png', masks:masks},
	{name:'White Power/Toughness', src:'/img/frames/m15/equinox/pt/w.png', bounds:bounds},
	{name:'Blue Power/Toughness', src:'/img/frames/m15/equinox/pt/u.png', bounds:bounds},
	{name:'Black Power/Toughness', src:'/img/frames/m15/equinox/pt/b.png', bounds:bounds},
	{name:'Red Power/Toughness', src:'/img/frames/m15/equinox/pt/r.png', bounds:bounds},
	{name:'Green Power/Toughness', src:'/img/frames/m15/equinox/pt/g.png', bounds:bounds},
	{name:'Multicolored Power/Toughness', src:'/img/frames/m15/equinox/pt/m.png', bounds:bounds},
	{name:'Artifact Power/Toughness', src:'/img/frames/m15/equinox/pt/a.png', bounds:bounds},
	{name:'Land Power/Toughness', src:'/img/frames/m15/equinox/pt/l.png', bounds:bounds},
	{name:'White Holo Stamp', src:'/img/frames/m15/equinox/stamps/w.png', bounds:stampBounds},
	{name:'Blue Holo Stamp', src:'/img/frames/m15/equinox/stamps/u.png', bounds:stampBounds},
	{name:'Black Holo Stamp', src:'/img/frames/m15/equinox/stamps/b.png', bounds:stampBounds},
	{name:'Red Holo Stamp', src:'/img/frames/m15/equinox/stamps/r.png', bounds:stampBounds},
	{name:'Green Holo Stamp', src:'/img/frames/m15/equinox/stamps/g.png', bounds:stampBounds},
	{name:'Multicolored Holo Stamp', src:'/img/frames/m15/equinox/stamps/m.png', bounds:stampBounds},
	{name:'Artifact Holo Stamp', src:'/img/frames/m15/equinox/stamps/a.png', bounds:stampBounds},
	{name:'Land Holo Stamp', src:'/img/frames/m15/equinox/stamps/l.png', bounds:stampBounds}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'equinox';
	//art bounds
	card.artBounds = {x:0.0754, y:0.0534, width:0.8574, height:0.8715};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:0.9067, y:0.5910, width:0.12, height:0.0410, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.5, y:0.7762, width:0.75, height:0.2305};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', y:0.0643, width:0.9234, height:71/2100, oneLine:true, size:71/1638, align:'right', shadowX:-0.001, shadowY:0.0029, manaCost:true, manaSpacing:0},
		title: {name:'Title', text:'', x:0.0967, y:0.0553, width:0.8067, height:0.0543, oneLine:true, font:'belerenb', size:0.0381},
		type: {name:'Type', text:'', x:0.0967, y:0.5664, width:0.8067, height:0.0543, oneLine:true, font:'belerenb', size:0.0324},
		rules: {name:'Rules Text', text:'', x:0.1, y:0.6303, width:0.8, height:0.2875, size:0.0362},
		pt: {name:'Power/Toughness', text:'', x:0.7947, y:0.9, width:0.1367, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center'}
	});
}
//loads available frames
loadFramePack();