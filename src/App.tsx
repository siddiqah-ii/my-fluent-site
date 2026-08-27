import { useEffect, useState } from 'react';
import { FluentProvider, makeStyles, tokens } from '@fluentui/react-components';
import { AllocationPage } from './AllocationPage';
import { DesignBriefPage } from './DesignBriefPage';
import { HomePage } from './HomePage';
import { FluentUIPage } from './LandingPage';
import { NewReferralFormPage } from './NewReferralFormPage';
import { ReferralDetailPage } from './ReferralDetailPage';
import { ReferralPage } from './ReferralPage';
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

const App = () => {
  const styles = useStyles();
  const [themeName, setThemeName] = useState<ThemeName>('webLight');
  const [dir, setDir] = useState<Direction>('ltr');
  const [path, setPath] = useState<AppPath>(() => normalizePath(window.location.pathname));

  useEffect(() => {
    const onPopState = () => {
      setPath(normalizePath(window.location.pathname));
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const onNavigate = (nextPath: string) => {
    const normalized = normalizePath(nextPath);

    if (normalized !== window.location.pathname) {
      window.history.pushState({}, '', normalized);
    }

    setPath(normalized);
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
        <ReferralPage onNavigate={onNavigate} />
      ) : path === '/referral-detail' ? (
        <ReferralDetailPage onNavigate={onNavigate} />
      ) : path === '/new-referral' ? (
        <NewReferralFormPage onNavigate={onNavigate} />
      ) : path === '/allocation' ? (
        <AllocationPage onNavigate={onNavigate} />
      ) : (
        <HomePage onNavigate={onNavigate} />
      )}
      </div>
    </FluentProvider>
  );
};

export default App;
