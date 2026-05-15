import type { JSX } from 'react';
import galleryFrames from '@/services/galleryFrames.json';

interface GalleryFrameItem {
  readonly name: string;
  readonly location: string;
  readonly image: string;
}

interface GalleryFrameSection {
  readonly title: string;
  readonly items: readonly GalleryFrameItem[];
}

const galleryData = galleryFrames as {
  readonly loadingImage: string;
  readonly sections: readonly GalleryFrameSection[];
};

export function GalleryPage(): JSX.Element {
  return (
    <article className="gallery-page">
      <h2 className="readable-background header-extension title center">Available Frames</h2>
      <h4 className="readable-background header-extension center">What they're called, and where to find them</h4>
      {galleryData.sections.map((section) => (
        <section key={section.title} className="layer">
          <h3 className="center gallery-grid-title">{section.title}</h3>
          <div className="gallery-grid">
            {section.items.map((item) => (
              <div key={`${section.title}-${item.name}-${item.location}`} className="gallery-grid-item readable-background">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.src = galleryData.loadingImage;
                  }}
                />
                <h4>{item.name}</h4>
                <p>{item.location}</p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </article>
  );
}
