import { AboutPage } from './pages/AboutPage.mjs';
import {
  AskUrzaAbilityListGeneratorDownloadPage,
  AskUrzaAbilityListGeneratorWindowOpenPage,
} from './pages/AskUrzaAbilityListGeneratorPage.mjs';
import { AskUrzaPage } from './pages/AskUrzaPage.mjs';
import { ConverterPage } from './pages/ConverterPage.mjs';
import { CreatorPage } from './pages/CreatorPage.mjs';
import { GalleryPage } from './pages/GalleryPage.mjs';
import { renderGlobalFooterPartial, renderGlobalHeaderPartial } from './pages/GlobalHtmlPartials.mjs';
import { LandingPage } from './pages/LandingPage.mjs';
import { LegalPage } from './pages/LegalPage.mjs';
import { NotFoundPage } from './pages/NotFoundPage.mjs';
import { PhyrexianPage } from './pages/PhyrexianPage.mjs';
import { PrintPage } from './pages/PrintPage.mjs';
import { ThemePage } from './pages/ThemePage.mjs';
import { TutorialPage } from './pages/TutorialPage.mjs';

export const frameworkRoutes = [
  {
    outputPath: 'about/index.html',
    publicPath: '/about',
    component: AboutPage,
    baseline: 'html-equivalent',
    htmlMode: 'fragment',
  },
  {
    outputPath: 'askurza/askUrzaAbilityListGenerator.html',
    publicPath: '/askurza/askUrzaAbilityListGenerator.html',
    component: AskUrzaAbilityListGeneratorDownloadPage,
    baseline: 'html-equivalent',
    htmlMode: 'document',
  },
  {
    outputPath: 'askurza/index.html',
    publicPath: '/askurza',
    component: AskUrzaPage,
    baseline: 'html-equivalent',
    htmlMode: 'fragment',
  },
  {
    outputPath: 'converter/index.html',
    publicPath: '/converter',
    component: ConverterPage,
    baseline: 'html-equivalent',
    htmlMode: 'fragment',
  },
  {
    outputPath: 'creator/index.html',
    publicPath: '/creator',
    component: CreatorPage,
    baseline: 'performance-override',
    htmlMode: 'fragment',
  },
  {
    outputPath: 'core/404.html',
    publicPath: '/core/404.html',
    component: NotFoundPage,
    baseline: 'html-equivalent',
    htmlMode: 'fragment',
  },
  {
    outputPath: 'data/site/other/askUrza/askUrzaAbilityListGenerator.html',
    publicPath: '/data/site/other/askUrza/askUrzaAbilityListGenerator.html',
    component: AskUrzaAbilityListGeneratorWindowOpenPage,
    baseline: 'html-equivalent',
    htmlMode: 'document',
  },
  {
    outputPath: 'gallery/index.html',
    publicPath: '/gallery',
    component: GalleryPage,
    baseline: 'gallery-dom-equivalent',
    htmlMode: 'fragment',
  },
  {
    outputPath: 'globalHTML/footer.html',
    publicPath: '/globalHTML/footer.html',
    render: renderGlobalFooterPartial,
    baseline: 'html-equivalent',
    htmlMode: 'fragment',
  },
  {
    outputPath: 'globalHTML/header.html',
    publicPath: '/globalHTML/header.html',
    render: renderGlobalHeaderPartial,
    baseline: 'html-equivalent',
    htmlMode: 'fragment',
  },
  {
    outputPath: 'index.html',
    publicPath: '/',
    component: LandingPage,
    baseline: 'performance-override',
    htmlMode: 'document',
  },
  {
    outputPath: 'legal/index.html',
    publicPath: '/legal',
    component: LegalPage,
    baseline: 'html-equivalent',
    htmlMode: 'fragment',
  },
  {
    outputPath: 'phyrexian/index.html',
    publicPath: '/phyrexian',
    component: PhyrexianPage,
    baseline: 'html-equivalent',
    htmlMode: 'fragment',
  },
  {
    outputPath: 'print/index.html',
    publicPath: '/print',
    component: PrintPage,
    baseline: 'html-equivalent',
    htmlMode: 'fragment',
  },
  {
    outputPath: 'theme/index.html',
    publicPath: '/theme',
    component: ThemePage,
    baseline: 'html-equivalent',
    htmlMode: 'fragment',
  },
  {
    outputPath: 'tutorial/index.html',
    publicPath: '/tutorial',
    component: TutorialPage,
    baseline: 'html-equivalent',
    htmlMode: 'fragment',
  },
];
