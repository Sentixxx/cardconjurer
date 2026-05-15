//checks to see if it needs to run
if (!loadedVersions.includes('/js/frames/versionNeoBasics.js')) {
	loadedVersions.push('/js/frames/versionNeoBasics.js');
	document.querySelector('#creator-menu-tabs').innerHTML += '<h3 class="selectable readable-background" onclick="toggleCreatorTabs(event, `neoBasics`)">Kamigawa Basics</h3>';
	var newHTML = document.createElement('div');
	newHTML.id = 'creator-menu-neoBasics';
	newHTML.classList.add('hidden');
	newHTML.innerHTML = `
	<div class='readable-background padding'>
		<h5 class='padding margin-bottom input-description'>Adjust the title bar's height:</h5>
		<input id='nb-change' class='input' type='number' oninput='stretchNeoBasics();' min='330', max='1000', value='330', step='10'>
	</div>
	<!--<div class='readable-background padding'>
		<h5 class='padding margin-bottom input-description'>Adjust the targets:</h5>
		<input id='targets' class='input' type='text' oninput='stretchNeoBasics();' value='0'>
	</div>-->`;
	document.querySelector('#creator-menu-sections').appendChild(newHTML);
	loadScript('/js/frames/manaSymbolsMysticalArchiveJP.js');
}

function stretchNeoBasics() {
	const change = [0, (parseInt(document.querySelector('#nb-change').value) - 330) / 2100];
	// var targets = []
	// document.querySelector('#targets').value.split(' ').forEach(item => targets.push(parseInt(item)));
	card.frames.forEach(frame => {
		if (frame.src.includes('neo/basics/') && 'stretch' in frame) {
			frame.stretch[0].change = change;
			// frame.stretch[0].targets = targets;
			frame.stretch[1].change = change;
			frame.stretch[2].change = change;
			frame.stretch[3].change = change;
			card.text.title.height = change[1] + 500 / 2100;
			drawTextBuffer();
			stretchSVG(frame);
		}
	});
}
