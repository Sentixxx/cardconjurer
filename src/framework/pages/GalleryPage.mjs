import { readGalleryDataSync } from '../data/gallery-data.mjs';
import { html } from '../html.mjs';

const galleryData = readGalleryDataSync();

function GalleryCard({ item }) {
  return html`
    <div class="galleryGridItem readable-background">
      <img loading="lazy" decoding="async" alt=${item.name} src=${`/gallery/img/${item.image}`} />
      <h4>${item.name}</h4>
      <p>${item.location}</p>
    </div>
  `;
}

function GallerySection({ section }) {
  return html`
    <div class="layer">
      <h3 class="center galleryGridTitle">${section.title}</h3>
      <div class="galleryGrid" id=${section.gridId}>
        ${section.items.map((item) => html`<${GalleryCard} item=${item} />`)}
      </div>
    </div>
  `;
}

export function GalleryPage() {
  return html`
    <h2 class="readable-background header-extension title center">Available Frames</h2>
    <h4 class="readable-background header-extension center">What they're called, and where to find them</h4>
    ${galleryData.map((section) => html`<${GallerySection} section=${section} />`)}
    <style>
      .galleryGridTitle {
        margin-bottom: 4rem;
      }
      .galleryGrid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
        grid-gap: 0.5rem;
        margin-bottom: 0.5rem;
        grid-gap: 2rem;
        padding-top: 0;
        align-content: start;
      }
      .galleryGridItem {
        max-width: 80vw;
        width: 20rem;
        height: auto;
        margin: auto;
        border-radius: 1rem;
        padding: 0.5rem;
      }
      .galleryGridItem > img {
        width: 100%;
        aspect-ratio: 5 / 7;
      }
      .galleryGridItem > h4 {
        padding: 0.25rem;
      }
      .galleryGridItem > p {
        padding: 0.125rem;
      }
    </style>
  `;
}
