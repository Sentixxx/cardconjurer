//checks to see if it needs to run
if (!loadedVersions.includes('/js/frames/versionMysticalArchiveJPHorizontal.js')) {
	loadedVersions.push('/js/frames/versionMysticalArchiveJPHorizontal.js');
	document.querySelector('#creator-menu-tabs').innerHTML += '<h3 class="selectable readable-background" onclick="toggleCreatorTabs(event, `mysticalArchiveHorizontal`)">Mystical Archive (H)</h3>';
	var newHTML = document.createElement('div');
	newHTML.id = 'creator-menu-mysticalArchiveHorizontal';
	newHTML.classList.add('hidden');
	newHTML.innerHTML = `
	<div class='readable-background padding'>
		<h5 class='padding margin-bottom input-description'>Adjust the title bar's width:</h5>
		<input id='mah-change1' class='input' type='number' oninput='stretchMysticalArchiveHorizontal();' min='100', max='1000', value='270', step='5'>
	</div>
	<div class='readable-background padding'>
		<h5 class='padding margin-bottom input-description'>Adjust the type bar's width:</h5>
		<input id='mah-change2' class='input' type='number' oninput='stretchMysticalArchiveHorizontal();' min='150', max='1000', value='430', step='5'>
	</div>
	<!-- <div class='readable-background padding'>
		<h5 class='padding margin-bottom input-description'>Targets:</h5>
		<input id='mah-targets' class='input' type='text' oninput='stretchMysticalArchiveHorizontal();'>
	</div> -->`;
	document.querySelector('#creator-menu-sections').appendChild(newHTML);
	loadScript('/js/frames/manaSymbolsMysticalArchiveJP.js');
}

function stretchMysticalArchiveHorizontal() {
	// compute changes
	const change1 = [(parseInt(document.querySelector('#mah-change1').value) - 270) / 1500, 0];
	const change2 = [(parseInt(document.querySelector('#mah-change2').value) - 430) / 1260, 0];
	// change textbox sizes
	card.text.title.width = change1[0] + 270 / 1500;
	card.text.type.width = change2[0] + 430 / 1500;
	drawTextBuffer();
	// resize SVGs
	card.frames.forEach(frame => {
		if (frame.src.includes('Archive/jp/horizontal') && 'stretch' in frame) {
			frame.stretch[0].change = change1;
			frame.stretch[1].change = change2;
			frame.stretch[2].change = change2;
			stretchSVG(frame);
		}
	});
}
