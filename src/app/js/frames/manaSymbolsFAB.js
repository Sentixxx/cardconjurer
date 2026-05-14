//checks to see if it needs to run
if (!card.manaSymbols.includes('/js/frames/manaSymbolsFAB.js')) {
	card.manaSymbols.push('/js/frames/manaSymbolsFAB.js');
}
if (!mana.get('fab')) {
	loadManaSymbols(['fab/fabw', 'fab/fabu', 'fab/fabb', 'fab/fabr', 'fab/fabg']);
}