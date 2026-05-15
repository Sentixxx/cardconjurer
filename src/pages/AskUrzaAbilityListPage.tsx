import type { JSX } from 'react';
import { Placeholder } from '@/components/Placeholder';
import { Link, ROUTES } from '@/lib/router';

export function AskUrzaAbilityListPage(): JSX.Element {
  return (
    <>
      <Placeholder
        routeKey="askUrzaAbilityList"
        description="Ability list generator — legacy build tool, not needed at runtime in the new architecture."
      />
      <article>
        <p>
          This URL used to host a one-off scraper that crawled Scryfall, walked every planeswalker&rsquo;s
          oracle text, classified each line as <code>+</code>, <code>−</code>, or ultimate, and emitted a
          semicolon-delimited dump. That dump was then committed as a static text file and consumed by the
          public Ask Urza tool.
        </p>
        <p>
          In Card Forger we ship the dump directly as a static asset at{' '}
          <code>public/data/askurza/abilities.txt</code>. No client-side scrape is required, and the
          generator page is preserved for historical URL compatibility.
        </p>
        <p>
          To roll a random ability, head to <Link href={ROUTES.askUrza.path}>Ask Urza</Link>.
        </p>
      </article>
    </>
  );
}
