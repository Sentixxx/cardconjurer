//checks to see if it needs to run
if (!card.manaSymbols.includes('/js/frames/manaSymbolsM21.js')) {
	card.manaSymbols.push('/js/frames/manaSymbolsM21.js');
}
if (!mana.get('m21w')) {
	loadManaSymbols(['m21/m21w.png', 'm21/m21u.png', 'm21/m21b.png', 'm21/m21r.png', 'm21/m21g.png', 'm21/m210.png', 'm21/m211.png', 'm21/m212.png', 'm21/m213.png', 'm21/m214.png', 'm21/m215.png', 'm21/m216.png', 'm21/m217.png', 'm21/m218.png', 'm21/m219.png', 'm21/m21x.png', 'm21/dark/dm21w.png', 'm21/dark/dm21u.png', 'm21/dark/dm21b.png', 'm21/dark/dm21r.png', 'm21/dark/dm21g.png', 'm21/dark/dm210.png', 'm21/dark/dm211.png', 'm21/dark/dm212.png', 'm21/dark/dm213.png', 'm21/dark/dm214.png', 'm21/dark/dm215.png', 'm21/dark/dm216.png', 'm21/dark/dm217.png', 'm21/dark/dm218.png', 'm21/dark/dm219.png', 'm21/dark/dm21x.png']);
}