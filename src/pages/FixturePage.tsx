import { useEffect, useState, type JSX } from 'react';
import { useRoute } from '@/lib/router';
import { Canvas } from '@/features/creator/canvas/Canvas';
import { useImageAsset } from '@/hooks/useImageAsset';
import { EMPTY_CARD, type CardData } from '@/types/cardData';

export function FixturePage(): JSX.Element {
  const [, params] = useRoute<{ slug: string }>('/fixtures/:slug');
  const slug = params?.slug ?? '';
  const [card, setCard] = useState<CardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setCard(null);
    setError(null);
    if (!slug) return;
    void fetch(`/fixtures/${slug}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`fixture ${slug} ${r.status}`);
        return r.json() as Promise<Partial<CardData>>;
      })
      .then((data) => {
        if (cancelled) return;
        setCard({ ...EMPTY_CARD, ...data, key: slug });
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const art = useImageAsset(card?.artUrl ?? null);
  const frame = useImageAsset(card?.frameUrl ?? null);
  const setSymbol = useImageAsset(card?.setSymbolUrl ?? null);
  const watermark = useImageAsset(card?.watermarkUrl ?? null);

  if (error) {
    return <main className="main-content" data-fixture-error={error}>fixture error: {error}</main>;
  }

  if (!card) {
    return <main className="main-content" data-fixture-loading="1">loading fixture {slug}…</main>;
  }

  return (
    <main
      className="main-content"
      data-fixture-slug={slug}
      data-fixture-ready={
        frame.image && (!card.artUrl || art.image) && (!card.setSymbolUrl || setSymbol.image) && (!card.watermarkUrl || watermark.image)
          ? '1'
          : '0'
      }
    >
      <Canvas
        card={card}
        artImage={art.image}
        frameImage={frame.image}
        setSymbolImage={setSymbol.image}
        watermarkImage={watermark.image}
        displayWidth={750}
      />
    </main>
  );
}
