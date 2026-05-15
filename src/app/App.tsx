import type { JSX } from 'react';
import { AppShell } from '@/components/AppShell';
import { ROUTES, Route, Router, Switch } from '@/lib/router';
import { AboutPage } from '@/pages/AboutPage';
import { AskUrzaAbilityListPage } from '@/pages/AskUrzaAbilityListPage';
import { AskUrzaPage } from '@/pages/AskUrzaPage';
import { ConverterPage } from '@/pages/ConverterPage';
import { CreatorPage } from '@/pages/CreatorPage';
import { FixturePage } from '@/pages/FixturePage';
import { GalleryPage } from '@/pages/GalleryPage';
import { LandingPage } from '@/pages/LandingPage';
import { LegalPage } from '@/pages/LegalPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { PhyrexianPage } from '@/pages/PhyrexianPage';
import { PrintPage } from '@/pages/PrintPage';
import { ThemePage } from '@/pages/ThemePage';
import { TutorialPage } from '@/pages/TutorialPage';

export function App(): JSX.Element {
  return (
    <Router>
      <AppShell>
        <Switch>
          <Route path={ROUTES.home.path} component={LandingPage} />
          <Route path={ROUTES.about.path} component={AboutPage} />
          <Route path={ROUTES.legal.path} component={LegalPage} />
          <Route path={ROUTES.tutorial.path} component={TutorialPage} />
          <Route path={ROUTES.theme.path} component={ThemePage} />
          <Route path={ROUTES.phyrexian.path} component={PhyrexianPage} />
          <Route path={ROUTES.converter.path} component={ConverterPage} />
          <Route path={ROUTES.gallery.path} component={GalleryPage} />
          <Route path={ROUTES.print.path} component={PrintPage} />
          <Route path={ROUTES.creator.path} component={CreatorPage} />
          <Route path={ROUTES.fixture.path} component={FixturePage} />
          <Route path={ROUTES.askUrza.path} component={AskUrzaPage} />
          <Route path={ROUTES.askUrzaAbilityList.path} component={AskUrzaAbilityListPage} />
          <Route path={ROUTES.askUrzaAbilityListLegacy.path} component={AskUrzaAbilityListPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </AppShell>
    </Router>
  );
}
