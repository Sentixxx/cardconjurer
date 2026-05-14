import { html } from '../../html.mjs';
import {
  SetSymbolClearSection,
  SetSymbolDragTargetSection,
  SetSymbolLockSection,
  SetSymbolPositionSection,
  SetSymbolSourceSection,
} from './CreatorSetSymbolSections.mjs';

export function CreatorSetSymbolPanel() {
  return html`
    <${SetSymbolSourceSection} />
    <${SetSymbolPositionSection} />
    <${SetSymbolClearSection} />
    <${SetSymbolDragTargetSection} />
    <${SetSymbolLockSection} />
  `;
}
