import { html } from '../../html.mjs';

export function NumericEditorField({ id, label, placeholder = 'X', attrs = {} }) {
  return html`
    <div>
      <h5 class="input-description">${label}</h5>
      <input id=${id} class="input" type="number" placeholder=${placeholder} step="1" ...${attrs} />
    </div>
  `;
}

export function FrameEditorCheckboxField({ label, text, id, placeholder }) {
  return html`
    <div>
      <h5 class="input-description">${label}</h5>
      <label class="checkbox-container input">
        ${text}
        <input id=${id} type="checkbox" placeholder=${placeholder} />
        <span class="checkmark"></span>
      </label>
    </div>
  `;
}

export function HslAdjustmentInput({ id, type, min, max, label }) {
  return html`
    <input
      id=${id}
      class="input"
      type=${type}
      min=${min}
      max=${max}
      value="0"
      step="1"
      aria-label=${label}
    />
  `;
}
