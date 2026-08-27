import { Badge } from '@fluentui/react-components';
import { AlertUrgentRegular, ShieldRegular } from '@fluentui/react-icons';

export type ReferralStatus = 'New' | 'Assessing' | 'Allocated' | 'Closed';
export type ReferralPriority = 'Standard' | 'Urgent' | 'Safeguarding';

const statusConfig: Record<
  ReferralStatus,
  { appearance: 'filled' | 'outline'; color: 'brand' | 'informative' | 'success' }
> = {
  New: { appearance: 'filled', color: 'brand' },
  Assessing: { appearance: 'filled', color: 'informative' },
  Allocated: { appearance: 'filled', color: 'success' },
  Closed: { appearance: 'outline', color: 'informative' },
};

export const StatusBadge = (props: { status: ReferralStatus }) => {
  const { appearance, color } = statusConfig[props.status];

  return (
    <Badge appearance={appearance} color={color} size="small">
      {props.status}
    </Badge>
  );
};

export const PriorityBadge = (props: { priority: ReferralPriority }) => {
  const { priority } = props;

  if (priority === 'Safeguarding') {
    return (
      <Badge appearance="filled" color="important" icon={<ShieldRegular />} size="small">
        Safeguarding
      </Badge>
    );
  }

  if (priority === 'Urgent') {
    return (
      <Badge appearance="filled" color="warning" icon={<AlertUrgentRegular />} size="small">
        Urgent
      </Badge>
    );
  }

  return (
    <Badge appearance="filled" color="informative" size="small">
      Standard
    </Badge>
  );
};
