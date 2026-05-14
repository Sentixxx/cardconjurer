import { html } from '../../html.mjs';

const imageAccept = '.png, .svg, .jpg, .jpeg, .bmp, .webp';

export function ImageDropInput({
  className = 'padding drop-area',
  label = '拖放',
  oninput,
  dropFunction,
  otherParams = '',
}) {
  return html`
    <div class=${className}>
      <h5 class="margin-bottom padding input-description">${label}</h5>
      <input
        type="file"
        multiple
        accept=${imageAccept}
        placeholder="File Upload"
        class="input"
        oninput=${oninput}
        data-dropFunction=${dropFunction}
        data-otherParams=${otherParams}
      />
    </div>
  `;
}

export function ImageUrlInput({ onchange, className = 'input', placeholder = 'Via URL' }) {
  return html`
    <input
      type="url"
      placeholder=${placeholder}
      class=${className}
      onchange=${onchange}
    />
  `;
}

export function ImageUploadGrid({
  className = 'input-grid margin-bottom',
  drop,
  url,
  children,
  extra,
}) {
  return html`
    <div class=${className}>
      <${ImageDropInput} ...${drop} />
      <div>
        <${ImageUrlInput} ...${url} />
        ${children}
      </div>
      ${extra}
    </div>
  `;
}
