import { h } from 'preact';
import { html } from '../../html.mjs';
import {
  importDataSources,
  importLanguages,
} from '../../data/creator/import-options.mjs';
import { OptionList } from './CreatorControls.mjs';

const pasteCardActions = [
  { description: 'Paste full text', label: 'Paste card' },
  { description: '粘贴全部文本', label: '粘贴卡牌' },
];

export function RealCardImportSection() {
  return html`
    <div class="readable-background margin-bottom padding">
      <h5 class="padding margin-bottom input-description">通过名称导入一张真实卡牌</h5>
      <input
        id="import-name"
        class="input margin-bottom"
        type="text"
        onchange="importChanged();"
        placeholder="Enter Card Name"
      />
      <label class="checkbox-container input margin-bottom">
        包括所有版本
        <input id="importAllPrints" type="checkbox" onchange="importChanged();" />
        <span class="checkmark"></span>
      </label>
      <h5 class="padding input-description">选择一张卡牌导入的数据源</h5>
      <select class="input" id="datasource" onchange="importChanged()">
        ${importDataSources.map((source) => h('option', {
          value: source.value,
          ...(source.selected ? { selected: true } : {}),
        }, source.label))}
      </select>
      <h5 class="padding margin-bottom input-description">选择一张特定的卡牌导入</h5>
      <select
        class="input margin-bottom"
        id="import-index"
        onchange="changeCardIndex();"
        aria-label="Select specific card to import"
      ></select>
      <h5 class="padding input-description">选择一张卡牌导入的语言（并非所有语言都始终可用）</h5>
      <select class="input" id="import-language" onchange="importChanged();" aria-label="Select language for card imports">
        <${OptionList} options=${importLanguages} />
      </select>
    </div>
  `;
}

export function PasteCardSections() {
  return html`
    ${pasteCardActions.map((action) => html`
      <div class="readable-background margin-bottom padding">
        <h5 class="padding margin-bottom input-description">${action.description}</h5>
        <button class="input margin-bottom" onclick="pasteCardText();">${action.label}</button>
      </div>
    `)}
  `;
}

export function SavedCardLibrarySection() {
  return html`
    <div class="readable-background margin-bottom padding">
      <h5 class="padding margin-bottom input-description">保存当前卡牌</h5>
      <button class="input margin-bottom" onclick="saveCard();">保存卡牌</button>
      <h5 class="padding margin-bottom input-description">加载保存的卡牌</h5>
      <select
        id="load-card-options"
        class="input margin-bottom"
        type="text"
        onchange="loadCard(this.value);"
        aria-label="Load a saved card"
      ></select>
      <h5 class="padding margin-bottom input-description">删除选中的卡牌</h5>
      <button class="input" onclick="deleteCard();">删除卡牌</button>
    </div>
  `;
}

export function SavedCardTransferSection() {
  return html`
    <div class="readable-background padding margin-bottom">
      <h5 class="padding margin-bottom input-description">下载所有保存的卡牌</h5>
      <button class="input margin-bottom" onclick="downloadSavedCards();">下载所有</button>
      <h5 class="padding margin-bottom input-description">上传之前下载的保存卡牌文件（从上面下载）</h5>
      <input
        type="file"
        accept=".cardconjurer,.txt"
        class="input margin-bottom"
        oninput="uploadSavedCards(event);"
      />
      <h5 class="padding margin-bottom input-description">删除所有保存的卡牌</h5>
      <button class="input margin-bottom" onclick="deleteSavedCards();">删除所有</button>
    </div>
  `;
}

export function SavedCardStorageInfoSection() {
  return html`
    <div class="readable-background padding margin-bottom">
      <h5 class="collapsible collapsed padding input-description" onclick="toggleCollapse(event);">
        我的卡牌是如何保存的？
      </h5>
      <div class="padding">
        <h5 class="margin-top">卡片保存在您的计算机上，位于浏览器本地存储中，通常限制为5MB，无法更改。</h5>
        <h5 class="margin-top">不幸的是，这意味着如果您保存大量卡片，您可能会用完空间。</h5>
        <h5 class="margin-top">
          当您直接从计算机上传图像时，本地存储空间会特别快地用完，因为图像本身必须保存。然而，如果可能，通过URL上传图像将节省大量空间，允许您保存更多卡片。
        </h5>
        <h5 class="margin-top">
          如果您确实用完了空间，不用担心！您可以下载所有保存的卡片，然后删除所有保存的卡片，释放所有5MB的空间。当您想编辑之前下载/删除的卡片时，可以通过文件上传重新上传它们（在“上传之前下载的卡片”下）。
        </h5>
      </div>
    </div>
  `;
}
