if (!loadedVersions.includes('m15/m21')) {
	loadedVersions.push("m15/m21")
	loadFrameImages([
		['White M21 Showcase Frame', '/data/images/cardImages/m15/m21/m15M21FrameW.png', 0, 0, 1, 1, ['Full']],
		['Blue M21 Showcase Frame', '/data/images/cardImages/m15/m21/m15M21FrameU.png', 0, 0, 1, 1, ['Full']],
		['Black M21 Showcase Frame', '/data/images/cardImages/m15/m21/m15M21FrameB.png', 0, 0, 1, 1, ['Full']],
		['Red M21 Showcase Frame', '/data/images/cardImages/m15/m21/m15M21FrameR.png', 0, 0, 1, 1, ['Full']],
		['Green M21 Showcase Frame', '/data/images/cardImages/m15/m21/m15M21FrameG.png', 0, 0, 1, 1, ['Full']],
		['White Land M21 Showcase Frame', '/data/images/cardImages/m15/m21/m15M21FrameWL.png', 0, 0, 1, 1, ['Full']],
		['Blue Land M21 Showcase Frame', '/data/images/cardImages/m15/m21/m15M21FrameUL.png', 0, 0, 1, 1, ['Full']],
		['Black Land M21 Showcase Frame', '/data/images/cardImages/m15/m21/m15M21FrameBL.png', 0, 0, 1, 1, ['Full']],
		['Red Land M21 Showcase Frame', '/data/images/cardImages/m15/m21/m15M21FrameRL.png', 0, 0, 1, 1, ['Full']],
		['Green Land M21 Showcase Frame', '/data/images/cardImages/m15/m21/m15M21FrameGL.png', 0, 0, 1, 1, ['Full']],
		['White Power/Toughness', '/data/images/cardImages/m15/m21/m15M21PTW.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Blue Power/Toughness', '/data/images/cardImages/m15/m21/m15M21PTU.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Black Power/Toughness', '/data/images/cardImages/m15/m21/m15M21PTB.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Red Power/Toughness', '/data/images/cardImages/m15/m21/m15M21PTR.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Green Power/Toughness', '/data/images/cardImages/m15/m21/m15M21PTG.png', 1136/1500, 1858/2100, 282/1500, 154/2100, ['Full']],
		['Holo Stamp', '/data/images/cardImages/m15/m21/m15M21Stamp.png', 709/1500, 1873/2100, 82/1500, 82/2100, ['Full']],
		['Chandra\'s Fire', '/data/images/cardImages/m15/m21/m15M21Fire.png', 11/1500, 1725/2100, 1480/1500, 320/2100, ['Full']]
	], 'frameClassM15M21Showcase')
	addToManaSymbolList('/data/images/cardImages/manaSymbols/m21/', ["m210", "m211", "m212", "m213", "m214", "m215", "m216", "m217", "m218", "m219", "m21w", "m21u", "m21b", "m21r", "m21g", "m21x",])
	addToManaSymbolList('/data/images/cardImages/manaSymbols/m21/dark/', ["dm210", "dm211", "dm212", "dm213", "dm214", "dm215", "dm216", "dm217", "dm218", "dm219", "dm21w", "dm21u", "dm21b", "dm21r", "dm21g", "dm21x",])
	notify('The M21 Showcase frame uses special mana symbols for 1-9, WUBRG, and X. If you would like to use these, just add an "m21" at the beginning of each symbol. For example, "2 g g" would become "m212 m21g m21g". For the darkened mana symbols seen on the white frame, add an additional "d" at the beginning. For example, "3 w" would become "dm213 dm21w".', '#aaffaae0')
}

if (currentVersion != 'm15/m21') {
	currentVersion = 'm15/m21'
	
	loadTextOptions([
	new cardText('Card Title', '', 126/1500, 188/2100, 1248/1500, 80/2100, 'belerenb', 80/2100, 'white', ['oneLine=true']),
	new cardText('Card Type', '', 126/1500, 1264/2100, 1248/1500, 68/2100, 'belerenb', 68/2100, 'white', ['oneLine=true']),
	new cardText('Rules Text', '', 145/1500, 1370/2100, 1210/1500, 625/2100, 'mplantin', 74/2100, 'black'),
	new cardText('Power/Toughness', '', 1191/1500, 1954/2100, 205/1500, 78/2100, 'belerenbsc', 78/2100, 'white', ['oneLine=true,textAlign="center"'])
	])

	manaCostXPath = '1316 - 78 * manaSymbolIndex'
	manaCostYPath = '122'
	manaCostDiameter = '74'
	manaCostShadowOffset = 'none'
	manaCostDirection = 'reverse'

	artX = scaleX(115 / 1500)
	artY = scaleY(237 / 2100)
	artWidth = scaleX(1270 / 1500)
	artHeight = scaleY(929 / 2100)
}

hideFrameImages('frameClassM15M21Showcase')