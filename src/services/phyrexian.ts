const PHYREXIAN_RANDOM_CHARS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  '%', '&', ',',
] as const;

export type PhyrexianRandomFn = () => number;

function pickRandom(rand: PhyrexianRandomFn): string {
  const index = Math.floor(rand() * PHYREXIAN_RANDOM_CHARS.length);
  return PHYREXIAN_RANDOM_CHARS[index] ?? PHYREXIAN_RANDOM_CHARS[0];
}

/**
 * Transliterate text into Phyrexian-font-compatible glyphs.
 * Behaviour matches legacy `src/legacy-app/phyrexian/phyrexian.js`:
 * - paragraphs are split on '\n'
 * - sentences within a paragraph are split on '. '
 * - each sentence becomes '|' + (length-2) random chars + '. '
 * - paragraphs are rejoined with '\n' between (no trailing newline).
 */
export function transliterateToPhyrexian(input: string, rand: PhyrexianRandomFn = Math.random): string {
  const paragraphs = input.split('\n');
  const out: string[] = [];
  for (let i = 0; i < paragraphs.length; i += 1) {
    const sentences = paragraphs[i].split('. ');
    let paragraph = '';
    for (const sentence of sentences) {
      paragraph += '|';
      const fillerLength = Math.max(0, sentence.length - 2);
      for (let k = 0; k < fillerLength; k += 1) {
        paragraph += pickRandom(rand);
      }
      paragraph += '. ';
    }
    out.push(paragraph);
  }
  return out.join('\n');
}
