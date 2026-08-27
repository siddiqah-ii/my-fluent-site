import type { ChangeEvent, ReactElement, ReactNode } from 'react';
import { useId, useRef, useState } from 'react';
import {
  Body1,
  Body1Strong,
  Button,
  Caption1,
  Field,
  Link,
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
import { PriorityBadge, StatusBadge } from './ReferralBadges';

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

type TabValue = 'overview' | 'person' | 'risk' | 'notes' | 'documents';

type Note = {
  id: string;
  date: string;
  text: string;
};

type DocumentItem = {
  id: string;
  name: string;
  date: string;
};

const initialNotes: Note[] = [
  {
    id: '1',
    date: '12 March 2026',
    text: 'NHS discharge liaison opened this referral after a hospital stay.',
  },
  {
    id: '2',
    date: '13 March 2026',
    text: 'Duty team flagged a safeguarding concern from a neighbour.',
  },
];

const initialDocuments: DocumentItem[] = [
  { id: '1', name: 'Hospital discharge summary.pdf', date: '12 March 2026' },
  { id: '2', name: 'Safeguarding notification.docx', date: '13 March 2026' },
];

type ReferralDetailPageProps = {
  onNavigate: (path: string) => void;
};

export const ReferralDetailPage = (props: ReferralDetailPageProps) => {
  const { onNavigate } = props;
  const styles = useStyles();
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTab, setSelectedTab] = useState<TabValue>('overview');
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);

  const addNote = () => {
    const text = noteText.trim();

    if (!text) {
      return;
    }

    setNotes(current => [
      { id: `${Date.now()}`, date: formatDisplayDate(new Date()), text },
      ...current,
    ]);
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
          <Title1 as="h1">Helen Cartwright</Title1>
          <div className={styles.meta}>
            <PriorityBadge priority="Safeguarding" />
            <StatusBadge status="Assessing" />
            <Caption1>2 days open</Caption1>
          </div>
          <Body1 as="p">Referral for adult social care support. Opened by NHS discharge liaison.</Body1>
        </div>

        <MessageBar intent="warning" layout="multiline">
          <MessageBarBody>
            <MessageBarTitle>Safeguarding information is on this record</MessageBarTitle>
            Open the Risk and safeguarding tab before making allocation decisions. This flags a concern about the
            person, not a judgement of them.
          </MessageBarBody>
        </MessageBar>

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
                  <StatusBadge status="Assessing" />
                </div>
              </ReadOnlyField>
              <ReadOnlyField label="Priority">
                <div className={styles.badgeField}>
                  <PriorityBadge priority="Safeguarding" />
                </div>
              </ReadOnlyField>
              <ReadOnlyField label="Assigned worker">
                <Persona name="James Osei" size="small" avatar={{ color: 'colorful' }} />
              </ReadOnlyField>
            </div>
          </div>
        ) : null}

        {selectedTab === 'person' ? (
          <div className={styles.panel} role="tabpanel">
            <div className={styles.fields}>
              <ReadOnlyField label="Full name">
                <Body1>Helen Cartwright</Body1>
              </ReadOnlyField>
              <ReadOnlyField label="Date of birth">
                <Body1>12 March 1948</Body1>
              </ReadOnlyField>
              <ReadOnlyField
                label="NHS number"
                hint={<Caption1 className={styles.hint}>Used to match the person to their health record.</Caption1>}
              >
                <Body1>943 476 5919</Body1>
              </ReadOnlyField>
              <ReadOnlyField label="Address">
                <Body1>14 Hartwell Close, Leeds, LS6 2PN</Body1>
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
                <Body1>
                  Neighbour reported that Helen has been left without food or heating for several days. Possible neglect
                  by an informal carer.
                </Body1>
              </ReadOnlyField>
              <ReadOnlyField label="Immediate risk">
                <Body1>Yes</Body1>
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
