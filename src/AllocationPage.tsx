import { useState } from 'react';
import {
  Body1,
  Body1Strong,
  Button,
  Caption1,
  Combobox,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerHeaderTitle,
  Field,
  Link,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Option,
  OverlayDrawer,
  Persona,
  Title1,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { DismissRegular } from '@fluentui/react-icons';
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
  fields: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '640px',
  },
  drawerFields: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  workerPreview: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
});

type Worker = {
  name: string;
  caseload: number;
  capacity: number;
};

const workers: Worker[] = [
  { name: 'Claire Byrne', caseload: 4, capacity: 10 },
  { name: 'James Osei', caseload: 9, capacity: 10 },
  { name: 'Priya Shah', caseload: 10, capacity: 10 },
  { name: 'Sarah Kapoor', caseload: 8, capacity: 10 },
];

const caseloadLabel = (worker: Worker) => `${worker.caseload} of ${worker.capacity} open cases`;

const capacityLevel = (worker: Worker) => {
  if (worker.caseload >= worker.capacity) {
    return 'at-capacity' as const;
  }

  if (worker.caseload / worker.capacity >= 0.8) {
    return 'near-capacity' as const;
  }

  return 'ok' as const;
};

const capacityWarning = (worker: Worker) => {
  const level = capacityLevel(worker);

  if (level === 'at-capacity') {
    return `${worker.name} is at capacity, with ${caseloadLabel(worker)}. Assigning another referral is likely to delay assessment.`;
  }

  if (level === 'near-capacity') {
    return `${worker.name} is near capacity, with ${caseloadLabel(worker)}. Assigning another referral may delay assessment.`;
  }

  return null;
};

type AllocationPageProps = {
  onNavigate: (path: string) => void;
};

export const AllocationPage = (props: AllocationPageProps) => {
  const { onNavigate } = props;
  const styles = useStyles();
  const [open, setOpen] = useState(false);
  const [draftWorker, setDraftWorker] = useState<string | undefined>();
  const [assignedWorker, setAssignedWorker] = useState<string | undefined>();
  const [workerError, setWorkerError] = useState<string | undefined>();

  const selectedWorker = workers.find(worker => worker.name === draftWorker);
  const assigned = workers.find(worker => worker.name === assignedWorker);
  const warning = selectedWorker ? capacityWarning(selectedWorker) : null;

  const closeDrawer = () => {
    setOpen(false);
    setWorkerError(undefined);
    setDraftWorker(assignedWorker);
  };

  const assign = () => {
    if (!draftWorker) {
      setWorkerError('Select a worker to assign this referral.');
      return;
    }

    setAssignedWorker(draftWorker);
    setOpen(false);
    setWorkerError(undefined);
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
          <Title1 as="h1">Assign a worker</Title1>
          <div className={styles.meta}>
            <PriorityBadge priority="Safeguarding" />
            <StatusBadge status="New" />
            <Caption1>1 day open</Caption1>
          </div>
          <Body1 as="p">
            Thomas Brennan needs a worker allocated before assessment can start. Open the assignment panel to search the
            team and see current caseloads.
          </Body1>
        </div>

        <MessageBar intent="warning" layout="multiline">
          <MessageBarBody>
            <MessageBarTitle>Safeguarding information is on this record</MessageBarTitle>
            Open the Risk and safeguarding tab before making allocation decisions. This flags a concern about the
            person, not a judgement of them.
          </MessageBarBody>
        </MessageBar>

        <div className={styles.fields}>
          <Field label="Person">
            <Body1Strong>Thomas Brennan</Body1Strong>
          </Field>
          <Field label="Assigned worker">
            {assigned ? (
              <Persona
                name={assigned.name}
                size="small"
                secondaryText={caseloadLabel(assigned)}
                avatar={{ color: 'colorful' }}
              />
            ) : (
              <Body1>Not assigned</Body1>
            )}
          </Field>
          <Button appearance="primary" onClick={() => setOpen(true)}>
            {assigned ? 'Change assigned worker' : 'Assign a worker'}
          </Button>
        </div>
      </main>

      <OverlayDrawer
        open={open}
        position="end"
        size="medium"
        onOpenChange={(_event, data) => {
          if (!data.open) {
            closeDrawer();
          }
        }}
      >
        <DrawerHeader>
          <DrawerHeaderTitle
            action={
              <Button appearance="subtle" aria-label="Close" icon={<DismissRegular />} onClick={closeDrawer} />
            }
          >
            Assign a worker
          </DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody>
          <div className={styles.drawerFields}>
            <Body1 as="p">Search the team. Caseload counts are shown so you can avoid workers who are near capacity.</Body1>
            <Field
              label="Worker"
              required
              validationState={workerError ? 'error' : 'none'}
              validationMessage={workerError}
            >
              <Combobox
                placeholder="Search by name"
                selectedOptions={draftWorker ? [draftWorker] : []}
                onOptionSelect={(_event, data) => {
                  setDraftWorker(data.optionValue);
                  setWorkerError(undefined);
                }}
              >
                {workers.map(worker => (
                  <Option key={worker.name} value={worker.name} text={worker.name}>
                    {`${worker.name} · ${caseloadLabel(worker)}`}
                  </Option>
                ))}
              </Combobox>
            </Field>
            {selectedWorker ? (
              <div className={styles.workerPreview}>
                <Persona
                  name={selectedWorker.name}
                  size="large"
                  secondaryText={caseloadLabel(selectedWorker)}
                  avatar={{ color: 'colorful' }}
                />
              </div>
            ) : null}
            {selectedWorker && warning ? (
              <MessageBar intent="warning" layout="multiline">
                <MessageBarBody>
                  <MessageBarTitle>
                    {capacityLevel(selectedWorker) === 'at-capacity'
                      ? 'Worker is at capacity'
                      : 'Worker is near capacity'}
                  </MessageBarTitle>
                  {warning}
                </MessageBarBody>
              </MessageBar>
            ) : null}
          </div>
        </DrawerBody>
        <DrawerFooter>
          <Button appearance="primary" onClick={assign}>
            Assign
          </Button>
          <Button appearance="secondary" onClick={closeDrawer}>
            Cancel
          </Button>
        </DrawerFooter>
      </OverlayDrawer>
    </div>
  );
};
