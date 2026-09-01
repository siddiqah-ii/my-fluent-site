import type { ChangeEvent, ReactElement, ReactNode } from 'react';
import { useId, useRef, useState } from 'react';
import {
  Body1,
  Body1Strong,
  Button,
  Caption1,
  Field,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Persona,
  Tab,
  TabList,
  Textarea,
  Title1,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { AppLink, PageHeader } from './AppNav';
import { PriorityBadge, StatusBadge } from './ReferralBadges';
import {
  DEFAULT_DETAIL_ID,
  findReferral,
  formatDaysOpen,
  type DocumentItem,
  type Note,
  type Referral,
} from './referrals';

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
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
  introHeader: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalM,
  },
  meta: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  panel: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    paddingTop: tokens.spacingVerticalM,
  },
  fields: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '640px',
  },
  hint: {
    color: tokens.colorNeutralForeground3,
  },
  badgeField: {
    display: 'flex',
    width: 'fit-content',
  },
  itemList: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  itemRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalM,
    paddingBottom: tokens.spacingVerticalS,
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
  },
  itemText: {
    flex: '1 1 280px',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
  },
  fileInput: {
    display: 'none',
  },
});

const ReadOnlyField = (props: { label: string; hint?: ReactElement; children: ReactNode }) => {
  const { label, hint, children } = props;

  return (
    <Field label={label} hint={hint}>
      {children}
    </Field>
  );
};

const formatDisplayDate = (date: Date) =>
  date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

const displayValue = (value?: string) => {
  const text = value?.trim();
  return text ? text : 'Not recorded';
};

type TabValue = 'overview' | 'person' | 'risk' | 'notes' | 'documents';

type ReferralDetailPageProps = {
  referralId?: string;
  referrals: Referral[];
  onNavigate: (path: string) => void;
};

export const ReferralDetailPage = (props: ReferralDetailPageProps) => {
  const { referralId, referrals, onNavigate } = props;
  const referral = referralId
    ? findReferral(referrals, referralId)
    : findReferral(referrals, DEFAULT_DETAIL_ID);
  const styles = useStyles();
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTab, setSelectedTab] = useState<TabValue>('overview');
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState<Note[]>(referral?.notes ?? []);
  const [documents, setDocuments] = useState<DocumentItem[]>(referral?.documents ?? []);

  const addNote = () => {
    const text = noteText.trim();

    if (!text) {
      return;
    }

    setNotes(current => [{ id: `${Date.now()}`, date: formatDisplayDate(new Date()), text }, ...current]);
    setNoteText('');
  };

  const deleteNote = (id: string) => {
    setNotes(current => current.filter(note => note.id !== id));
  };

  const uploadDocument = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setDocuments(current => [
      { id: `${Date.now()}`, name: file.name, date: formatDisplayDate(new Date()) },
      ...current,
    ]);
    event.target.value = '';
  };

  const deleteDocument = (id: string) => {
    setDocuments(current => current.filter(document => document.id !== id));
  };

  if (!referral) {
    return (
      <div className={styles.page}>
        <PageHeader currentPath="/referral-detail" onNavigate={onNavigate} />
        <main className={styles.main}>
          <Title1 as="h1">Referral not found</Title1>
          <Body1 as="p">This referral is not on the list.</Body1>
          <AppLink href="/referral" onNavigate={onNavigate}>
            Back to referrals
          </AppLink>
        </main>
      </div>
    );
  }

  const showSafeguarding = referral.priority === 'Safeguarding' || Boolean(referral.safeguardingConcern);

  return (
    <div className={styles.page}>
      <PageHeader currentPath="/referral-detail" onNavigate={onNavigate} />

      <main className={styles.main}>
        <div className={styles.intro}>
          <Caption1>
            <AppLink href="/referral" onNavigate={onNavigate}>
              Referrals
            </AppLink>
            {` / ${referral.name}`}
          </Caption1>
          <div className={styles.introHeader}>
            <Title1 as="h1">{referral.name}</Title1>
            <Button appearance="primary" onClick={() => onNavigate(`/allocation?id=${referral.id}`)}>
              {referral.assignedWorker ? 'Change assigned worker' : 'Assign a worker'}
            </Button>
          </div>
          <div className={styles.meta}>
            <PriorityBadge priority={referral.priority} />
            <StatusBadge status={referral.status} />
            <Caption1>{formatDaysOpen(referral.daysOpen)} open</Caption1>
          </div>
          <Body1 as="p">{displayValue(referral.reason)}</Body1>
        </div>

        {showSafeguarding ? (
          <MessageBar intent="warning" layout="multiline">
            <MessageBarBody>
              <MessageBarTitle>Safeguarding information is on this record</MessageBarTitle>
              Open the Risk and safeguarding tab before making allocation decisions. This flags a concern about the
              person, not a judgement of them.
            </MessageBarBody>
          </MessageBar>
        ) : null}

        <TabList
          selectedValue={selectedTab}
          onTabSelect={(_event, data) => {
            setSelectedTab(data.value as TabValue);
          }}
        >
          <Tab value="overview">Overview</Tab>
          <Tab value="person">Person details</Tab>
          <Tab value="risk">Risk and safeguarding</Tab>
          <Tab value="notes">Notes and history</Tab>
          <Tab value="documents">Documents</Tab>
        </TabList>

        {selectedTab === 'overview' ? (
          <div className={styles.panel} role="tabpanel">
            <div className={styles.fields}>
              <ReadOnlyField label="Status">
                <div className={styles.badgeField}>
                  <StatusBadge status={referral.status} />
                </div>
              </ReadOnlyField>
              <ReadOnlyField label="Priority">
                <div className={styles.badgeField}>
                  <PriorityBadge priority={referral.priority} />
                </div>
              </ReadOnlyField>
              <ReadOnlyField label="Assigned worker">
                {referral.assignedWorker ? (
                  <Persona name={referral.assignedWorker} size="small" avatar={{ color: 'colorful' }} />
                ) : (
                  <Body1>Not assigned</Body1>
                )}
              </ReadOnlyField>
            </div>
          </div>
        ) : null}

        {selectedTab === 'person' ? (
          <div className={styles.panel} role="tabpanel">
            <div className={styles.fields}>
              <ReadOnlyField label="Full name">
                <Body1>{referral.name}</Body1>
              </ReadOnlyField>
              <ReadOnlyField label="Date of birth">
                <Body1>{displayValue(referral.dateOfBirth)}</Body1>
              </ReadOnlyField>
              <ReadOnlyField
                label="NHS number"
                hint={<Caption1 className={styles.hint}>Used to match the person to their health record.</Caption1>}
              >
                <Body1>{displayValue(referral.nhsNumber)}</Body1>
              </ReadOnlyField>
              <ReadOnlyField label="Address">
                <Body1>{displayValue(referral.address)}</Body1>
              </ReadOnlyField>
            </div>
          </div>
        ) : null}

        {selectedTab === 'risk' ? (
          <div className={styles.panel} role="tabpanel">
            <div className={styles.fields}>
              <ReadOnlyField
                label="Safeguarding concern"
                hint={
                  <Caption1 className={styles.hint}>
                    This records the concern so the allocated worker can protect the person. It is not a label about
                    them.
                  </Caption1>
                }
              >
                <Body1>{displayValue(referral.safeguardingConcern)}</Body1>
              </ReadOnlyField>
              <ReadOnlyField label="Immediate risk">
                <Body1>{displayValue(referral.immediateRisk)}</Body1>
              </ReadOnlyField>
            </div>
          </div>
        ) : null}

        {selectedTab === 'notes' ? (
          <div className={styles.panel} role="tabpanel">
            <div className={styles.fields}>
              <Field label="Add a note">
                <Textarea
                  placeholder="Write what happened and when"
                  value={noteText}
                  onChange={(_event, data) => {
                    setNoteText(data.value);
                  }}
                />
              </Field>
              <Button appearance="primary" onClick={addNote} disabled={noteText.trim() === ''}>
                Add a note
              </Button>
              {notes.length === 0 ? (
                <Body1 as="p">There are no notes on this record yet.</Body1>
              ) : (
                <ul className={styles.itemList}>
                  {notes.map(note => (
                    <li key={note.id} className={styles.itemRow}>
                      <div className={styles.itemText}>
                        <Caption1>{note.date}</Caption1>
                        <Body1>{note.text}</Body1>
                      </div>
                      <Button appearance="subtle" onClick={() => deleteNote(note.id)}>
                        Delete
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : null}

        {selectedTab === 'documents' ? (
          <div className={styles.panel} role="tabpanel">
            <div className={styles.fields}>
              <input
                id={fileInputId}
                ref={fileInputRef}
                className={styles.fileInput}
                type="file"
                onChange={uploadDocument}
              />
              <Button appearance="primary" onClick={() => fileInputRef.current?.click()}>
                Upload a document
              </Button>
              {documents.length === 0 ? (
                <Body1 as="p">There are no documents on this record yet.</Body1>
              ) : (
                <ul className={styles.itemList}>
                  {documents.map(document => (
                    <li key={document.id} className={styles.itemRow}>
                      <div className={styles.itemText}>
                        <Body1Strong>{document.name}</Body1Strong>
                        <Caption1>Uploaded {document.date}</Caption1>
                      </div>
                      <Button appearance="subtle" onClick={() => deleteDocument(document.id)}>
                        Delete
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
};
