import type { ReactNode } from 'react';
import {
  Body1,
  Body1Strong,
  Caption1,
  Card,
  Link,
  Title1,
  Title3,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  BookOpenRegular,
  ContactCardRegular,
  FormNewRegular,
  LayerRegular,
  OpenRegular,
  PeopleTeamRegular,
  TableRegular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXL,
    padding: `${tokens.spacingVerticalXXL} ${tokens.spacingHorizontalXXL}`,
    maxWidth: '880px',
    width: '100%',
    boxSizing: 'border-box',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    maxWidth: '560px',
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: tokens.spacingHorizontalL,
    '@media (min-width: 640px)': {
      gridTemplateColumns: '1fr 1fr',
    },
  },
  card: {
    height: '100%',
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    height: '100%',
  },
  iconWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
  },
  open: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXXS,
    marginTop: 'auto',
  },
});

type HomePageProps = {
  onNavigate: (path: string) => void;
};

type ScreenCard = {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
};

const AppLink = (props: {
  href: string;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
  onNavigate: (path: string) => void;
}) => {
  const { href, className, ariaLabel, children, onNavigate } = props;

  return (
    <Link
      href={href}
      className={className}
      aria-label={ariaLabel}
      onClick={event => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
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

const ScreenLink = (props: {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
  onNavigate: (path: string) => void;
}) => {
  const { href, title, description, icon, onNavigate } = props;
  const styles = useStyles();

  return (
    <Card className={styles.card} appearance="filled">
      <div className={styles.cardBody}>
        <div className={styles.iconWrap} aria-hidden>
          {icon}
        </div>
        <Body1Strong>{title}</Body1Strong>
        <Caption1>{description}</Caption1>
        <AppLink className={styles.open} href={href} onNavigate={onNavigate} ariaLabel={`Open ${title}`}>
          Open
          <OpenRegular />
        </AppLink>
      </div>
    </Card>
  );
};

const foundations: ScreenCard[] = [
  {
    href: '/fluent-ui',
    title: 'Fluent UI',
    description: 'Theme samples, cards, and Fluent 2 components.',
    icon: <LayerRegular />,
  },
  {
    href: '/design-brief',
    title: 'Design brief',
    description: 'Adult social care referral tracker, including users and constraints.',
    icon: <BookOpenRegular />,
  },
];

const trackerScreens: ScreenCard[] = [
  {
    href: '/referral',
    title: 'Referral page',
    description: 'Search, filter and sort open referrals by status and priority.',
    icon: <TableRegular />,
  },
  {
    href: '/referral-detail',
    title: 'Referral detail record',
    description: 'Tabbed record with overview, notes, history and documents.',
    icon: <ContactCardRegular />,
  },
  {
    href: '/new-referral',
    title: 'New referral form',
    description: 'Multi-section intake with required-field checks and why-we-ask hints.',
    icon: <FormNewRegular />,
  },
  {
    href: '/allocation',
    title: 'Allocation/assignment panel',
    description: 'Assign a worker and see a soft warning if they are near capacity.',
    icon: <PeopleTeamRegular />,
  },
];

export const HomePage = (props: HomePageProps) => {
  const { onNavigate } = props;
  const styles = useStyles();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.hero}>
          <Title1 as="h1">Fluent UI exploration</Title1>
          <Body1 as="p">
            Practice Fluent 2 against an adult social care referral tracker — from the list view through to allocation.
          </Body1>
          <Caption1 as="p">Department for Health and Social Care context</Caption1>
        </div>

        <section className={styles.group}>
          <Title3 as="h2">Foundations</Title3>
          <div className={styles.grid}>
            {foundations.map(item => (
              <ScreenLink key={item.href} {...item} onNavigate={onNavigate} />
            ))}
          </div>
        </section>

        <section className={styles.group}>
          <Title3 as="h2">Referral tracker</Title3>
          <div className={styles.grid}>
            {trackerScreens.map(item => (
              <ScreenLink key={item.href} {...item} onNavigate={onNavigate} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
