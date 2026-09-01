import { useEffect, useState } from 'react';
import { FluentProvider, makeStyles, tokens } from '@fluentui/react-components';
import { AllocationPage } from './AllocationPage';
import { DesignBriefPage } from './DesignBriefPage';
import { HomePage } from './HomePage';
import { FluentUIPage } from './LandingPage';
import { NewReferralFormPage } from './NewReferralFormPage';
import { ReferralDetailPage } from './ReferralDetailPage';
import { ReferralPage } from './ReferralPage';
import { assignWorker, initialReferrals, type Referral } from './referrals';
import { themeOptions, type Direction, type ThemeName } from './themes';

const useStyles = makeStyles({
  app: {
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
  },
});

type AppPath =
  | '/'
  | '/fluent-ui'
  | '/design-brief'
  | '/referral'
  | '/referral-detail'
  | '/new-referral'
  | '/allocation';

const normalizePath = (pathname: string): AppPath => {
  const path = pathname.replace(/\/$/, '') || '/';

  if (
    path === '/fluent-ui' ||
    path === '/design-brief' ||
    path === '/referral' ||
    path === '/referral-detail' ||
    path === '/new-referral' ||
    path === '/allocation'
  ) {
    return path;
  }

  return '/';
};

const locationFromHref = (href: string) => {
  const url = new URL(href, window.location.origin);
  const path = normalizePath(url.pathname);

  return {
    path,
    search: url.search,
    href: `${path}${url.search}`,
  };
};

const referralIdFromSearch = (search: string) => new URLSearchParams(search).get('id') ?? undefined;

const App = () => {
  const styles = useStyles();
  const [themeName, setThemeName] = useState<ThemeName>('webLight');
  const [dir, setDir] = useState<Direction>('ltr');
  const [path, setPath] = useState<AppPath>(() => normalizePath(window.location.pathname));
  const [search, setSearch] = useState(() => window.location.search);
  const [referrals, setReferrals] = useState<Referral[]>(initialReferrals);

  useEffect(() => {
    const onPopState = () => {
      setPath(normalizePath(window.location.pathname));
      setSearch(window.location.search);
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const onNavigate = (nextPath: string) => {
    const next = locationFromHref(nextPath);

    if (next.href !== `${window.location.pathname}${window.location.search}`) {
      window.history.pushState({}, '', next.href);
    }

    setPath(next.path);
    setSearch(next.search);
  };

  const referralId = referralIdFromSearch(search);

  const onCreateReferral = (referral: Referral) => {
    setReferrals(current => [referral, ...current]);
  };

  const onAssignWorker = (id: string, workerName: string) => {
    setReferrals(current => assignWorker(current, id, workerName));
  };

  return (
    <FluentProvider theme={themeOptions[themeName].theme} dir={dir}>
      <div className={styles.app}>
      {path === '/fluent-ui' ? (
        <FluentUIPage
          themeName={themeName}
          dir={dir}
          onThemeChange={setThemeName}
          onDirChange={setDir}
          onNavigate={onNavigate}
        />
      ) : path === '/design-brief' ? (
        <DesignBriefPage onNavigate={onNavigate} />
      ) : path === '/referral' ? (
        <ReferralPage referrals={referrals} onNavigate={onNavigate} />
      ) : path === '/referral-detail' ? (
        <ReferralDetailPage
          key={referralId ?? 'detail'}
          referralId={referralId}
          referrals={referrals}
          onNavigate={onNavigate}
        />
      ) : path === '/new-referral' ? (
        <NewReferralFormPage onCreate={onCreateReferral} onNavigate={onNavigate} />
      ) : path === '/allocation' ? (
        <AllocationPage
          key={referralId ?? 'allocation'}
          referralId={referralId}
          referrals={referrals}
          onAssign={onAssignWorker}
          onNavigate={onNavigate}
        />
      ) : (
        <HomePage onNavigate={onNavigate} />
      )}
      </div>
    </FluentProvider>
  );
};

export default App;
