import { Body1, Caption1, Link, Title1, Title2, Title3, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  header: {
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalXXL}`,
    maxWidth: '960px',
    width: '100%',
    boxSizing: 'border-box',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXL,
    padding: `${tokens.spacingVerticalXXL} ${tokens.spacingHorizontalXXL}`,
    maxWidth: '960px',
    width: '100%',
    boxSizing: 'border-box',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  intro: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  list: {
    margin: 0,
    paddingLeft: tokens.spacingHorizontalXXL,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
});

type DesignBriefPageProps = {
  onNavigate: (path: string) => void;
};

export const DesignBriefPage = (props: DesignBriefPageProps) => {
  const { onNavigate } = props;
  const styles = useStyles();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link
          href="/"
          onClick={event => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
              return;
            }

            event.preventDefault();
            onNavigate('/');
          }}
        >
          Home
        </Link>
      </header>

      <main className={styles.main}>
        <div className={styles.intro}>
          <Title1 as="h1">Design Brief</Title1>
          <Title2 as="h2">Adult Social Care Referral Tracker</Title2>
          <Caption1 as="p">Fluent 2 practice project · Department for Health and Social Care context</Caption1>
        </div>

        <section className={styles.section}>
          <Title3 as="h3">Context</Title3>
          <Body1 as="p">
            A practice brief modelled on the kind of service DHSC and its delivery partners commonly build — referral and
            case management for adult social care. Not tied to any live engagement specifics; a realistic domain to
            practice Fluent 2 patterns against before using them under delivery pressure.
          </Body1>
        </section>

        <section className={styles.section}>
          <Title3 as="h3">The service</Title3>
          <Body1 as="p">
            Local authority social workers and NHS discharge teams use this tool to track referrals for adult social
            care support — home care packages, safeguarding concerns, occupational therapy assessments — from initial
            referral through to allocation and closure.
          </Body1>
        </section>

        <section className={styles.section}>
          <Title3 as="h3">Primary users</Title3>
          <Body1 as="p">
            Social workers, care coordinators, NHS discharge liaison staff. Time-pressured, often multitasking across
            many open cases, frequently interrupted. Some access on shared or older devices in community settings, not
            always a modern monitor.
          </Body1>
        </section>

        <section className={styles.section}>
          <Title3 as="h3">Screens to design (in priority order)</Title3>
          <ul className={styles.list}>
            <li>
              <Body1 as="p">
                Referral list view — a filterable, sortable table of all open referrals. Needs status badges (New /
                Assessing / Allocated / Closed), priority indicator (Standard / Urgent / Safeguarding), assigned worker,
                days-open counter, search/filter bar.
              </Body1>
            </li>
            <li>
              <Body1 as="p">
                Referral detail record — tabbed layout: Overview, Person details, Risk & safeguarding, Notes/history,
                Documents. Main practice ground for TabList, Field, Dropdown, form validation.
              </Body1>
            </li>
            <li>
              <Body1 as="p">
                New referral form — multi-section intake form with required-field validation and a clear "why we're
                asking" pattern for sensitive fields (e.g. safeguarding disclosures).
              </Body1>
            </li>
            <li>
              <Body1 as="p">
                Allocation/assignment panel — a side panel or modal for assigning a referral to a worker, showing their
                current caseload count as a soft warning if near capacity.
              </Body1>
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <Title3 as="h3">Fluent 2 components to deliberately practice</Title3>
          <ul className={styles.list}>
            <li>
              <Body1 as="p">DataGrid — with custom cell rendering (badges, avatars, action icons).</Body1>
            </li>
            <li>
              <Body1 as="p">
                MessageBar — especially the warning/urgent variant for safeguarding flags, not just error states.
              </Body1>
            </li>
            <li>
              <Body1 as="p">
                Field + validation states — sensitive personal data needs visible, unambiguous required-field marking.
              </Body1>
            </li>
            <li>
              <Body1 as="p">
                Dropdown / Combobox — for things like assigned worker (searchable list) vs. fixed choice fields like
                priority.
              </Body1>
            </li>
            <li>
              <Body1 as="p">Drawer or Dialog — for the allocation panel.</Body1>
            </li>
            <li>
              <Body1 as="p">Persona — for showing assigned worker identity.</Body1>
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <Title3 as="h3">Non-negotiable constraints (DHSC-specific)</Title3>
          <ul className={styles.list}>
            <li>
              <Body1 as="p">
                WCAG 2.1 AA throughout — this is health/social care data about vulnerable adults; accessibility isn't
                optional polish, it's the baseline. Check contrast on every badge/status colour combination, not just
                body text.
              </Body1>
            </li>
            <li>
              <Body1 as="p">
                GDS content style — plain English, sentence case, no jargon in user-facing labels ("Add a note", not
                "Submit annotation"). Even though this is Fluent 2 rather than the GOV.UK Design System, GDS content
                principles still apply since it's a government service.
              </Body1>
            </li>
            <li>
              <Body1 as="p">
                Design for interruption — social workers get pulled away mid-task constantly. Forms should never lose
                entered data silently; consider autosave or clear draft-state indicators.
              </Body1>
            </li>
            <li>
              <Body1 as="p">
                Sensitive-content handling — safeguarding and risk information needs visual weight (colour, positioning)
                that signals seriousness without being alarmist or stigmatising toward the person being referred.
              </Body1>
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <Title3 as="h3">What "done" looks like</Title3>
          <Body1 as="p">
            All four screens built and navigable in your Vite app, using real @fluentui/react-components, passing a
            basic contrast check, and with at least one safeguarding-flag pattern you'd feel confident defending in a
            design crit.
          </Body1>
        </section>
      </main>
    </div>
  );
};
