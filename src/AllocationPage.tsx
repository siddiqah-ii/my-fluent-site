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
import { AppLink, PageHeader } from './AppNav';
import { PriorityBadge, StatusBadge } from './ReferralBadges';
import {
  DEFAULT_ALLOCATION_ID,
  caseloadFor,
  findReferral,
  formatDaysOpen,
  workers,
  type Referral,
  type Worker,
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
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalM,
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

const caseloadLabel = (worker: Worker, referrals: Referral[]) =>
  `${caseloadFor(worker, referrals)} of ${worker.capacity} open cases`;

const capacityLevel = (worker: Worker, referrals: Referral[]) => {
  const caseload = caseloadFor(worker, referrals);

  if (caseload >= worker.capacity) {
    return 'at-capacity' as const;
  }

  if (caseload / worker.capacity >= 0.8) {
    return 'near-capacity' as const;
  }

  return 'ok' as const;
};

const capacityWarning = (worker: Worker, referrals: Referral[]) => {
  const level = capacityLevel(worker, referrals);

  if (level === 'at-capacity') {
    return `${worker.name} is at capacity, with ${caseloadLabel(worker, referrals)}. You cannot assign another referral to this worker.`;
  }

  if (level === 'near-capacity') {
    return `${worker.name} is near capacity, with ${caseloadLabel(worker, referrals)}. Assigning another referral may delay assessment.`;
  }

  return null;
};

type AllocationPageProps = {
  referralId?: string;
  referrals: Referral[];
  onAssign: (referralId: string, workerName: string) => void;
  onNavigate: (path: string) => void;
};

export const AllocationPage = (props: AllocationPageProps) => {
  const { referralId, referrals, onAssign, onNavigate } = props;
  const referral = referralId
    ? findReferral(referrals, referralId)
    : findReferral(referrals, DEFAULT_ALLOCATION_ID);
  const styles = useStyles();
  const [open, setOpen] = useState(false);
  const [draftWorker, setDraftWorker] = useState<string | undefined>(referral?.assignedWorker ?? undefined);
  const [workerError, setWorkerError] = useState<string | undefined>();

  const selectedWorker = workers.find(worker => worker.name === draftWorker);
  const assigned = workers.find(worker => worker.name === referral?.assignedWorker);
  const warning = selectedWorker ? capacityWarning(selectedWorker, referrals) : null;
  const atCapacity = selectedWorker ? capacityLevel(selectedWorker, referrals) === 'at-capacity' : false;
  const cannotAssign =
    Boolean(selectedWorker) && atCapacity && selectedWorker?.name !== referral?.assignedWorker;

  const closeDrawer = () => {
    setOpen(false);
    setWorkerError(undefined);
    setDraftWorker(referral?.assignedWorker ?? undefined);
  };

  const assign = () => {
    if (!referral) {
      return;
    }

    if (!draftWorker) {
      setWorkerError('Select a worker to assign this referral.');
      return;
    }

    const worker = workers.find(item => item.name === draftWorker);

    if (worker && capacityLevel(worker, referrals) === 'at-capacity' && worker.name !== referral.assignedWorker) {
      setWorkerError('This worker is at capacity. Choose someone with space on their caseload.');
      return;
    }

    onAssign(referral.id, draftWorker);
    setOpen(false);
    setWorkerError(undefined);
  };

  if (!referral) {
    return (
      <div className={styles.page}>
        <PageHeader currentPath="/allocation" onNavigate={onNavigate} />
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
      <PageHeader currentPath="/allocation" onNavigate={onNavigate} />

      <main className={styles.main}>
        <div className={styles.intro}>
          <Caption1>
            <AppLink href="/referral" onNavigate={onNavigate}>
              Referrals
            </AppLink>
            {' / '}
            <AppLink href={`/referral-detail?id=${referral.id}`} onNavigate={onNavigate}>
              {referral.name}
            </AppLink>
            {' / Assign a worker'}
          </Caption1>
          <Title1 as="h1">Assign a worker</Title1>
          <div className={styles.meta}>
            <PriorityBadge priority={referral.priority} />
            <StatusBadge status={referral.status} />
            <Caption1>{formatDaysOpen(referral.daysOpen)} open</Caption1>
          </div>
          <Body1 as="p">
            {referral.assignedWorker
              ? `${referral.name} is assigned to ${referral.assignedWorker}. You can change the worker if the caseload needs to move.`
              : `${referral.name} needs a worker allocated before assessment can start. Open the assignment panel to search the team and see current caseloads.`}
          </Body1>
        </div>

        {showSafeguarding ? (
          <MessageBar intent="warning" layout="multiline">
            <MessageBarBody>
              <MessageBarTitle>Safeguarding information is on this record</MessageBarTitle>
              Open the Risk and safeguarding tab on the referral record before making allocation decisions. This flags a
              concern about the person, not a judgement of them.
            </MessageBarBody>
          </MessageBar>
        ) : null}

        <div className={styles.fields}>
          <Field label="Person">
            <Body1Strong>{referral.name}</Body1Strong>
          </Field>
          <Field label="Assigned worker">
            {assigned ? (
              <Persona
                name={assigned.name}
                size="small"
                secondaryText={caseloadLabel(assigned, referrals)}
                avatar={{ color: 'colorful' }}
              />
            ) : (
              <Body1>Not assigned</Body1>
            )}
          </Field>
          <div className={styles.actions}>
            <Button appearance="primary" onClick={() => setOpen(true)}>
              {referral.assignedWorker ? 'Change assigned worker' : 'Assign a worker'}
            </Button>
            <Button appearance="secondary" onClick={() => onNavigate(`/referral-detail?id=${referral.id}`)}>
              Back to referral
            </Button>
          </div>
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
                    {`${worker.name} · ${caseloadLabel(worker, referrals)}`}
                  </Option>
                ))}
              </Combobox>
            </Field>
            {selectedWorker ? (
              <div className={styles.workerPreview}>
                <Persona
                  name={selectedWorker.name}
                  size="large"
                  secondaryText={caseloadLabel(selectedWorker, referrals)}
                  avatar={{ color: 'colorful' }}
                />
              </div>
            ) : null}
            {selectedWorker && warning ? (
              <MessageBar intent="warning" layout="multiline">
                <MessageBarBody>
                  <MessageBarTitle>
                    {capacityLevel(selectedWorker, referrals) === 'at-capacity'
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
          <Button
            appearance="primary"
            onClick={assign}
            disabled={cannotAssign}
            title={cannotAssign ? 'This worker is at capacity' : undefined}
          >
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
