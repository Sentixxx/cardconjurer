//checks to see if it needs to run
if (!card.manaSymbols.includes('/js/frames/manaSymbolsFuture.js')) {
	card.manaSymbols.push('/js/frames/manaSymbolsFuture.js');
}
if (!mana.get('fw')) {
	loadManaSymbols(['future/fw.png', 'future/fu.png', 'future/fb.png', 'future/fr.png', 'future/fg.png', 'future/f0.png', 'future/f1.png', 'future/f2.png', 'future/f3.png', 'future/f4.png', 'future/f5.png', 'future/f6.png', 'future/f7.png', 'future/f8.png', 'future/f9.png', 'future/f10.png', 'future/f11.png', 'future/f12.png', 'future/f13.png', 'future/f14.png', 'future/f15.png', 'future/f16.png', 'future/f17.png', 'future/f18.png', 'future/f19.png', 'future/f20.png', 'future/fwu.png', 'future/fwb.png', 'future/fub.png', 'future/fur.png', 'future/fbr.png', 'future/fbg.png', 'future/frg.png', 'future/frw.png', 'future/fgw.png', 'future/fgu.png', 'future/fx.png']);
}