//Create objects for common properties across available frames
var bounds = {x:0.0594, y:0.0377, width:0.0734, height:0.0524};
//defines available frames
availableFrames = [
	{name:'Sun', src:'/img/frames/m15/transform/icons/sun.svg', bounds:bounds},
	{name:'Crescent Moon', src:'/img/frames/m15/transform/icons/moon.svg', bounds:bounds},
	{name:'Full Moon', src:'/img/frames/m15/transform/icons/fullmoon.svg', bounds:bounds},
	{name:'Emrakul', src:'/img/frames/m15/transform/icons/emrakul.svg', bounds:bounds},
	{name:'Compass', src:'/img/frames/m15/transform/icons/compass.svg', bounds:bounds},
	{name:'Land', src:'/img/frames/m15/transform/icons/land.svg', bounds:bounds},
	{name:'Planeswalker Ember', src:'/img/frames/m15/transform/icons/spark.svg', bounds:bounds},
	{name:'Planeswalker Spark', src:'/img/frames/m15/transform/icons/planeswalker.svg', bounds:bounds},
	{name:'Lesson', src:'/img/frames/m15/transform/icons/lesson.svg', bounds:bounds}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = true;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = null;
//loads available frames
loadFramePack();