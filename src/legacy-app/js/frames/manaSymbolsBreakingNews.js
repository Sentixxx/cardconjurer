//checks to see if it needs to run
if (!card.manaSymbols.includes('/js/frames/manaSymbolsbreakingNews.js')) {
	card.manaSymbols.push('/js/frames/manaSymbolsbreakingNews.js');
}
if (!mana.get('majpw')) {
	loadManaSymbols([
		'breakingNews/breakingNews0',
		'breakingNews/breakingNews1',
		'breakingNews/breakingNews2',
		'breakingNews/breakingNews3',
		'breakingNews/breakingNews4',
		'breakingNews/breakingNews5',
		'breakingNews/breakingNews6',
		'breakingNews/breakingNews7',
		'breakingNews/breakingNews8',
		'breakingNews/breakingNews9',
		'breakingNews/breakingNewsx',
		'breakingNews/breakingNewsw',
		'breakingNews/breakingNewsu',
		'breakingNews/breakingNewsb',
		'breakingNews/breakingNewsr',
		'breakingNews/breakingNewsg',
		'breakingNews/breakingNewsc'
	]);
}