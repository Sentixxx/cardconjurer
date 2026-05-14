//checks to see if it needs to run
if (!card.manaSymbols.includes('/js/frames/manaSymbolsWanted.js')) {
	card.manaSymbols.push('/js/frames/manaSymbolsWanted.js');
}
if (!mana.get('majpw')) {
	loadManaSymbols([
		'wanted/wanted0',
		'wanted/wanted1',
		'wanted/wanted2',
		'wanted/wanted3',
		'wanted/wanted4',
		'wanted/wanted5',
		'wanted/wanted6',
		'wanted/wanted7',
		'wanted/wanted8',
		'wanted/wanted9',
		'wanted/wantedx',
		'wanted/wantedw',
		'wanted/wantedu',
		'wanted/wantedb',
		'wanted/wantedr',
		'wanted/wantedg',
		'wanted/wantedc'
	]);
}