//Create objects for common properties across available frames
var masks = [{src:'/img/frames/custom/feuerAmeise/kaldheim/pinline.svg', name:'Pinline'}, {src:'/img/frames/custom/feuerAmeise/kaldheim/pinline2.svg', name:'Pinline (Light)'}, {src:'/img/frames/custom/feuerAmeise/kaldheim/background.svg', name:'Background'}];
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/custom/feuerAmeise/kaldheim/w.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/custom/feuerAmeise/kaldheim/u.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/custom/feuerAmeise/kaldheim/b.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/custom/feuerAmeise/kaldheim/r.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/custom/feuerAmeise/kaldheim/g.png', masks:masks},
	{name:'Multicolored Frame', src:'/img/frames/custom/feuerAmeise/kaldheim/m.png', masks:masks},
	{name:'Artifact Frame', src:'/img/frames/custom/feuerAmeise/kaldheim/a.png', masks:masks},
	{name:'Land Frame', src:'/img/frames/custom/feuerAmeise/kaldheim/l.png', masks:masks},
	{name:'Snow Overlay', src:'/img/frames/custom/feuerAmeise/kaldheim/snow.png'},
	{name:'Textbox', src:'/img/frames/custom/feuerAmeise/kaldheim/textbox.svg'}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'feuerAmeiseKaldheim';
	//art bounds
	card.artBounds = {x:0.104, y:0.1043, width:0.792, height:0.7677};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:0.9213, y:0.9, width:0.12, height:0.04, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:-2, y:-2, width:0.75, height:0.2305};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', y:0.0591, width:0.9292, height:71/2100, oneLine:true, size:71/1638, align:'right', shadowX:-0.001, shadowY:0.0029, manaCost:true, manaSpacing:0},
		title: {name:'Title', text:'', x:0.0667, y:0.0491, width:0.8667, height:0.0543, oneLine:true, font:'belerenb', color:'white', size:0.0381, shadowX:0.0027, shadowY:0.002},
		type: {name:'Type', text:'', x:0.0734, y:0.8762, width:0.8534, height:0.0543, oneLine:true, font:'belerenb', color:'white', size:0.0324, shadowX:0.0027, shadowY:0.002},
		rules: {name:'Rules Text', text:'', x:0.12, y:0.6158, width:0.76, height:0.24, size:0.0362, color:'white', align:'center', shadowX:0.002, shadowY:0.0015}
	});
}
//loads available frames
loadFramePack();