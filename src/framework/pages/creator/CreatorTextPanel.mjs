import { html } from '../../html.mjs';
import {
  ExtraTextboxSection,
  ReminderTextItalicSection,
  ReminderTextVisibilitySection,
  TextAreaPickerSection,
  TextCodeReferenceSection,
  TextEditorSection,
} from './CreatorTextSections.mjs';

export function CreatorTextPanel() {
  return html`
    <${TextAreaPickerSection} />
    <${TextEditorSection} />
    <${TextCodeReferenceSection} />
    <${ReminderTextVisibilitySection} />
    <${ReminderTextItalicSection} />
    <${ExtraTextboxSection} />
  `;
}
