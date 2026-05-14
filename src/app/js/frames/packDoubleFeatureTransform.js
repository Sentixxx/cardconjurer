//Create objects for common properties across available frames
var masks = [{src:'/img/frames/m15/transform/regular/maskPinlineFront.png', name:'Pinline'}, {src:'/img/frames/m15/transform/regular/maskTitle.png', name:'Title'}, {src:'/img/frames/m15/regular/m15MaskType.png', name:'Type'}, {src:'/img/frames/m15/transform/regular/maskRulesFront.png', name:'Rules'}, {src:'/img/frames/m15/transform/regular/maskFrameFront.png', name:'Frame'}, {src:'/img/frames/m15/transform/regular/maskBorderFront.png', name:'Border'}];
var ciMasks = [{src:'/img/frames/m15/ciPips/firstHalf.svg', name:'First Half'}, {src:'/img/frames/m15/ciPips/secondHalf.svg', name:'Second Half'}, {src:'/img/frames/m15/ciPips/firstThird.svg', name:'First Third'}, {src:'/img/frames/m15/ciPips/secondThird.svg', name:'Second Third'}, {src:'/img/frames/m15/ciPips/thirdThird.svg', name:'Third Third'}];
var bounds = {x:1555/2010, y:2492/2814, width:353/2010, height:179/2814};
var crownBounds = {x:0, y:0, width:1, height:341/2814};
var iconBounds = {x:0.0594, y:0.0505, width:0.0734, height:0.0524};
var stampBounds = {x:873/2010, y:2539/2814, width:264/2010, height:131/2814};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/doubleFeature/transform/w.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/doubleFeature/transform/u.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/doubleFeature/transform/b.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/doubleFeature/transform/r.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/doubleFeature/transform/g.png', masks:masks},
	{name:'Multicolored Frame', src:'/img/frames/doubleFeature/transform/m.png', masks:masks},
	{name:'Artifact Frame', src:'/img/frames/doubleFeature/transform/a.png', masks:masks},
	{name:'Land Frame', src:'/img/frames/doubleFeature/transform/l.png', masks:masks},

	{name:'White Power/Toughness', src:'/img/frames/doubleFeature/pt/w.png', bounds:bounds},
	{name:'Blue Power/Toughness', src:'/img/frames/doubleFeature/pt/u.png', bounds:bounds},
	{name:'Black Power/Toughness', src:'/img/frames/doubleFeature/pt/b.png', bounds:bounds},
	{name:'Red Power/Toughness', src:'/img/frames/doubleFeature/pt/r.png', bounds:bounds},
	{name:'Green Power/Toughness', src:'/img/frames/doubleFeature/pt/g.png', bounds:bounds},
	{name:'Multicolored Power/Toughness', src:'/img/frames/doubleFeature/pt/m.png', bounds:bounds},
	{name:'Artifact Power/Toughness', src:'/img/frames/doubleFeature/pt/a.png', bounds:bounds},
	{name:'Land Power/Toughness', src:'/img/frames/doubleFeature/pt/l.png', bounds:bounds},

	{name:'White Legend Crown', src:'/img/frames/doubleFeature/transform/crowns/w.png', bounds:crownBounds},
	{name:'Blue Legend Crown', src:'/img/frames/doubleFeature/transform/crowns/u.png', bounds:crownBounds},
	{name:'Black Legend Crown', src:'/img/frames/doubleFeature/transform/crowns/b.png', bounds:crownBounds},
	{name:'Red Legend Crown', src:'/img/frames/doubleFeature/transform/crowns/r.png', bounds:crownBounds},
	{name:'Green Legend Crown', src:'/img/frames/doubleFeature/transform/crowns/g.png', bounds:crownBounds},
	{name:'Multicolored Legend Crown', src:'/img/frames/doubleFeature/transform/crowns/m.png', bounds:crownBounds},
	{name:'Artifact Legend Crown', src:'/img/frames/doubleFeature/transform/crowns/a.png', bounds:crownBounds},
	{name:'Land Legend Crown', src:'/img/frames/doubleFeature/transform/crowns/l.png', bounds:crownBounds},

	{name:'Up Arrow', src:'/img/frames/m15/transform/icons/default.png', bounds:iconBounds},
	{name:'Down Arrow', src:'/img/frames/m15/transform/icons/downArrow.png', bounds:iconBounds},
	{name:'Sun', src:'/img/frames/m15/transform/icons/sun.svg', bounds:iconBounds},
	{name:'Crescent Moon', src:'/img/frames/m15/transform/icons/moon.svg', bounds:iconBounds},
	{name:'Full Moon', src:'/img/frames/m15/transform/icons/fullmoon.svg', bounds:iconBounds},
	{name:'Emrakul', src:'/img/frames/m15/transform/icons/emrakul.svg', bounds:iconBounds},
	{name:'Compass', src:'/img/frames/m15/transform/icons/compass.svg', bounds:iconBounds},
	{name:'Land', src:'/img/frames/m15/transform/icons/land.svg', bounds:iconBounds},
	{name:'Planeswalker Ember', src:'/img/frames/m15/transform/icons/spark.svg', bounds:iconBounds},
	{name:'Planeswalker Spark', src:'/img/frames/m15/transform/icons/planeswalker.svg', bounds:iconBounds},
	{name:'Lesson', src:'/img/frames/m15/transform/icons/lesson.svg', bounds:iconBounds},
	{name:'Closed Fan', src:'/img/frames/m15/transform/icons/fanClosed.svg', bounds:iconBounds},
	{name:'Open Fan', src:'/img/frames/m15/transform/icons/fanOpen.svg', bounds:iconBounds},
	{name:'Hammer', src:'/img/frames/m15/transform/icons/hammer.png', bounds:iconBounds},

	{name:'White Pip', src:'/img/frames/m15/ciPips/w.svg', masks:ciMasks, complementary:43},
	{name:'Blue Pip', src:'/img/frames/m15/ciPips/u.svg', masks:ciMasks, complementary:43},
	{name:'Black Pip', src:'/img/frames/m15/ciPips/b.svg', masks:ciMasks, complementary:43},
	{name:'Red Pip', src:'/img/frames/m15/ciPips/r.svg', masks:ciMasks, complementary:43},
	{name:'Green Pip', src:'/img/frames/m15/ciPips/g.svg', masks:ciMasks, complementary:43},
	{name:'Color Identity Pip Base', src:'/img/frames/m15/ciPips/base.png', bounds:{x:0.0767, y:0.5748, width:0.0467, height:0.0334}},

	{name:'Holo Stamp', src:'/img/frames/doubleFeature/stamps/stamp.png', bounds:stampBounds},
	{name:'White Land Holo Stamp', src:'/img/frames/doubleFeature/stamps/w.png', bounds:stampBounds},
	{name:'Blue Land Holo Stamp', src:'/img/frames/doubleFeature/stamps/u.png', bounds:stampBounds},
	{name:'Black Land Holo Stamp', src:'/img/frames/doubleFeature/stamps/b.png', bounds:stampBounds},
	{name:'Red Land Holo Stamp', src:'/img/frames/doubleFeature/stamps/r.png', bounds:stampBounds},
	{name:'Green Land Holo Stamp', src:'/img/frames/doubleFeature/stamps/g.png', bounds:stampBounds},
	{name:'Multicolored Land Holo Stamp', src:'/img/frames/doubleFeature/stamps/m.png', bounds:stampBounds}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'm15DoubleFeatureTransformFront';
	//art bounds
	card.artBounds = {x:155/2010, y:319/2814, width:1700/2010, height:1242/2814};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:0.9213, y:0.5910, width:0.12, height:0.0410, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.5, y:0.7762, width:0.75, height:0.2305};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', y:0.0613, width:0.9292, height:71/2100, oneLine:true, size:71/1638, align:'right', shadowX:-0.001, shadowY:0.0029, manaCost:true, manaSpacing:0},
		title: {name:'Title', text:'', x:0.16, y:0.0522, width:0.7547, height:0.0543, oneLine:true, font:'belerenb', size:0.0381, color:'white'},
		type: {name:'Type', text:'', x:0.0854, y:0.5664, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0324, color:'white'},
		rules: {name:'Rules Text', text:'', x:0.086, y:0.6303, width:0.828, height:0.2875, size:0.0362, color:'white'},
		reminder: {name:'Reverse PT', text:'', x:0.086, y:0.842, width:0.838, height:0.0362, size:0.0291, oneLine:true, color:'#666', align:'right', font:'belerenbsc'},
		pt: {name:'Power/Toughness', text:'', x:0.7928, y:0.902, width:0.1367, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center', color:'white'}
	});
	notify('You can now make the art grayscale in the art tab!');
	notify('If you intend to add the color identity pips, we recommend that you shift your Type text to the right with "{right88}".')
}
//loads available frames
loadFramePack();