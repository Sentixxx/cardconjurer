import { html } from '../../html.mjs';
import {
  CollectorDefaultSection,
  CollectorFinishStyleSection,
  CollectorInfoFieldsSection,
  CollectorSettingsSection,
  CollectorStyleSection,
  CollectorVisibilitySection,
  SerialControlsSection,
} from './CreatorBottomInfoSections.mjs';

export function CreatorBottomInfoPanel() {
  return html`
    <${CollectorInfoFieldsSection} />
    <${CollectorSettingsSection} />
    <${CollectorStyleSection} />
    <${CollectorVisibilitySection} />
    <${SerialControlsSection} />
    <${CollectorFinishStyleSection} />
    <${CollectorDefaultSection} />
  `;
}
