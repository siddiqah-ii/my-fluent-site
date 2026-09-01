import type { MouseEvent, ReactNode } from 'react';
import { Body1Strong, Link, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  header: {
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  headerInner: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalL,
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalXXL}`,
    width: '100%',
    boxSizing: 'border-box',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  nav: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: tokens.spacingHorizontalL,
  },
});

const isModifiedClick = (event: MouseEvent<HTMLAnchorElement>) =>
  event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;

type AppLinkProps = {
  href: string;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
  onNavigate: (path: string) => void;
};

export const AppLink = (props: AppLinkProps) => {
  const { href, className, ariaLabel, children, onNavigate } = props;

  return (
    <Link
      href={href}
      className={className}
      aria-label={ariaLabel}
      onClick={event => {
        if (isModifiedClick(event)) {
          return;
        }

        event.preventDefault();
        onNavigate(href);
      }}
    >
      {children}
    </Link>
  );
};

type PageHeaderProps = {
  currentPath: string;
  maxWidth?: string;
  onNavigate: (path: string) => void;
};

export const PageHeader = (props: PageHeaderProps) => {
  const { currentPath, maxWidth = '960px', onNavigate } = props;
  const styles = useStyles();

  return (
    <header className={styles.header}>
      <div className={styles.headerInner} style={{ maxWidth }}>
        <nav className={styles.nav} aria-label="App">
          {currentPath === '/' ? (
            <Body1Strong aria-current="page">Home</Body1Strong>
          ) : (
            <AppLink href="/" onNavigate={onNavigate}>
              Home
            </AppLink>
          )}
          {currentPath === '/referral' ? (
            <Body1Strong aria-current="page">Referrals</Body1Strong>
          ) : (
            <AppLink href="/referral" onNavigate={onNavigate}>
              Referrals
            </AppLink>
          )}
          {currentPath === '/new-referral' ? (
            <Body1Strong aria-current="page">New referral</Body1Strong>
          ) : (
            <AppLink href="/new-referral" onNavigate={onNavigate}>
              New referral
            </AppLink>
          )}
        </nav>
      </div>
    </header>
  );
};
