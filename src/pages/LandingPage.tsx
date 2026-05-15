import type { JSX } from 'react';
import { Link, ROUTES } from '@/lib/router';

export function LandingPage(): JSX.Element {
  return (
    <article>
      <h2>Welcome to Card Forger</h2>
      <p>
        Card Forger is an open-source, statically-hosted Magic: the Gathering card builder. It is a
        TypeScript / React / Vite port of <a href="https://cardconjurer.com" target="_blank" rel="noreferrer">Card Conjurer</a>,
        focused on running entirely in the browser with no backend.
      </p>
      <p>
        Jump in:
      </p>
      <ul>
        <li>
          <Link href={ROUTES.creator.path}>Creator</Link> — design a card with the live canvas editor.
        </li>
        <li>
          <Link href={ROUTES.gallery.path}>Gallery</Link> — manage saved cards (load, delete, import / export JSON).
        </li>
        <li>
          <Link href={ROUTES.converter.path}>Converter</Link> — crop &amp; mask an uploaded card image.
        </li>
        <li>
          <Link href={ROUTES.askUrza.path}>Ask Urza</Link> — roll a random planeswalker ability.
        </li>
        <li>
          <Link href={ROUTES.phyrexian.path}>Phyrexian</Link> — transliterate text into Phyrexian glyphs.
        </li>
        <li>
          <Link href={ROUTES.theme.path}>Theme</Link> — pick a palette or build a custom overlay.
        </li>
      </ul>
      <p>
        Migration status &amp; design notes live in <code>REFRACTOR_STATE.md</code> at the repo root.
      </p>
    </article>
  );
}
