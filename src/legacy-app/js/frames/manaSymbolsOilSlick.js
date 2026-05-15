//checks to see if it needs to run
if (!card.manaSymbols.includes('/js/frames/manaSymbolsOilSlick.js')) {
	card.manaSymbols.push('/js/frames/manaSymbolsOilSlick.js');
}
if (!mana.get('oilslickw')) {
	loadManaSymbols([
		'oilslick/oilslickw.png',
		'oilslick/oilslicku.png',
		'oilslick/oilslickb.png',
		'oilslick/oilslickr.png',
		'oilslick/oilslickg.png',
		'oilslick/oilslick0.png',
		'oilslick/oilslick1.png',
		'oilslick/oilslick2.png',
		'oilslick/oilslick3.png',
		'oilslick/oilslick4.png',
		'oilslick/oilslick5.png',
		'oilslick/oilslick6.png',
		'oilslick/oilslick7.png',
		'oilslick/oilslick8.png',
		'oilslick/oilslick9.png',
		'oilslick/oilslickx.png',
		'oilslick/oilslickwp.png',
		'oilslick/oilslickup.png',
		'oilslick/oilslickbp.png',
		'oilslick/oilslickrp.png',
		'oilslick/oilslickgp.png',
		'oilslick/oilslickp.png',
		]);
}