import { html } from '../../html.mjs';
import {
  WatermarkClearSection,
  WatermarkColorSection,
  WatermarkPositionSection,
  WatermarkSourceSection,
} from './CreatorWatermarkSections.mjs';

export function CreatorWatermarkPanel() {
  return html`
    <${WatermarkSourceSection} />
    <${WatermarkColorSection} />
    <${WatermarkPositionSection} />
    <${WatermarkClearSection} />
  `;
}
