import { useMemo, useState } from 'react';
import {
  Avatar,
  Body1,
  Body1Strong,
  Button,
  Caption1,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  Dropdown,
  Field,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Option,
  Persona,
  SearchBox,
  TableCellLayout,
  Title1,
  createTableColumn,
  makeStyles,
  tokens,
  useId,
} from '@fluentui/react-components';
import type { TableColumnDefinition } from '@fluentui/react-components';
import { OpenRegular } from '@fluentui/react-icons';
import { AppLink, PageHeader } from './AppNav';
import { PriorityBadge, StatusBadge, type ReferralPriority, type ReferralStatus } from './ReferralBadges';
import { formatDaysOpen, type Referral } from './referrals';

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
    maxWidth: '1120px',
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
  toolbar: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'end',
    gap: tokens.spacingHorizontalM,
  },
  search: {
    flex: '1 1 240px',
    minWidth: '200px',
  },
  filter: {
    minWidth: '160px',
  },
  tableWrap: {
    width: '100%',
    overflowX: 'auto',
  },
  unassigned: {
    color: tokens.colorNeutralForeground3,
  },
  safeguardingRow: {
    backgroundColor: tokens.colorNeutralBackground2,
  },
  count: {
    color: tokens.colorNeutralForeground3,
  },
});

const statusOrder: Record<ReferralStatus, number> = {
  New: 0,
  Assessing: 1,
  Allocated: 2,
  Closed: 3,
};

const priorityOrder: Record<ReferralPriority, number> = {
  Safeguarding: 0,
  Urgent: 1,
  Standard: 2,
};

const statuses: ReferralStatus[] = ['New', 'Assessing', 'Allocated', 'Closed'];
const priorities: ReferralPriority[] = ['Standard', 'Urgent', 'Safeguarding'];

const workerNamesFrom = (referrals: Referral[]) =>
  [...new Set(referrals.map(referral => referral.assignedWorker).filter((name): name is string => Boolean(name)))].sort(
    (a, b) => a.localeCompare(b),
  );

const workerLabel = (worker: string | null) => worker ?? 'Not assigned';

const WorkerCell = (props: { worker: string | null; className: string }) => {
  const { worker, className } = props;

  if (!worker) {
    return (
      <TableCellLayout media={<Avatar aria-hidden color="neutral" name="" />}>
        <Body1 className={className}>Not assigned</Body1>
      </TableCellLayout>
    );
  }

  return <Persona name={worker} size="extra-small" textAlignment="center" avatar={{ color: 'colorful' }} />;
};

const columns = (
  unassignedClassName: string,
  onNavigate: (path: string) => void,
): TableColumnDefinition<Referral>[] => [
  createTableColumn<Referral>({
    columnId: 'name',
    compare: (a, b) => a.name.localeCompare(b.name),
    renderHeaderCell: () => 'Name',
    renderCell: item => (
      <AppLink href={`/referral-detail?id=${item.id}`} onNavigate={onNavigate} ariaLabel={`Open referral for ${item.name}`}>
        <Body1Strong>{item.name}</Body1Strong>
      </AppLink>
    ),
  }),
  createTableColumn<Referral>({
    columnId: 'priority',
    compare: (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
    renderHeaderCell: () => 'Priority',
    renderCell: item => <PriorityBadge priority={item.priority} />,
  }),
  createTableColumn<Referral>({
    columnId: 'status',
    compare: (a, b) => statusOrder[a.status] - statusOrder[b.status],
    renderHeaderCell: () => 'Status',
    renderCell: item => <StatusBadge status={item.status} />,
  }),
  createTableColumn<Referral>({
    columnId: 'assignedWorker',
    compare: (a, b) => workerLabel(a.assignedWorker).localeCompare(workerLabel(b.assignedWorker)),
    renderHeaderCell: () => 'Assigned worker',
    renderCell: item => <WorkerCell worker={item.assignedWorker} className={unassignedClassName} />,
  }),
  createTableColumn<Referral>({
    columnId: 'daysOpen',
    compare: (a, b) => a.daysOpen - b.daysOpen,
    renderHeaderCell: () => 'Days open',
    renderCell: item => <Body1>{formatDaysOpen(item.daysOpen)}</Body1>,
  }),
  createTableColumn<Referral>({
    columnId: 'actions',
    renderHeaderCell: () => 'Open',
    renderCell: item => (
      <Button
        appearance="transparent"
        icon={<OpenRegular />}
        aria-label={`Open referral for ${item.name}`}
        onClick={() => onNavigate(`/referral-detail?id=${item.id}`)}
      />
    ),
  }),
];

type ReferralPageProps = {
  referrals: Referral[];
  onNavigate: (path: string) => void;
};

export const ReferralPage = (props: ReferralPageProps) => {
  const { referrals, onNavigate } = props;
  const styles = useStyles();
  const statusId = useId('status-filter');
  const priorityId = useId('priority-filter');
  const workerId = useId('worker-filter');

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [workerFilter, setWorkerFilter] = useState('all');

  const tableColumns = useMemo(() => columns(styles.unassigned, onNavigate), [onNavigate, styles.unassigned]);
  const workerNames = useMemo(() => workerNamesFrom(referrals), [referrals]);
  const filtersActive = statusFilter !== 'all' || priorityFilter !== 'all' || workerFilter !== 'all' || query.trim() !== '';

  const safeguardingCount = referrals.filter(referral => referral.priority === 'Safeguarding').length;

  const items = useMemo(() => {
    const search = query.trim().toLowerCase();

    return referrals.filter(referral => {
      const matchesSearch =
        !search ||
        referral.name.toLowerCase().includes(search) ||
        workerLabel(referral.assignedWorker).toLowerCase().includes(search);

      const matchesStatus = statusFilter === 'all' || referral.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || referral.priority === priorityFilter;
      const matchesWorker =
        workerFilter === 'all' ||
        (workerFilter === 'unassigned' ? referral.assignedWorker === null : referral.assignedWorker === workerFilter);

      return matchesSearch && matchesStatus && matchesPriority && matchesWorker;
    });
  }, [priorityFilter, query, referrals, statusFilter, workerFilter]);

  const clearFilters = () => {
    setQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setWorkerFilter('all');
  };

  return (
    <div className={styles.page}>
      <PageHeader currentPath="/referral" maxWidth="1120px" onNavigate={onNavigate} />

      <main className={styles.main}>
        <div className={styles.intro}>
          <div className={styles.introHeader}>
            <Title1 as="h1">Referrals</Title1>
            <Button appearance="primary" onClick={() => onNavigate('/new-referral')}>
              New referral
            </Button>
          </div>
          <Body1 as="p">
            Track and manage adult social care referrals. Search by name, filter by status or priority, and monitor each
            case from referral through to allocation.
          </Body1>
        </div>

        {safeguardingCount > 0 ? (
          <MessageBar intent="warning" layout="multiline">
            <MessageBarBody>
              <MessageBarTitle>Safeguarding referrals need attention</MessageBarTitle>
              {safeguardingCount === 1
                ? 'There is 1 safeguarding referral on this list. Open it first so the person is protected while other work continues.'
                : `There are ${safeguardingCount} safeguarding referrals on this list. Open those first so the person is protected while other work continues.`}
            </MessageBarBody>
          </MessageBar>
        ) : null}

        <div className={styles.toolbar}>
          <SearchBox
            className={styles.search}
            placeholder="Search by name"
            aria-label="Search by name"
            value={query}
            onChange={(_event, data) => {
              setQuery(data.value);
            }}
          />
          <Field className={styles.filter} label="Status" id={statusId}>
            <Dropdown
              aria-labelledby={statusId}
              selectedOptions={[statusFilter]}
              value={statusFilter === 'all' ? 'All statuses' : statusFilter}
              onOptionSelect={(_event, data) => {
                if (data.optionValue) {
                  setStatusFilter(data.optionValue);
                }
              }}
            >
              <Option value="all">All statuses</Option>
              {statuses.map(status => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Dropdown>
          </Field>
          <Field className={styles.filter} label="Priority" id={priorityId}>
            <Dropdown
              aria-labelledby={priorityId}
              selectedOptions={[priorityFilter]}
              value={priorityFilter === 'all' ? 'All priorities' : priorityFilter}
              onOptionSelect={(_event, data) => {
                if (data.optionValue) {
                  setPriorityFilter(data.optionValue);
                }
              }}
            >
              <Option value="all">All priorities</Option>
              {priorities.map(priority => (
                <Option key={priority} value={priority}>
                  {priority}
                </Option>
              ))}
            </Dropdown>
          </Field>
          <Field className={styles.filter} label="Assigned worker" id={workerId}>
            <Dropdown
              aria-labelledby={workerId}
              selectedOptions={[workerFilter]}
              value={
                workerFilter === 'all' ? 'All workers' : workerFilter === 'unassigned' ? 'Not assigned' : workerFilter
              }
              onOptionSelect={(_event, data) => {
                if (data.optionValue) {
                  setWorkerFilter(data.optionValue);
                }
              }}
            >
              <Option value="all">All workers</Option>
              <Option value="unassigned">Not assigned</Option>
              {workerNames.map(name => (
                <Option key={name} value={name}>
                  {name}
                </Option>
              ))}
            </Dropdown>
          </Field>
          {filtersActive ? (
            <Button appearance="subtle" onClick={clearFilters}>
              Clear filters
            </Button>
          ) : null}
        </div>

        <Caption1 as="p" className={styles.count}>
          {items.length === referrals.length
            ? `${items.length} referrals`
            : `Showing ${items.length} of ${referrals.length} referrals`}
        </Caption1>

        {items.length === 0 ? (
          <Body1 as="p">No referrals match these filters.</Body1>
        ) : (
          <div className={styles.tableWrap}>
            <DataGrid
              items={items}
              columns={tableColumns}
              sortable
              getRowId={item => item.id}
              focusMode="cell"
              resizableColumns
              resizableColumnsOptions={{ autoFitColumns: false }}
              columnSizingOptions={{
                name: { minWidth: 160, defaultWidth: 180 },
                priority: { minWidth: 150, defaultWidth: 170 },
                status: { minWidth: 110, defaultWidth: 120 },
                assignedWorker: { minWidth: 170, defaultWidth: 190 },
                daysOpen: { minWidth: 100, defaultWidth: 110 },
                actions: { minWidth: 72, defaultWidth: 80 },
              }}
            >
              <DataGridHeader>
                <DataGridRow>
                  {({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}
                </DataGridRow>
              </DataGridHeader>
              <DataGridBody<Referral>>
                {({ item, rowId }) => (
                  <DataGridRow<Referral>
                    key={rowId}
                    className={item.priority === 'Safeguarding' ? styles.safeguardingRow : undefined}
                  >
                    {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                  </DataGridRow>
                )}
              </DataGridBody>
            </DataGrid>
          </div>
        )}
      </main>
    </div>
  );
};
