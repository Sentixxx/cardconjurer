import { html } from '../../html.mjs';
import {
  ArtClearSection,
  ArtGrayscaleSection,
  ArtGuidelinesSection,
  ArtPositionSection,
  ArtSourceSection,
} from './CreatorArtSections.mjs';

export function CreatorArtPanel() {
  return html`
    <${ArtSourceSection} />
    <${ArtPositionSection} />
    <${ArtGrayscaleSection} />
    <${ArtClearSection} />
    <${ArtGuidelinesSection} />
  `;
}
