import type { ReferralPriority, ReferralStatus } from './ReferralBadges';

export type Note = {
  id: string;
  date: string;
  text: string;
};

export type DocumentItem = {
  id: string;
  name: string;
  date: string;
};

export type Referral = {
  id: string;
  name: string;
  assignedWorker: string | null;
  daysOpen: number;
  status: ReferralStatus;
  priority: ReferralPriority;
  dateOfBirth?: string;
  nhsNumber?: string;
  address?: string;
  reason?: string;
  safeguardingConcern?: string;
  immediateRisk?: string;
  notes: Note[];
  documents: DocumentItem[];
};

export type Worker = {
  name: string;
  otherCases: number;
  capacity: number;
};

export const DEFAULT_DETAIL_ID = '4';
export const DEFAULT_ALLOCATION_ID = '3';

export const workers: Worker[] = [
  { name: 'Claire Byrne', otherCases: 3, capacity: 10 },
  { name: 'James Osei', otherCases: 7, capacity: 10 },
  { name: 'Priya Shah', otherCases: 10, capacity: 10 },
  { name: 'Sarah Kapoor', otherCases: 6, capacity: 10 },
];

export const initialReferrals: Referral[] = [
  {
    id: '1',
    name: 'Margaret Thornton',
    assignedWorker: 'Sarah Kapoor',
    daysOpen: 1,
    status: 'New',
    priority: 'Standard',
    dateOfBirth: '4 June 1939',
    nhsNumber: '485 162 9370',
    address: '22 Maple Avenue, Leeds, LS7 1AB',
    reason: 'Needs a home care package after a short hospital stay for a fall.',
    notes: [],
    documents: [],
  },
  {
    id: '2',
    name: 'David Okonkwo',
    assignedWorker: 'James Osei',
    daysOpen: 3,
    status: 'New',
    priority: 'Urgent',
    dateOfBirth: '19 November 1956',
    nhsNumber: '612 904 3851',
    address: '8 Trinity Walk, Leeds, LS9 6HT',
    reason: 'Urgent assessment requested after a rapid decline in mobility at home.',
    notes: [],
    documents: [],
  },
  {
    id: '3',
    name: 'Thomas Brennan',
    assignedWorker: null,
    daysOpen: 1,
    status: 'New',
    priority: 'Safeguarding',
    dateOfBirth: '28 January 1942',
    nhsNumber: '207 834 1569',
    address: '3 Ridley Terrace, Leeds, LS4 2QR',
    reason: 'Needs a worker allocated before assessment can start after hospital discharge.',
    safeguardingConcern:
      'Hospital staff reported that Thomas may have been left without medication or heating support at home. Possible neglect by an informal carer.',
    immediateRisk: 'Yes',
    notes: [
      {
        id: '1',
        date: '12 March 2026',
        text: 'NHS discharge liaison opened this referral. A worker is not yet allocated.',
      },
    ],
    documents: [{ id: '1', name: 'Hospital discharge summary.pdf', date: '12 March 2026' }],
  },
  {
    id: '4',
    name: 'Helen Cartwright',
    assignedWorker: 'James Osei',
    daysOpen: 2,
    status: 'Assessing',
    priority: 'Safeguarding',
    dateOfBirth: '12 March 1948',
    nhsNumber: '943 476 5919',
    address: '14 Hartwell Close, Leeds, LS6 2PN',
    reason: 'Referral for adult social care support. Opened by NHS discharge liaison.',
    safeguardingConcern:
      'Neighbour reported that Helen has been left without food or heating for several days. Possible neglect by an informal carer.',
    immediateRisk: 'Yes',
    notes: [
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
    ],
    documents: [
      { id: '1', name: 'Hospital discharge summary.pdf', date: '12 March 2026' },
      { id: '2', name: 'Safeguarding notification.docx', date: '13 March 2026' },
    ],
  },
  {
    id: '5',
    name: 'Patricia Hewitt',
    assignedWorker: null,
    daysOpen: 14,
    status: 'Assessing',
    priority: 'Standard',
    dateOfBirth: '30 August 1945',
    nhsNumber: '351 670 2488',
    address: '41 St Mark’s Road, Leeds, LS2 9EF',
    reason: 'Occupational therapy assessment for adaptations after reduced mobility.',
    notes: [],
    documents: [],
  },
  {
    id: '6',
    name: 'Ibrahim Rahman',
    assignedWorker: 'Sarah Kapoor',
    daysOpen: 6,
    status: 'Allocated',
    priority: 'Standard',
    dateOfBirth: '2 February 1951',
    nhsNumber: '774 219 0635',
    address: '16 Claremont Place, Leeds, LS3 1AP',
    reason: 'Support at home while recovering from surgery.',
    notes: [],
    documents: [],
  },
  {
    id: '7',
    name: 'Arthur Greenfield',
    assignedWorker: 'Claire Byrne',
    daysOpen: 28,
    status: 'Closed',
    priority: 'Standard',
    dateOfBirth: '15 May 1934',
    nhsNumber: '890 145 6723',
    address: '9 Grove Hill, Leeds, LS8 4NW',
    reason: 'Home care package now in place. Referral closed after review.',
    notes: [],
    documents: [],
  },
];

export const findReferral = (referrals: Referral[], id: string | undefined) =>
  referrals.find(referral => referral.id === id);

export const caseloadFor = (worker: Worker, referrals: Referral[]) =>
  worker.otherCases + referrals.filter(referral => referral.assignedWorker === worker.name).length;

export const formatDaysOpen = (days: number) => {
  if (days === 0) {
    return 'Today';
  }

  return days === 1 ? '1 day' : `${days} days`;
};

export const assignWorker = (referrals: Referral[], referralId: string, workerName: string): Referral[] =>
  referrals.map(referral => {
    if (referral.id !== referralId) {
      return referral;
    }

    return {
      ...referral,
      assignedWorker: workerName,
      status: referral.status === 'New' ? 'Allocated' : referral.status,
    };
  });
