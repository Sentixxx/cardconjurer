//Create objects for common properties across available frames
var bounds = {x:0, y:0, width:1, height:1};
var bounds2 = {x:0.0654, y:0.0467, width:0.052, height:0.0372};
var bounds3 = {x:0.0655, y:0.0470, width:0.05195, height:0.0368};
var bounds4 = {x:0.0649, y:0.0532, width:0.0349, height:0.0185};
//defines available frames
availableFrames = [

	{name:'White Transform Indicator', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/planeswalker/transform/w.png', bounds:bounds, complementary:8},
	{name:'Blue Transform Indicator', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/planeswalker/transform/u.png', bounds:bounds, complementary:8},
	{name:'Black Transform Indicator', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/planeswalker/transform/b.png', bounds:bounds, complementary:8},
	{name:'Red Transform Indicator', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/planeswalker/transform/r.png', bounds:bounds, complementary:8},
	{name:'Green Transform Indicator', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/planeswalker/transform/g.png', bounds:bounds, complementary:8},
	{name:'Multicolored Transform Indicator', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/planeswalker/transform/m.png', bounds:bounds, complementary:8},
	{name:'Colorless Transform Indicator', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/planeswalker/transform/c.png', bounds:bounds, complementary:8},
	{name:'Frame Cutout', src:'/img/frames/custom/classicshifted/planeswalker/transform/cutout.svg', erase:true},
	
	{name:'Transform Icon', src:'/img/frames/custom/classicshifted/planeswalker/transform/transformIcon.png', bounds:{x:0.0574, y:0.041, width:0.068, height:0.0486}},
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
	{name:'Up Arrow', src:'/img/frames/m15/transform/icons/default.png', bounds:bounds3},
	{name:'Down Arrow', src:'/img/frames/m15/transform/icons/downArrow.png', bounds:bounds3},
	{name:'Retro Arrow Up', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/mdfc/retroUp.png', bounds:bounds4},
	{name:'Retro Arrow Down', src:'/img/frames/custom/stoneCutter/stoneCutterDeluxe/mdfc/retroDown.png', bounds:bounds4}
	
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'planeswalkerStoneCutterDeluxe';
	card.onload = '/js/frames/versionPlaneswalker.js';
	loadScript('/js/frames/versionPlaneswalker.js');
	//art bounds
	card.artBounds = {x:0.068, y:0.101, width:0.864, height:0.8143};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:0.9227, y:0.5891, width:0.12, height:0.0381, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.5, y:0.7762, width:0.75, height:0.2305};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', y:0.0497, width:0.9292, height:71/2100, oneLine:true, size:71/1638, align:'right', shadowX:-0.001, shadowY:0.0029, manaCost:true, manaSpacing:0},
		title: {name:'Title', text:'', x:0.1334, y:0.0372, width:0.7332, height:0.0548, oneLine:true, font:'belerenb', size:0.0381, color:'white', shadowX:0.002, shadowY:0.0015},
		type: {name:'Type', text:'', x:0.0867, y:0.5625, width:0.8267, height:0.0548, oneLine:true, font:'belerenb', size:0.0324, color:'white', shadowX:0.002, shadowY:0.0015},
		ability0: {name:'Ability 1', text:'', x:0.18, y:0.6239, width:0.7467, height:0.0972, size:0.0353},
		ability1: {name:'Ability 2', text:'', x:0.18, y:0, width:0.7467, height:0.0972, size:0.0353},
		ability2: {name:'Ability 3', text:'', x:0.18, y:0, width:0.7467, height:0.0972, size:0.0353},
		ability3: {name:'Ability 4', text:'', x:0.18, y:0, width:0.7467, height:0, size:0.0353},
		loyalty: {name:'Loyalty', text:'', x:0.806, y:0.902, width:0.14, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center', color:'white'},
		reminder: {name:'Reverse PT', text:'', x:0.086, y:0.842, width:0.838, height:0.0362, size:0.0291, oneLine:true, color:'#666', align:'right', font:'belerenbsc'},
	});
}
//loads available frames
loadFramePack();