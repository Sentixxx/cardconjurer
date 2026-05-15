//Create objects for common properties across available frames
var bounds = {x:0.7607, y:0.8558, width:0.1807, height:0.081};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/custom/magrao/kaldheim/w.png'},
	{name:'Blue Frame', src:'/img/frames/custom/magrao/kaldheim/u.png'},
	{name:'Black Frame', src:'/img/frames/custom/magrao/kaldheim/b.png'},
	{name:'Red Frame', src:'/img/frames/custom/magrao/kaldheim/r.png'},
	{name:'Green Frame', src:'/img/frames/custom/magrao/kaldheim/g.png'},
	{name:'Multicolored Frame', src:'/img/frames/custom/magrao/kaldheim/m.png'},
	{name:'Artifact Frame', src:'/img/frames/custom/magrao/kaldheim/a.png'},
	{name:'Land Frame', src:'/img/frames/custom/magrao/kaldheim/l.png'},
	{name:'White Power/Toughness', src:'/img/frames/custom/magrao/kaldheim/pt/w.png', bounds:bounds},
	{name:'Blue Power/Toughness', src:'/img/frames/custom/magrao/kaldheim/pt/u.png', bounds:bounds},
	{name:'Black Power/Toughness', src:'/img/frames/custom/magrao/kaldheim/pt/b.png', bounds:bounds},
	{name:'Red Power/Toughness', src:'/img/frames/custom/magrao/kaldheim/pt/r.png', bounds:bounds},
	{name:'Green Power/Toughness', src:'/img/frames/custom/magrao/kaldheim/pt/g.png', bounds:bounds},
	{name:'Multicolored Power/Toughness', src:'/img/frames/custom/magrao/kaldheim/pt/m.png', bounds:bounds},
	{name:'Artifact Power/Toughness', src:'/img/frames/custom/magrao/kaldheim/pt/a.png', bounds:bounds},
	
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'magraoKaldheim';
	//art bounds
	card.artBounds = {x:0.104, y:0.1043, width:0.792, height:0.7677};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:0.8334, y:0.8229, width:0.12, height:0.04, vertical:'center', horizontal: 'center'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:-2, y:-2, width:0.75, height:0.2305};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', y:0.0696, width:0.9227, height:71/2100, oneLine:true, size:71/1638, align:'right', shadowX:-0.001, shadowY:0.0029, manaCost:true, manaSpacing:0},
		title: {name:'Title', text:'', x:0.076, y:0.06, width:0.8667, height:0.0543, oneLine:true, font:'belerenb', color:'white', size:0.0381, shadowX:0.0027, shadowY:0.002},
		type: {name:'Type', text:'', x:0.08, y:0.871, width:0.84, height:0.0543, oneLine:true, font:'belerenb', color:'white', size:0.0324, shadowX:0.0027, shadowY:0.002},
		pt: {name:'Power/Toughness', text:'', x:0.7874, y:0.8805, width:0.128, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center', color:'white', shadowX:0.002, shadowY:0.0015}
	});
}
//loads available frames
loadFramePack();