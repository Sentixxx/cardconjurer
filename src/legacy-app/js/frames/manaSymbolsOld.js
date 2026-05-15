//checks to see if it needs to run
if (!card.manaSymbols.includes('/js/frames/manaSymbolsOld.js')) {
	card.manaSymbols.push('/js/frames/manaSymbolsOld.js');
}
if (!mana.get('old')) {
	loadManaSymbols([
		'old/oldw', 'old/oldu', 'old/oldb', 'old/oldr', 'old/oldg',
	]);
}