//============================================//
//       Card Conjurer, by Kyle Burton        //
//============================================//
console.log("1.1")
//define variables
var playerCount, startingLifeTotal, firstPlayerWide = false, lastPlayerWide = false, playerList = [], rowHeight = 0, columnWidth = 0, rowCount = 0, isFullscreen = true, mouseClickId = 0, noSleep = new NoSleep(), canEnableNoSleep = false
//Setup the enabler for no sleep
document.addEventListener("click", enableNoSleep, false);
function enableNoSleep() {
    if (canEnableNoSleep) {
        document.removeEventListener("click", enableNoSleep, false);
        noSleep.enable();
    }
}
//This function sets everything up
function fullscreen() {
	//Full screen!
	grid = document.getElementById("gridShell")
	if (grid.requestFullscreen) {
    	grid.requestFullscreen()
  	} else if (grid.mozRequestFullScreen) {
    	grid.mozRequestFullScreen()
  	} else if (grid.webkitRequestFullscreen) {
    	grid.webkitRequestFullscreen()
  	} else if (grid.msRequestFullscreen) {
    	grid.msRequestFullscreen()
  	} else {
  		isFullscreen = false
  		document.getElementById("return").classList.add("permaHidden")
  		document.getElementById("gridShell").classList.add("fullscreenUnavailable")
  	}
}
function startGame() {
    canEnableNoSleep = document.getElementById("inputWakeLock").checked
	fullscreen()
	document.getElementById("return").classList.remove("hidden")
	//hide the settings and grab player count and starting life total
	document.getElementById("settings").classList.add("hidden")
	playerCount = parseInt(document.getElementById("inputPlayerCount").value)
	startingLifeTotal = parseInt(document.getElementById("inputStartingLife").value)
	//determine the layout based on player count
	if (playerCount % 2 == 0) {
		if (playerCount >= 6) {
			firstPlayerWide = true
			lastPlayerWide = true
		}
	} else {
		lastPlayerWide = true
	}
	//Make all the player boxes
	for (var i = 1; i <= playerCount; i ++) {
		//determine if the current box is rotated or widened
		var rotation, wide = false
		var orientationIndexAdjust = 0
		if (firstPlayerWide) {
			orientationIndexAdjust += 1
		}
		if (i == 1 && firstPlayerWide) {
			rotation = 180
		} else if (i == playerCount && lastPlayerWide) {
			rotation = 0
		} else if ((i + orientationIndexAdjust) % 2 == 0) {
			rotation = 270
		} else {
			rotation = 90
		}
		if ((i == 1 && firstPlayerWide) || (i == playerCount && lastPlayerWide)) {wide = true}
		playerList[i - 1] = new playerBox(i, rotation, wide)
		document.getElementById("inputPlayer").innerHTML += "<option value='" + i + "'>Player " + i + "</option>"
	}
	//Determine the grid size
	if (isFullscreen) {
		columnWidth = screen.width / 2 - 2
	} else {
		columnWidth = window.innerWidth / 2 - 2
	}
	rowCount = (playerCount - playerCount % 2) / 2 + 1
	if (playerCount == 2 || playerCount == 4) {
		rowCount -= 1
	}
//    console.log("Row count: " + rowCount)
	if (isFullscreen) {
		rowHeight = screen.height / rowCount - 2
//        console.log("Full screen, rowHeight: " + rowHeight)
//        console.log("screen.height: " + screen.height)
	} else {
        var heightToUse = window.innerHeight
        if (document.documentElement.clientHeight > heightToUse) {
//            console.log("document.documentElement.clientHeight: " + document.documentElement.clientHeight)
            heightToUse = document.documentElement.clientHeight
        }
		rowHeight = heightToUse / rowCount - 2
//        console.log("Not full screen, rowHeight: " + rowHeight)
//        console.log("window.innerHeight: " + window.innerHeight)
	}
	//Now that all the player boxes are made, they must be configured
	for (var i = 1; i <= playerCount; i++) {
		configurePlayerBox(i)
	}
	drawAllPlayerBoxes()
}
function playerBox(playerBoxID, canvasRotation, wide) {
	//Actually needed vars
	this.id = playerBoxID
	this.rotation = canvasRotation
	this.life = startingLifeTotal
	this.canvas = document.createElement("canvas")
	this.direction = 0
	this.holdTime = 0
    this.touchId = 0.5
	this.color = "#222222"
	this.textColor = "#ffffff"
	this.image = new Image()
	this.image.customVarID = playerBoxID
	this.image.onload = function() {drawPlayerBox(this.customVarID)}
	//vars to make navigation easier
	this.canvas.customVarID = playerBoxID
	this.canvas.customVarContext = this.canvas.getContext("2d")
	this.canvas.customVarContext.customVarCanvas = this.canvas
	//css classes
	this.canvas.classList.add("playerBox")
	if (wide) {
		this.canvas.classList.add("widePlayerBox")
	}
	//add it to the html
	document.getElementById("mainGrid").appendChild(this.canvas)
}
function configurePlayerBox(playerBoxID) {
	//All of this configures the size/shape/orientation of the player boxes
	var currentPlayer = playerList[playerBoxID - 1]
	var context = currentPlayer.canvas.customVarContext
	currentPlayer.canvas.width = columnWidth
	if (playerList[playerBoxID - 1].canvas.classList.contains("widePlayerBox")) {
		currentPlayer.canvas.width = columnWidth * 2 + 2
	}
	currentPlayer.canvas.height = rowHeight
	context.translate(currentPlayer.canvas.width / 2, currentPlayer.canvas.height / 2)
	context.rotate(Math.PI / 180 * currentPlayer.rotation)
}

function resetLife() {
	for (var i = 1; i <= playerCount; i++) {
		playerList[i - 1].life = startingLifeTotal
	}
	document.getElementById('menu').classList.add('hidden')
	drawAllPlayerBoxes()
}
function updateColorSelector() {
	document.getElementById("inputPlayerColor").value = playerList[parseInt(document.getElementById("inputPlayer").value) - 1].color
	document.getElementById("inputTextColor").value = playerList[parseInt(document.getElementById("inputPlayer").value) - 1].textColor
}
function updateBackgroundColor(color) {
	playerList[parseInt(document.getElementById("inputPlayer").value) - 1].color = color
	drawPlayerBox(parseInt(document.getElementById("inputPlayer").value))
}
function updateTextColor(color) {
	playerList[parseInt(document.getElementById("inputPlayer").value) - 1].textColor = color
	drawPlayerBox(parseInt(document.getElementById("inputPlayer").value))
}
function loadImage(event, destination) {
	var input = event.target
	var reader = new FileReader()
	reader.onload = function() {
		var dataURL = reader.result
		destination.src = dataURL
	}
	reader.readAsDataURL(input.files[0])
}
var savedArtList = [], cardArtUrlList = [], cardArtArtistList = []
function inputCardArtName(cardArtNameInput) {
	var xhttp = new XMLHttpRequest()
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			savedArtList = this.responseText.split('"art_crop":"')
			savedArtList.splice(0, 1)
			document.getElementById("inputCardArtNameNumber").max = savedArtList.length
			document.getElementById("inputCardArtNameNumber").value = 1
			for (i = 0; i < savedArtList.length; i ++) {
				cardArtUrlList[i] = savedArtList[i].split('","border_crop":')[0]
			}
			for (i = 0; i < savedArtList.length; i ++) {
				cardArtArtistList[i] = savedArtList[i].slice(savedArtList[i].indexOf('"artist":"') + 10, savedArtList[i].indexOf('","border_color":'))
			}
			inputCardArtNameNumber(1)
		}
	}
	xhttp.open("GET", "https://api.scryfall.com/cards/search?order=released&unique=art&q=name%3D" + cardArtNameInput.replace(/ /g, "_"), true)
	xhttp.send()
}
function inputCardArtNameNumber(cardArtNameNumberInput) {
	playerList[parseInt(document.getElementById('inputPlayer').value) - 1].image.src = cardArtUrlList[cardArtNameNumberInput - 1]
}
document.getElementById("mainGrid").addEventListener("touchmove", function(event) {
	event.preventDefault()
}, false)
function rollRNG() {
	document.getElementById("rngOutput").innerHTML = Math.floor(Math.random() * (parseInt(document.getElementById("inputRNGMax").value) - parseInt(document.getElementById("inputRNGMin").value) + 1) + parseInt(document.getElementById("inputRNGMin").value))
}
function drawPlayerBox(playerBoxID) {
	var currentPlayerBox = playerList[playerBoxID - 1]
	var context = currentPlayerBox.canvas.customVarContext
	context.textBaseline = "middle"
	var tempFontSize = 100
	context.font = "100pt belerenbsc"
	context.fillStyle = currentPlayerBox.color
	var tempCanvasHeight = currentPlayerBox.canvas.height, tempCanvasWidth = currentPlayerBox.canvas.width
	if (playerList[playerBoxID - 1].rotation == 90 || playerList[playerBoxID - 1].rotation == 270) {
		tempCanvasHeight = tempCanvasWidth
		tempCanvasWidth = currentPlayerBox.canvas.height
	}
	context.fillRect(tempCanvasWidth / -2, tempCanvasHeight / -2, tempCanvasWidth, tempCanvasHeight)
	if (currentPlayerBox.image.src != "") {
		var imageToDraw = currentPlayerBox.image
		if (imageToDraw.width / imageToDraw.height > tempCanvasWidth / tempCanvasHeight) {
			//The image is wider and should be fitted to its height
			context.drawImage(imageToDraw, tempCanvasHeight / imageToDraw.height * imageToDraw.width / -2, tempCanvasHeight / -2, tempCanvasHeight / imageToDraw.height * imageToDraw.width, tempCanvasHeight)
		} else {
			//The image is taller and should be fitted to its width
			context.drawImage(imageToDraw, tempCanvasWidth / -2, tempCanvasWidth / imageToDraw.width * imageToDraw.height / -2, tempCanvasWidth, tempCanvasWidth / imageToDraw.width * imageToDraw.height)
		}
	}
	if (currentPlayerBox.life < 1) {
		context.fillStyle = "#0008"
		context.fillRect(tempCanvasWidth / -2, tempCanvasHeight / -2, tempCanvasWidth, tempCanvasHeight)
		context.fillStyle = "#800"
	} else {
		context.fillStyle = playerList[playerBoxID - 1].textColor
	}
	while (context.measureText(currentPlayerBox.life).width >= tempCanvasWidth) {
		tempFontSize -= 1
		context.font = tempFontSize + "pt belerenbsc"
	}
	var horizontalShift = -1 * parseInt(context.measureText(currentPlayerBox.life).width) / 2
	context.strokeStyle = "black"
	context.lineWidth = 5
	context.strokeText(currentPlayerBox.life, horizontalShift, 0)
	context.fillText(currentPlayerBox.life, horizontalShift, 0)
}
function drawAllPlayerBoxes() {
	for (var i = 1; i <= playerList.length; i ++) {
		drawPlayerBox(i)
	}
}
//Event Listener magic! (always records mouse/touch positions so the loop can work without events)
var touchX = [], touchY = []
document.getElementById("mainGrid").addEventListener("mousedown", startMouseCoordinates, true)
window.addEventListener("mousemove", updateMouseCoordinates, true)
window.addEventListener("mouseup", endMouseCoordinates, true)
function startMouseCoordinates() {
	mouseClickId += 1
    playerList[event.target.customVarID - 1].touchId = mouseClickId
	singleTap(event.target)
}
function updateMouseCoordinates() {
	touchX[0] = event.clientX
	touchY[0] = event.clientY}
function endMouseCoordinates() {
    for (var i = 1; i <= playerList.length; i++) {
        playerList[i - 1].touchId = 0.5
    }
}
window.addEventListener("touchstart", switchToTouchEvents, true)
function switchToTouchEvents() {
	window.removeEventListener("touchstart", switchToTouchEvents, true)
	document.getElementById("mainGrid").removeEventListener("mousedown", startMouseCoordinates, true)
	window.removeEventListener("mousemove", updateMouseCoordinates, true)
	window.removeEventListener("mouseup", endMouseCoordinates, true)
	document.getElementById("mainGrid").addEventListener("touchstart", startTouch, true)
	window.addEventListener("touchmove", moveTouch, true)
	window.addEventListener("touchend", endTouch, true)
}
function startTouch() {
    playerList[event.changedTouches[0].target.customVarID - 1].touchId = event.changedTouches[0].identifier
	moveTouch()
    singleTap(event.changedTouches[0].target)
}
function moveTouch() {
	touchX = [], touchY = []
	for (var i = 0; i < event.touches.length; i ++) {
		touchX[i] = event.touches[i].clientX
		touchY[i] = event.touches[i].clientY
	}
}
function endTouch() {
    for (var i = 1; i <= playerList.length; i++) {
        if (playerList[i - 1].touchId == event.changedTouches[0].identifier) {
            playerList[i - 1].touchId = 0.5
        }
    }
	moveTouch()
}
//Tap (and click) functions
function singleTap(targetPlayerBox) {
//    console.log("Box #" + targetPlayerBox.customVarID + " was pressed")
	var playerBoxBounds = targetPlayerBox.getBoundingClientRect()
//    console.log("Bounds:")
//    console.log(playerBoxBounds)
	var tappedPlayerBox = playerList[targetPlayerBox.customVarID - 1]
	var lifeAdjust = 0
//    console.log("Rotation: " + tappedPlayerBox.rotation)
//    console.log("touchX: " + touchX[touchX.length - 1] + "\ntouchY: " + touchY[touchY.length - 1])
	if (tappedPlayerBox.rotation == 0 || tappedPlayerBox.rotation == 180) {
//        console.log(touchX[touchX.length - 1])
//        console.log(playerBoxBounds.width / 2 + playerBoxBounds.left)
		if (touchX[touchX.length - 1] > playerBoxBounds.width / 2 + playerBoxBounds.left) {
			lifeAdjust = 1
		} else {
			lifeAdjust = -1
		}
	} else {
//        console.log(touchY[touchY.length - 1])
//        console.log(playerBoxBounds.height / 2 + playerBoxBounds.top)
		if (touchY[touchY.length - 1] > playerBoxBounds.height / 2 + playerBoxBounds.top) {
			lifeAdjust = 1
		} else {
			lifeAdjust = -1
		}
	}
	if (tappedPlayerBox.rotation == 180 || tappedPlayerBox.rotation == 270) {
		lifeAdjust *= -1
	}
//    console.log(lifeAdjust)
	tappedPlayerBox.direction = lifeAdjust
	tappedPlayerBox.life += lifeAdjust
	drawPlayerBox(tappedPlayerBox.id)
    setTimeout(clockCheck.bind(null, tappedPlayerBox, tappedPlayerBox.touchId), 500)
}
function clockCheck(tappedPlayerBox, lastTapID) {
    if (tappedPlayerBox.touchId == lastTapID) {
        tappedPlayerBox.life += tappedPlayerBox.direction
        drawPlayerBox(tappedPlayerBox.id)
        if (tappedPlayerBox.holdTime >= 150) {
            setTimeout(clockCheck.bind(null, tappedPlayerBox, tappedPlayerBox.touchId), 10)
        } else if (tappedPlayerBox.holdTime >= 50) {
            setTimeout(clockCheck.bind(null, tappedPlayerBox, tappedPlayerBox.touchId), 50)
        } else {
            setTimeout(clockCheck.bind(null, tappedPlayerBox, tappedPlayerBox.touchId), 100)
        }
        tappedPlayerBox.holdTime += 1
    } else {
        tappedPlayerBox.holdTime = 0
    }
}
//Hopefully stops the pesky double-tap zoom:
var doubleTouchStartTimestamp = 0
document.getElementById("mainGrid").addEventListener("touchstart", function() {
    var now = +(new Date())
    if (doubleTouchStartTimestamp + 500 > now){
        event.preventDefault()
    }
    doubleTouchStartTimestamp = now
})
//Updated :D

var inputsToRemoveAutocorrect = document.querySelectorAll("input");

inputsToRemoveAutocorrect.forEach(input => {
                                  input.setAttribute("autocomplete", "off")
                                  input.setAttribute("autocorrect", "off")
                                  input.setAttribute("autocapitalize", "off")
                                  input.setAttribute("spellcheck", false)
                                  })
