let rootStyles = document.documentElement.style

function checkLocalStorage() {
	if (localStorage.getItem('colorPalette')) {
		loadScript('/data/scripts/palettes/' + localStorage.getItem('colorPalette') + '.js')
        setTimeout(function() {
        	if (document.getElementById('inputColorPalette').value) {
        		document.getElementById('inputColorPalette').value = localStorage.getItem('colorPalette')
        	}
        }, 1000)
	} else {
		loadScript('/data/scripts/palettes/lowpolyGreen.js')
	}
}
checkLocalStorage()

function loadScript(scriptPath){
  var script = document.createElement('script')
  script.setAttribute('type','text/javascript')
  script.setAttribute('src', scriptPath)
  if (typeof script != 'undefined') {
    document.getElementsByTagName('head')[0].appendChild(script)
  }
}
