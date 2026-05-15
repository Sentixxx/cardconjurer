import type { JSX } from 'react';
import { Link, ROUTES } from '@/lib/router';

export function AskUrzaAbilityListPage(): JSX.Element {
  return (
    <>
      <h2 className="readable-background header-extension title center margin-bottom-large">
        Ask Urza — Ability List Generator
      </h2>
      <div className="readable-background layer margin-bottom-large">
        <h5 className="padding">
          This URL used to host a one-off scraper that crawled Scryfall, walked every planeswalker&rsquo;s
          oracle text, classified each line as <code>+</code>, <code>−</code>, or ultimate, and emitted a
          semicolon-delimited dump. That dump was then committed as a static text file and consumed by the
          public Ask Urza tool.
        </h5>
        <h5 className="padding">
          In Card Forger we ship the dump directly as a static asset at{' '}
          <code>askurza/planeswalkerAbilities.txt</code>. No client-side scrape is required, and the
          generator page is preserved for historical URL compatibility.
        </h5>
        <h5 className="padding">
          To roll a random ability, head to <Link href={ROUTES.askUrza.path}>Ask Urza</Link>.
        </h5>
      </div>
    </>
  );
}
