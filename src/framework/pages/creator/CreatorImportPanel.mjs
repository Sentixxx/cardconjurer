import { html } from '../../html.mjs';
import {
  PasteCardSections,
  RealCardImportSection,
  SavedCardLibrarySection,
  SavedCardStorageInfoSection,
  SavedCardTransferSection,
} from './CreatorImportSections.mjs';

export function CreatorImportPanel() {
  return html`
    <${RealCardImportSection} />
    <${PasteCardSections} />
    <${SavedCardLibrarySection} />
    <${SavedCardTransferSection} />
    <${SavedCardStorageInfoSection} />
  `;
}
