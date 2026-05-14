//checks to see if it needs to run
if (!card.manaSymbols.includes('/js/frames/manaSymbolsOutlineAlt.js')) {
	card.manaSymbols.push('/js/frames/manaSymbolsOutlineAlt.js');
}
if (!mana.get('outlineAltw')) {
	loadManaSymbols([
		'outlineAlt/outlineAltw', 'outlineAlt/outlineAltu', 'outlineAlt/outlineAltb', 'outlineAlt/outlineAltr', 'outlineAlt/outlineAltg',
		'outlineAlt/outlineAltc', 'outlineAlt/outlineAlts', 'outlineAlt/outlineAltx', 'outlineAlt/outlineAlt0', 'outlineAlt/outlineAlt1',
		'outlineAlt/outlineAlt2', 'outlineAlt/outlineAlt3', 'outlineAlt/outlineAlt4', 'outlineAlt/outlineAlt5', 'outlineAlt/outlineAlt6',
		'outlineAlt/outlineAlt7', 'outlineAlt/outlineAlt8', 'outlineAlt/outlineAlt9', 'outlineAlt/outlineAltt'
	]);
}