//Create objects for common properties across available frames
var bounds = {x:0, y:0, width:1, height:1};
var bounds2 = {x:145/2010, y:121/2814, width:104/2010, height:104/2814};
var bounds3 = {x:145/2010, y:137/2814, width:104/2010, height:104/2814};
var bounds4 = {x:130/2010, y:150/2814, width:0.0349, height:0.0185};
//defines available frames
availableFrames = [

	{name:'Transform Icon', src:'/img/frames/custom/classicshifted/transform/transformIcon.png', bounds:{x:129/2010, y:104/2814, width:137/2010, height:137/2814}},
	{name:'Sun', src:'/img/frames/m15/transform/icons/sun.svg', bounds:bounds2},
	{name:'Crescent Moon', src:'/img/frames/m15/transform/icons/moon.svg', bounds:bounds2},
	{name:'Full Moon', src:'/img/frames/m15/transform/icons/fullmoon.svg', bounds:bounds2},
	{name:'Emrakul', src:'/img/frames/m15/transform/icons/emrakul.svg', bounds:bounds2},
	{name:'Compass', src:'/img/frames/m15/transform/icons/compass.svg', bounds:bounds2},
	{name:'Land', src:'/img/frames/m15/transform/icons/land.svg', bounds:bounds2},
	{name:'Planeswalker Ember', src:'/img/frames/m15/transform/icons/spark.svg', bounds:bounds2},
	{name:'Planeswalker Spark', src:'/img/frames/m15/transform/icons/planeswalker.svg', bounds:bounds2},
	{name:'Lesson', src:'/img/frames/m15/transform/icons/lesson.svg', bounds:bounds2},
	{name:'Closed Fan', src:'/img/frames/m15/transform/icons/fanClosed.svg', bounds:bounds2},
	{name:'Open Fan', src:'/img/frames/m15/transform/icons/fanOpen.svg', bounds:bounds2},
	{name:'Up Arrow', src:'/img/frames/m15/transform/icons/default.png', bounds:bounds2},
	{name:'Down Arrow', src:'/img/frames/m15/transform/icons/downArrow.png', bounds:bounds2},
	{name:'Retro Arrow Up', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/mdfc/retroUp.png', bounds:bounds4},
	{name:'Retro Arrow Down', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/mdfc/retroDown.png', bounds:bounds4},

	{name:'White MDFC Arrow', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/mdfc/transform/w.png', bounds:bounds},
	{name:'Blue MDFC Arrow', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/mdfc/transform/u.png', bounds:bounds},
	{name:'Black MDFC Arrow', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/mdfc/transform/b.png', bounds:bounds},
	{name:'Red MDFC Arrow', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/mdfc/transform/r.png', bounds:bounds},
	{name:'Green MDFC Arrow', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/mdfc/transform/g.png', bounds:bounds},
	{name:'Multicolored MDFC Arrow', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/mdfc/transform/m.png', bounds:bounds},
	{name:'Colorless MDFC Arrow', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/mdfc/transform/c.png', bounds:bounds},
	{name:'Land MDFC Arrow', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/mdfc/transform/L.png', bounds:bounds},

	{name:'Legend Crown Transform Icon', src:'/img/frames/custom/classicshifted/transform/transformIcon.png', bounds:{x:129/2010, y:120/2814, width:137/2010, height:137/2814}},
	{name:'Legend Crown Sun', src:'/img/frames/m15/transform/icons/sun.svg', bounds:bounds3},
	{name:'Legend Crown Crescent Moon', src:'/img/frames/m15/transform/icons/moon.svg', bounds:bounds3},
	{name:'Legend Crown Full Moon', src:'/img/frames/m15/transform/icons/fullmoon.svg', bounds:bounds3},
	{name:'Legend Crown Emrakul', src:'/img/frames/m15/transform/icons/emrakul.svg', bounds:bounds3},
	{name:'Legend Crown Compass', src:'/img/frames/m15/transform/icons/compass.svg', bounds:bounds3},
	{name:'Legend Crown Land', src:'/img/frames/m15/transform/icons/land.svg', bounds:bounds3},
	{name:'Legend Crown Planeswalker Ember', src:'/img/frames/m15/transform/icons/spark.svg', bounds:bounds3},
	{name:'Legend Crown Planeswalker Spark', src:'/img/frames/m15/transform/icons/planeswalker.svg', bounds:bounds3},
	{name:'Legend Crown Lesson', src:'/img/frames/m15/transform/icons/lesson.svg', bounds:bounds3},
	{name:'Legend Crown Closed Fan', src:'/img/frames/m15/transform/icons/fanClosed.svg', bounds:bounds3},
	{name:'Legend Crown Open Fan', src:'/img/frames/m15/transform/icons/fanOpen.svg', bounds:bounds3},
	{name:'Legend Crown Up Arrow', src:'/img/frames/m15/transform/icons/default.png', bounds:bounds3},
	{name:'Legend Crown Down Arrow', src:'/img/frames/m15/transform/icons/downArrow.png', bounds:bounds3}

];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'stoneCutterDeluxeTransform';
	//art bounds
	card.artBounds = {x:0.08, y:0.0954, width:0.84, height:0.4653};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:0.9213, y:0.5958, width:0.12, height:0.0410, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.5, y:0.7762, width:0.75, height:0.2305};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', y:0.0497, width:0.9292, height:71/2100, oneLine:true, size:71/1638, align:'right', shadowX:-0.001, shadowY:0.0029, manaCost:true, manaSpacing:0},
		title: {name:'Title', text:'', x:0.14, y:0.0372, width:0.748, height:0.0543, oneLine:true, font:'belerenb', size:0.0381, color:'white', shadowX:0.002, shadowY:0.0015},
		type: {name:'Type', text:'', x:0.0854, y:0.571, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0324, color:'white', shadowX:0.002, shadowY:0.0015},
		rules: {name:'Rules Text', text:'', x:0.086, y:0.6329, width:0.828, height:0.2905, size:0.0362},
		pt: {name:'Power/Toughness', text:'', x:0.7928, y:0.902, width:0.1367, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center', color:'white', shadowX:0.002, shadowY:0.0015},
		reminder: {name:'Reverse PT', text:'', x:0.086, y:0.842, width:0.838, height:0.0362, size:0.0291, oneLine:true, color:'#666', align:'right', font:'belerenbsc'},
	});
}
//loads available frames
loadFramePack();