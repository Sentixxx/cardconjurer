var theme, rainbowTimer;
const root = document.documentElement.style;

if (localStorage.getItem('theme')) {
	theme = JSON.parse(localStorage.getItem('theme'));
	updateCSS();
} else {
	resetTheme();
}

function updateCSS() {
	if (!root.getPropertyValue('--site-background').includes(theme.background)) {
		root.setProperty('--site-background', 'url("' + (theme.background || '../img/lowpolyBackground.svg') + '")');
	}
	// root.setProperty("--color-primary", theme.SOMETHING);
	// root.setProperty("--color-selected", theme.SOMETHING);
	// root.setProperty("--color-highlighted", theme.SOMETHING);
	// root.setProperty("--font-color", theme.SOMETHING);
	// root.setProperty("--font-color-2", theme.SOMETHING);
	// root.setProperty("--input-background", theme.SOMETHING);
	// root.setProperty("--input-background-selected", theme.SOMETHING);
	if (theme.rainbow > 0) {
		clearInterval(rainbowTimer);
		rainbowTimer = setInterval(rainbowMode, (theme.rainbow));
	} else {
		clearInterval(rainbowTimer);
		root.setProperty('--regular-backdrop-filter', 'hue-rotate(' + (theme.huerotate || 0) + 'deg)');
	}
	root.setProperty('--darkened-backdrop-filter', 'grayscale(1) brightness(' + (theme.readablebrightness || 0) + ')');
}

function rainbowMode() {
	theme.huerotate += 1;
	if (theme.huerotate >= 360) {
		theme.huerotate = 0
	}
	root.setProperty('--regular-backdrop-filter', 'hue-rotate(' + theme.huerotate + 'deg)');
}

function resetTheme() {
	theme = {huerotate:0, background:'../img/lowpolyBackground.svg', readablebrightness:0.3, rainbow:0};
	localStorage.setItem('theme', JSON.stringify(theme));
	updateCSS();
	if (window.location.href.includes('/theme/')) {
		resetThemeControls();
	}
}