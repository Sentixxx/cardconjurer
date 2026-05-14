import { html } from '../html.mjs';
import { CreatorArtPanel } from './creator/CreatorArtPanel.mjs';
import { CreatorBottomInfoPanel } from './creator/CreatorBottomInfoPanel.mjs';
import { CreatorEditorPopups } from './creator/CreatorEditorPopups.mjs';
import { CreatorFramePanel } from './creator/CreatorFramePanel.mjs';
import { CreatorImportPanel } from './creator/CreatorImportPanel.mjs';
import { CreatorMenu } from './creator/CreatorMenu.mjs';
import { CreatorSetSymbolPanel } from './creator/CreatorSetSymbolPanel.mjs';
import { CreatorTextPanel } from './creator/CreatorTextPanel.mjs';
import { CreatorTutorialPanel } from './creator/CreatorTutorialPanel.mjs';
import { CreatorWatermarkPanel } from './creator/CreatorWatermarkPanel.mjs';

const creatorPanels = [
  { id: 'creator-menu-frame', component: CreatorFramePanel },
  { id: 'creator-menu-text', component: CreatorTextPanel, hidden: true },
  { id: 'creator-menu-art', component: CreatorArtPanel, hidden: true },
  { id: 'creator-menu-setSymbol', component: CreatorSetSymbolPanel, hidden: true },
  { id: 'creator-menu-watermark', component: CreatorWatermarkPanel, hidden: true },
  { id: 'creator-menu-bottomInfo', component: CreatorBottomInfoPanel, hidden: true },
  { id: 'creator-menu-import', component: CreatorImportPanel, hidden: true },
  { id: 'creator-menu-tutorial', component: CreatorTutorialPanel, hidden: true },
];

function CreatorGrid() {
  return html`
    <div class="creator-grid margin-bottom-large">
      <canvas class="creator-canvas box-shadow" id="previewCanvas" width="1005" height="1407"></canvas>
      <${CreatorMenu} panels=${creatorPanels} />
    </div>
  `;
}

export function CreatorPage() {
  return html`
    <div class="main-content">
      <${CreatorEditorPopups} />
      <${CreatorGrid} />
    </div>
    <script defer src="/js/creator-23.js"></script>
    <script defer src="/js/frameSearch.js"></script>
  `;
}
