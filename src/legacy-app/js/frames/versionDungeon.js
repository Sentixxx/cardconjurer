//checks to see if it needs to run
if (!loadedVersions.includes('/js/frames/versionDungeon.js')) {
	loadedVersions.push('/js/frames/versionDungeon.js');
	sizeCanvas('dungeon');
	sizeCanvas('dungeonFX');
	document.querySelector('#creator-menu-tabs').innerHTML += '<h3 class="selectable readable-background" onclick="toggleCreatorTabs(event, `dungeon`)">Dungeon</h3>';
	var newHTML = document.createElement('div');
	newHTML.id = 'creator-menu-dungeon';
	newHTML.classList.add('hidden');
	newHTML.innerHTML = `
	<div class='readable-background padding margin-bottom'>
		<h5 class='padding margin-bottom input-description'>Use the following textbox to specify your room locations and sizes.<br><br>Each room must be separated by a new line, and may only include numeric characters.<br><br>Each number must be seperated by a comma, and ordered as follows:<br>X,Y,Width,Height,Door-1,Door-2,...<br>(doors are optional).<br><br>Apologies for the difficult interface; I hope to implement an improved UI in the future.</h5>
		<textarea id='dungeon-input' type='number' class='input margin-bottom' oninput='dungeonEditedBuffer();'>0,0,16,2,3,11\n0,2,8,4,1.5,5.5\n8,2,8,4,0.5,4.5\n0,6,5,5,1.5\n5,6,6,5,0.5,3.5\n11,6,5,5,1.5\n0,11,8,4,3\n8,11,8,4,3\n0,15,16,4,7</textarea>
	</div>
	<div class='readable-background padding'>
		<h5 class='padding margin-bottom input-description'>Select the dungeon wall color:</h5>
		<select id='dungeon-color' class='input' onchange='dungeonEditedBuffer();'>
			<option value="W">White</option>
			<option value="U">Blue</option>
			<option value="B" selected="selected">Black</option>
			<option value="R">Red</option>
			<option value="G">Green</option>
			<option value="C">Colorless</option>
		</select>
	</div>`;
	if (!card.dungeon) {
		card.dungeon = {abilities:[1, 1, 1, 0], count:3, x:0.1, width:0.3947};
	}
	document.querySelector('#creator-menu-sections').appendChild(newHTML);
	var dungeonFXtop = new Image(); setImageUrl(dungeonFXtop, '/img/frames/dungeon/walls/fx/top.png');
	var dungeonFXleft = new Image(); setImageUrl(dungeonFXleft, '/img/frames/dungeon/walls/fx/left.png');
	var dungeonFXbottom = new Image(); setImageUrl(dungeonFXbottom, '/img/frames/dungeon/walls/fx/bottom.png');
	var dungeonFXright = new Image(); setImageUrl(dungeonFXright, '/img/frames/dungeon/walls/fx/right.png');
	var dungeonFXtopright = new Image(); setImageUrl(dungeonFXtopright, '/img/frames/dungeon/walls/fx/topright.png');
	var dungeonFXtopleft = new Image(); setImageUrl(dungeonFXtopleft, '/img/frames/dungeon/walls/fx/topleft.png');
	var dungeonFXbottomright = new Image(); setImageUrl(dungeonFXbottomright, '/img/frames/dungeon/walls/fx/bottomright.png');
	var dungeonFXbottomleft = new Image(); setImageUrl(dungeonFXbottomleft, '/img/frames/dungeon/walls/fx/bottomleft.png');
	var dungeonShapetop = new Image(); setImageUrl(dungeonShapetop, '/img/frames/dungeon/walls/shape/top.png');
	var dungeonShapeleft = new Image(); setImageUrl(dungeonShapeleft, '/img/frames/dungeon/walls/shape/left.png');
	var dungeonShapebottom = new Image(); setImageUrl(dungeonShapebottom, '/img/frames/dungeon/walls/shape/bottom.png');
	var dungeonShaperight = new Image(); setImageUrl(dungeonShaperight, '/img/frames/dungeon/walls/shape/right.png');
	var dungeonShapetopright = new Image(); setImageUrl(dungeonShapetopright, '/img/frames/dungeon/walls/shape/topright.png');
	var dungeonShapetopleft = new Image(); setImageUrl(dungeonShapetopleft, '/img/frames/dungeon/walls/shape/topleft.png');
	var dungeonShapebottomright = new Image(); setImageUrl(dungeonShapebottomright, '/img/frames/dungeon/walls/shape/bottomright.png');
	var dungeonShapebottomleft = new Image(); setImageUrl(dungeonShapebottomleft, '/img/frames/dungeon/walls/shape/bottomleft.png');
	var dungeonDoorwayShape = new Image(); setImageUrl(dungeonDoorwayShape, '/img/frames/dungeon/walls/shape/doorway.png');
	var dungeonDoorwayFX = new Image(); setImageUrl(dungeonDoorwayFX, '/img/frames/dungeon/walls/fx/doorway.png');
	var dungeonDoorwayArrow = new Image(); setImageUrl(dungeonDoorwayArrow, '/img/frames/dungeon/walls/arrow.png');
	var dungeonDoorwayCutout = new Image(); setImageUrl(dungeonDoorwayCutout, '/img/frames/dungeon/walls/doorway.png');
	var dungeonOuterShape = new Image(); setImageUrl(dungeonOuterShape, '/img/frames/dungeon/walls/shape/outer.png');
	var dungeonOuterFX = new Image(); setImageUrl(dungeonOuterFX, '/img/frames/dungeon/walls/fx/outer.png');
	var dungeonTextureW = new Image(); setImageUrl(dungeonTextureW, '/img/frames/dungeon/walls/textures/w.png');
	var dungeonTextureU = new Image(); setImageUrl(dungeonTextureU, '/img/frames/dungeon/walls/textures/u.png');
	var dungeonTextureB = new Image(); setImageUrl(dungeonTextureB, '/img/frames/dungeon/walls/textures/b.png');
	var dungeonTextureR = new Image(); setImageUrl(dungeonTextureR, '/img/frames/dungeon/walls/textures/r.png');
	var dungeonTextureG = new Image(); setImageUrl(dungeonTextureG, '/img/frames/dungeon/walls/textures/g.png');
	var dungeonTextureC = new Image(); setImageUrl(dungeonTextureC, '/img/frames/dungeon/walls/textures/c.png');
	dungeonTextureC.onload = dungeonEditedBuffer;
}

var drawingDungeon;
function dungeonEditedBuffer() {
	clearTimeout(drawingDungeon);
	drawingDungeon = setTimeout(dungeonEdited, 500);
}

function dungeonEdited() {
	//gather data
	data = document.querySelector('#dungeon-input').value;
	rooms = [];
	data.replace(/ /g, '').split('\n').forEach(room => {
		newRoom = room.split(',');
		for (i = 0; i < newRoom.length; i++) {
			if (i >= 4) {
				newRoom[i] = parseFloat(newRoom[i]);
			} else {
				newRoom[i] = parseInt(newRoom[i]);
			}
			if (1 < i && i < 4) {
				newRoom[i] -= 1;
			}
		}
		while (room.length < 4) {
			try {
				room.push(1);
			} catch {
				room = [0, 0, 1, 1];
			}
		}
		rooms.push(newRoom);
	});
	console.log(rooms);
	// init variables
	const cellSize = scaleHeight(0.0381);
	const origX = scaleX(0.0734);
	const origY = scaleY(0.1377);
	// walls
	dungeonContext.clearRect(0, 0, dungeonCanvas.width, dungeonCanvas.height);
	dungeonFXContext.clearRect(0, 0, dungeonFXCanvas.width, dungeonFXCanvas.height);
	rooms.forEach(room => {
		//top left corner
		dungeonContext.drawImage(dungeonShapetopleft, origX + cellSize * room[0], origY + cellSize * room[1], cellSize, cellSize);
		dungeonFXContext.drawImage(dungeonFXtopleft, origX + cellSize * room[0], origY + cellSize * room[1], cellSize, cellSize);
		//top right corner
		dungeonContext.drawImage(dungeonShapetopright, origX + cellSize * (room[0] + room[2]), origY + cellSize * room[1], cellSize, cellSize);
		dungeonFXContext.drawImage(dungeonFXtopright, origX + cellSize * (room[0] + room[2]), origY + cellSize * room[1], cellSize, cellSize);
		//bottom left corner
		dungeonContext.drawImage(dungeonShapebottomleft, origX + cellSize * room[0], origY + cellSize * (room[1] + room[3]), cellSize, cellSize);
		dungeonFXContext.drawImage(dungeonFXbottomleft, origX + cellSize * room[0], origY + cellSize * (room[1] + room[3]), cellSize, cellSize);
		//bottom right corner
		dungeonContext.drawImage(dungeonShapebottomright, origX + cellSize * (room[0] + room[2]), origY + cellSize * (room[1] + room[3]), cellSize, cellSize);
		dungeonFXContext.drawImage(dungeonFXbottomright, origX + cellSize * (room[0] + room[2]), origY + cellSize * (room[1] + room[3]), cellSize, cellSize);
		// horizontal walls
		for (var i = 1; i < room[2]; i++) {
			//top walls
			dungeonContext.drawImage(dungeonShapetop, origX + cellSize * (room[0] + i), origY + cellSize * room[1], cellSize, cellSize);
			dungeonFXContext.drawImage(dungeonFXtop, origX + cellSize * (room[0] + i), origY + cellSize * room[1], cellSize, cellSize);
			//bottom walls
			dungeonContext.drawImage(dungeonShapebottom, origX + cellSize * (room[0] + i), origY + cellSize * (room[1] + room[3]), cellSize, cellSize);
			dungeonFXContext.drawImage(dungeonFXbottom, origX + cellSize * (room[0] + i), origY + cellSize * (room[1] + room[3]), cellSize, cellSize);
		}
		// vertical walls
		for (var i = 1; i < room[3]; i++) {
			// left walls
			dungeonContext.drawImage(dungeonShapeleft, origX + cellSize * room[0], origY + cellSize * (room[1] + i), cellSize, cellSize);
			dungeonFXContext.drawImage(dungeonFXleft, origX + cellSize * room[0], origY + cellSize * (room[1] + i), cellSize, cellSize);
			// right walls
			dungeonContext.drawImage(dungeonShaperight, origX + cellSize * (room[0] + room[2]), origY + cellSize * (room[1] + i), cellSize, cellSize);
			dungeonFXContext.drawImage(dungeonFXright, origX + cellSize * (room[0] + room[2]), origY + cellSize * (room[1] + i), cellSize, cellSize);
		} 
	});
	dungeonContext.drawImage(dungeonOuterShape, 0, 0, dungeonCanvas.width, dungeonCanvas.height);
	dungeonFXContext.drawImage(dungeonOuterFX, 0, 0, dungeonFXCanvas.width, dungeonFXCanvas.height);
	// text
	var textObjects = {};
	textObjects.title = {name:'Title', text:'', x:0.0854, y:0.0522, width:0.8292, height:0.0543, oneLine:true, font:'belerenbsc', size:0.0381, color:'white', align:'center'};
	roomNumber = 1;
	rooms.forEach(room => {
		var textbox = {name:`Dungeon Room ${roomNumber}`, text:`Room ${roomNumber}{lns}{fontmplantin}{fontsize-8}Effect.`, x:(origX + cellSize * (room[0] + 0.5)) / card.width, y:(origY + cellSize * (room[1] + 0.5)) / card.height, width:(cellSize * room[2]) / card.width, height:(cellSize * room[3]) / card.height, font:'belerenb', size:0.0324, align:'center'};
		if (room[3] < 3) {
			textbox.text = textbox.text.replace('{lns}', '   ');
		}
		textObjects[`dungeonRoom${roomNumber}`] = textbox;
		roomNumber ++;
	})
	// doorways
	rooms.push([0,-2,16,1,7]);
	rooms.forEach(room => {
		doorways = room.slice(4);
		doorways.forEach(doorway => {
			dungeonContext.globalCompositeOperation = 'destination-out';
			dungeonFXContext.globalCompositeOperation = 'destination-out';
			dungeonContext.drawImage(dungeonDoorwayCutout, origX + cellSize * (room[0] + doorway - 0.5), origY + cellSize * (room[1] + room[3]));
			dungeonFXContext.drawImage(dungeonDoorwayCutout, origX + cellSize * (room[0] + doorway - 0.5), origY + cellSize * (room[1] + room[3]));
			dungeonContext.globalCompositeOperation = 'source-over';
			dungeonFXContext.globalCompositeOperation = 'source-over';
			dungeonContext.drawImage(dungeonDoorwayShape, origX + cellSize * (room[0] + doorway - 0.5), origY + cellSize * (room[1] + room[3]));
			dungeonFXContext.drawImage(dungeonDoorwayFX, origX + cellSize * (room[0] + doorway - 0.5), origY + cellSize * (room[1] + room[3]));
			if (room[1] != -2 && room[1] + room[3] != 18) {
				dungeonFXContext.drawImage(dungeonDoorwayArrow, origX + cellSize * (room[0] + doorway + 0.5), origY + cellSize * (room[1] + room[3] + 0.5));
			}
		});
	});
	// apply textures and FX
	dungeonContext.globalCompositeOperation = 'source-in';
	texture = window[`dungeonTexture${document.querySelector('#dungeon-color').value}`];
	dungeonContext.drawImage(texture, 0, 0, dungeonCanvas.width, dungeonCanvas.height);
	dungeonContext.globalCompositeOperation = 'source-over';
	dungeonContext.drawImage(dungeonFXCanvas, 0, 0, dungeonCanvas.width, dungeonCanvas.height)
	// finish
	loadTextOptions(textObjects);
	drawTextBuffer();
}
