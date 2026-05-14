import { h } from 'preact';
import { html } from '../../html.mjs';

export function CodeReferenceGrid({ className, rows }) {
  return html`
    <div class=${className}>
      ${rows.flatMap(([code, result]) => [
        h('h5', null, code),
        h('h5', null, result),
      ])}
    </div>
  `;
}

export function FrameAddButton({ button }) {
  return html`<button id=${button.id} class="input" onclick=${button.onclick}>${button.label}</button>`;
}

export function OptionList({ options }) {
  return options.map((option) => h('option', {
    ...(option.value === undefined ? {} : { value: option.value }),
    ...(option.disabled ? { disabled: true } : {}),
    ...(option.selected ? { selected: 'selected' } : {}),
  }, option.label));
}

function PositionInput({ input, oninput }) {
  return html`
    <input
      id=${input.id}
      type="number"
      class="input"
      oninput=${oninput}
      value=${input.value}
      step=${input.step}
      min=${input.min}
      max=${input.max}
      aria-label=${input.ariaLabel}
    />
  `;
}

export function WatermarkPositionInput({ input }) {
  return html`<${PositionInput} input=${input} oninput="watermarkEdited();" />`;
}

export function SetSymbolPositionInput({ input }) {
  return html`<${PositionInput} input=${input} oninput="setSymbolEdited();" />`;
}

export function ArtPositionInput({ input }) {
  return html`<${PositionInput} input=${input} oninput="artEdited();" />`;
}

export function CreatorCheckbox({ className, label, id, onchange }) {
  return html`
    <label class=${className}>
      ${label}
      <input id=${id} type="checkbox" onchange=${onchange} />
      <span class="checkmark"></span>
    </label>
  `;
}

export function CollectorInfoInput({ input }) {
  return html`
    <input
      id=${input.id}
      type=${input.type || 'text'}
      class="input"
      oninput=${input.oninput}
      placeholder=${input.placeholder}
      value=${input.value}
    />
  `;
}

export function SerialInput({ input }) {
  return html`
    <input
      id=${input.id}
      type="number"
      class="input"
      oninput="serialInfoEdited();"
      placeholder=${input.placeholder}
      min="0"
      value=${input.value}
      step=${input.step}
      aria-label=${input.ariaLabel}
    />
  `;
}
