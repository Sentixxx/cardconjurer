import { h } from 'preact';
import { html } from '../../html.mjs';

export function PrintSelectControl({ control }) {
  return html`
    <h5 class="margin-bottom padding input-description">${control.label}</h5>
    <select onchange=${control.onchange} class="input margin-bottom">
      ${control.options.map((option) => html`<option value=${option.value}>${option.label}</option>`)}
    </select>
  `;
}

export function PrintNumberInput({ input, className = 'input margin-bottom' }) {
  return h('input', {
    type: 'number',
    id: input.id,
    class: className,
    value: input.value,
    ...(input.min === undefined ? {} : { min: input.min }),
    ...(input.max === undefined ? {} : { max: input.max }),
    onchange: input.onchange || 'setCardSize();',
  });
}

export function PrintCheckboxControl({ control }) {
  return html`
    <h5 class="margin-bottom padding input-description">${control.description}</h5>
    <label class="checkbox-container input margin-bottom">
      ${control.label}
      ${control.checked
        ? html`<input id=${control.id} type="checkbox" onchange=${control.onchange} checked />`
        : html`<input id=${control.id} type="checkbox" onchange=${control.onchange} />`}
      <span class="checkmark"></span>
    </label>
  `;
}
