//checks to see if it needs to run
if (!loadedVersions.includes('/js/frames/versionMysticalArchiveJP.js')) {
	loadedVersions.push('/js/frames/versionMysticalArchiveJP.js');
	document.querySelector('#creator-menu-tabs').innerHTML += '<h3 class="selectable readable-background" onclick="toggleCreatorTabs(event, `mysticalArchive`)">Mystical Archive</h3>';
	var newHTML = document.createElement('div');
	newHTML.id = 'creator-menu-mysticalArchive';
	newHTML.classList.add('hidden');
	newHTML.innerHTML = `
	<div class='readable-background padding'>
		<h5 class='padding margin-bottom input-description'>Adjust the title bar's height:</h5>
		<input id='ma-change1' class='input' type='number' oninput='stretchMysticalArchive();' min='100', max='1000', value='270', step='5'>
	</div>
	<div class='readable-background padding'>
		<h5 class='padding margin-bottom input-description'>Adjust the type bar's width:</h5>
		<input id='ma-change2' class='input' type='number' oninput='stretchMysticalArchive();' min='150', max='1000', value='430', step='5'>
	</div>
	<!-- <div class='readable-background padding'>
		<h5 class='padding margin-bottom input-description'>Targets:</h5>
		<input id='ma-targets' class='input' type='text' oninput='stretchMysticalArchive();'>
	</div> -->`;
	document.querySelector('#creator-menu-sections').appendChild(newHTML);
	loadScript('/js/frames/manaSymbolsMysticalArchiveJP.js');
}

function stretchMysticalArchive() {
	const change1 = [0, (parseInt(document.querySelector('#ma-change1').value) - 270) / 2100];
	const change2 = [(parseInt(document.querySelector('#ma-change2').value) - 430) / 1260, 0];
	// var targets = []
	// document.querySelector('#ma-targets').value.split(' ').forEach(item => targets.push(parseInt(item)));
	card.frames.forEach(frame => {
		if (frame.src.includes('Archive/jp') && 'stretch' in frame) {
			frame.stretch[0].change = change1;
			card.text.title.height = change1[1] + 270 / 2100;
			frame.stretch[1].change = change2;
			frame.stretch[2].change = change2;
			card.text.type.width = change2[0] + 430 / 1500;
			drawTextBuffer();
			stretchSVG(frame);
		}
	});
}
