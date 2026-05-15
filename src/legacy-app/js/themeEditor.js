function resetThemeControls() {
	document.querySelector('#hue-rotate').value = theme.huerotate;
	document.querySelector('#hue-rotate-auto').value = theme.rainbow;
	document.querySelector('#readable-brightness').value = theme.readablebrightness;
}
resetThemeControls();

var updateCSSTimer;
var canUpdateCSS = true;

function changeThemeVar(input, destination) {
	theme[destination] = input;
	localStorage.setItem('theme', JSON.stringify(theme));
	// if (canUpdateCSS) {
		updateCSS();
	// 	canUpdateCSS = false;
	// 	updateCSSTimer = setTimeout(resetCSSTimer, 50);
	// }
}

function resetCSSTimer() {
	canUpdateCSS = true;
}