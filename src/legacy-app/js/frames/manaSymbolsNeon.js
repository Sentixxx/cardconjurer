//checks to see if it needs to run
if (!card.manaSymbols.includes('/js/frames/manaSymbolsNeon.js')) {
	card.manaSymbols.push('/js/frames/manaSymbolsNeon.js');
}
if (!mana.get('neonw')) {
	loadManaSymbols([
		'neon/neonw', 'neon/neonu', 'neon/neonb', 'neon/neonr', 'neon/neong',
		'neon/neonc', 'neon/neonx', 'neon/neon0', 'neon/neon1',
		'neon/neon2', 'neon/neon3', 'neon/neon4', 'neon/neon5', 'neon/neon6',
		'neon/neon7', 'neon/neon8', 'neon/neon9'
	]);
}