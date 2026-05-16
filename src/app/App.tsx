import type { JSX } from 'react';
import { AppShell } from '@/components/AppShell';
import { ROUTES, Route, Router, Switch } from '@/lib/router';
import { CreatorPage } from '@/pages/CreatorPage';
import { FixturePage } from '@/pages/FixturePage';
import { LegalPage } from '@/pages/LegalPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export function App(): JSX.Element {
  return (
    <Router>
      <AppShell>
        <Switch>
          <Route path={ROUTES.home.path} component={CreatorPage} />
          <Route path={ROUTES.creator.path} component={CreatorPage} />
          <Route path={ROUTES.legal.path} component={LegalPage} />
          <Route path={ROUTES.fixture.path} component={FixturePage} />
          <Route component={NotFoundPage} />
        </Switch>
      </AppShell>
    </Router>
  );
}
