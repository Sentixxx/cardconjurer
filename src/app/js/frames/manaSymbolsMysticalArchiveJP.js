//checks to see if it needs to run
if (!card.manaSymbols.includes('/js/frames/manaSymbolsMysticalArchiveJP.js')) {
	card.manaSymbols.push('/js/frames/manaSymbolsMysticalArchiveJP.js');
}
if (!mana.get('majpw')) {
	loadManaSymbols([
		'majp/majpw', 'majp/majpu', 'majp/majpb', 'majp/majpr', 'majp/majpg',
		'majp/majpc', 'majp/majpx', 'majp/majp0', 'majp/majp1',
		'majp/majp2', 'majp/majp3', 'majp/majp4', 'majp/majp5', 'majp/majp6',
		'majp/majp7', 'majp/majp8', 'majp/majp9'
	]);
}