import type { JSX } from 'react';
import { Placeholder } from '@/components/Placeholder';

export function AboutPage(): JSX.Element {
  return (
    <>
      <Placeholder routeKey="about" description="Background on the Card Conjurer project this app is forked from." />
      <article>
        <h2>About</h2>
        <p>
          Card Conjurer was started by Kyle in the summer of 2018 as a small web app for filling blank Magic: the
          Gathering card images with text and mana symbols. Over the following years it grew into a full card
          builder with frame packs, mask blending, planeswalker / saga / multi-faced layouts, and a Scryfall
          importer.
        </p>
        <p>
          Card Forger is a TypeScript / React / Vite port of that codebase. The goal is a deployable static OSS
          site with no server runtime — see the migration plan under <code>REFRACTOR_STATE.md</code>.
        </p>
        <p>
          Upstream attribution and a fuller history live in <code>README.md</code> and the original creator&rsquo;s
          social channels.
        </p>
      </article>
    </>
  );
}
