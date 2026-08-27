import { useEffect, useRef, useState } from 'react';
import {
  Body1,
  Button,
  Caption1,
  Dropdown,
  Field,
  Input,
  Link,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Option,
  Radio,
  RadioGroup,
  Textarea,
  Title1,
  Title3,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

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
    gap: tokens.spacingVerticalM,
    maxWidth: '640px',
  },
  hint: {
    color: tokens.colorNeutralForeground3,
  },
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalM,
  },
  errorList: {
    margin: `${tokens.spacingVerticalS} 0 0`,
    paddingLeft: tokens.spacingHorizontalXXL,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
});

const emptyForm = {
  fullName: '',
  dateOfBirth: '',
  nhsNumber: '',
  address: '',
  reason: '',
  priority: '',
  safeguarding: '',
  concern: '',
  immediateRisk: '',
  referrerName: '',
  organisation: '',
  contact: '',
};

type FormState = typeof emptyForm;
type FormField = keyof FormState;
type FormErrors = Partial<Record<FormField, string>>;

const fieldLabels: Record<FormField, string> = {
  fullName: 'Full name',
  dateOfBirth: 'Date of birth',
  nhsNumber: 'NHS number',
  address: 'Address',
  reason: 'Why are you referring this person',
  priority: 'Priority',
  safeguarding: 'Is there a safeguarding concern',
  concern: 'Tell us about the concern',
  immediateRisk: 'Is there an immediate risk',
  referrerName: 'Your name',
  organisation: 'Organisation',
  contact: 'Phone number',
};

const Hint = (props: { children: string }) => {
  const styles = useStyles();

  return <Caption1 className={styles.hint}>{props.children}</Caption1>;
};

const validate = (form: FormState): FormErrors => {
  const errors: FormErrors = {};

  if (!form.fullName.trim()) {
    errors.fullName = 'Enter the person’s full name.';
  }

  if (!form.dateOfBirth) {
    errors.dateOfBirth = 'Enter the person’s date of birth.';
  }

  if (!form.reason.trim()) {
    errors.reason = 'Explain why you are referring this person.';
  }

  if (!form.priority) {
    errors.priority = 'Select a priority.';
  }

  if (!form.safeguarding) {
    errors.safeguarding = 'Say whether there is a safeguarding concern.';
  }

  if (form.safeguarding === 'Yes' && !form.concern.trim()) {
    errors.concern = 'Describe the safeguarding concern.';
  }

  if (form.safeguarding === 'Yes' && !form.immediateRisk) {
    errors.immediateRisk = 'Say whether there is an immediate risk.';
  }

  if (!form.referrerName.trim()) {
    errors.referrerName = 'Enter your name.';
  }

  if (!form.organisation.trim()) {
    errors.organisation = 'Enter your organisation.';
  }

  return errors;
};

const fieldError = (errors: FormErrors, field: FormField) =>
  errors[field]
    ? { validationState: 'error' as const, validationMessage: errors[field] }
    : {};

const formatDraftTime = (date: Date) =>
  date.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit' });

type NewReferralFormPageProps = {
  onNavigate: (path: string) => void;
};

export const NewReferralFormPage = (props: NewReferralFormPageProps) => {
  const { onNavigate } = props;
  const styles = useStyles();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<Date | null>(null);
  const skipDraftSave = useRef(true);

  useEffect(() => {
    if (skipDraftSave.current) {
      skipDraftSave.current = false;
      return;
    }

    setDraftSavedAt(new Date());
  }, [form]);

  const updateField = (field: FormField, value: string) => {
    setForm(current => ({ ...current, [field]: value }));
    setSubmitted(false);
    setErrors(current => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const submit = () => {
    const nextErrors = validate(form);
    setErrors(nextErrors);
    setSubmitted(Object.keys(nextErrors).length === 0);
  };

  const errorFields = (Object.keys(errors) as FormField[]).filter(field => errors[field]);
  const showSafeguardingFields = form.safeguarding === 'Yes';
  const showSafeguardingWarning = form.safeguarding === 'Yes' || form.priority === 'Safeguarding';

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
          <Title1 as="h1">New referral</Title1>
          <Body1 as="p">
            Use this form to refer someone for adult social care support. Required fields are marked with an asterisk.
          </Body1>
          <Caption1 as="p">
            {draftSavedAt
              ? `Draft saved at ${formatDraftTime(draftSavedAt)}. Your answers stay on this page if you are interrupted.`
              : 'Your answers stay on this page if you are interrupted.'}
          </Caption1>
        </div>

        {errorFields.length > 0 ? (
          <MessageBar intent="error">
            <MessageBarBody>
              <MessageBarTitle>There is a problem</MessageBarTitle>
              <Body1 as="p">Fix these fields before you submit the referral.</Body1>
              <ul className={styles.errorList}>
                {errorFields.map(field => (
                  <li key={field}>
                    <Body1>{errors[field]}</Body1>
                  </li>
                ))}
              </ul>
            </MessageBarBody>
          </MessageBar>
        ) : null}

        {submitted ? (
          <MessageBar intent="success">
            <MessageBarBody>
              <MessageBarTitle>Referral submitted</MessageBarTitle>
              It will appear on the referral list for allocation.
            </MessageBarBody>
          </MessageBar>
        ) : null}

        <section className={styles.section}>
          <Title3 as="h2">Person details</Title3>
          <Field label={fieldLabels.fullName} required {...fieldError(errors, 'fullName')}>
            <Input
              value={form.fullName}
              onChange={(_event, data) => {
                updateField('fullName', data.value);
              }}
            />
          </Field>
          <Field label={fieldLabels.dateOfBirth} required {...fieldError(errors, 'dateOfBirth')}>
            <Input
              type="date"
              value={form.dateOfBirth}
              onChange={(_event, data) => {
                updateField('dateOfBirth', data.value);
              }}
            />
          </Field>
          <Field
            label={fieldLabels.nhsNumber}
            hint={<Hint>Used to match the person to their health record.</Hint>}
          >
            <Input
              value={form.nhsNumber}
              onChange={(_event, data) => {
                updateField('nhsNumber', data.value);
              }}
            />
          </Field>
          <Field label={fieldLabels.address}>
            <Textarea
              value={form.address}
              onChange={(_event, data) => {
                updateField('address', data.value);
              }}
            />
          </Field>
        </section>

        <section className={styles.section}>
          <Title3 as="h2">Referral details</Title3>
          <Field label={fieldLabels.reason} required {...fieldError(errors, 'reason')}>
            <Textarea
              placeholder="Describe the support they need and what has changed"
              value={form.reason}
              onChange={(_event, data) => {
                updateField('reason', data.value);
              }}
            />
          </Field>
          <Field label={fieldLabels.priority} required {...fieldError(errors, 'priority')}>
            <Dropdown
              placeholder="Select a priority"
              selectedOptions={form.priority ? [form.priority] : []}
              value={form.priority}
              onOptionSelect={(_event, data) => {
                if (data.optionValue) {
                  updateField('priority', data.optionValue);
                }
              }}
            >
              <Option value="Standard">Standard</Option>
              <Option value="Urgent">Urgent</Option>
              <Option value="Safeguarding">Safeguarding</Option>
            </Dropdown>
          </Field>
        </section>

        <section className={styles.section}>
          <Title3 as="h2">Risk and safeguarding</Title3>
          {showSafeguardingWarning ? (
            <MessageBar intent="warning" layout="multiline">
              <MessageBarBody>
                <MessageBarTitle>Safeguarding information will be on this record</MessageBarTitle>
                This flags a concern about the person, not a judgement of them. The allocated worker must open the Risk
                and safeguarding tab before making decisions.
              </MessageBarBody>
            </MessageBar>
          ) : null}
          <Field label={fieldLabels.safeguarding} required {...fieldError(errors, 'safeguarding')}>
            <RadioGroup
              layout="horizontal"
              value={form.safeguarding}
              onChange={(_event, data) => {
                updateField('safeguarding', data.value);
              }}
            >
              <Radio value="Yes" label="Yes" />
              <Radio value="No" label="No" />
            </RadioGroup>
          </Field>
          {showSafeguardingFields ? (
            <>
              <Field
                label={fieldLabels.concern}
                required
                hint={
                  <Hint>
                    We ask this so the allocated worker can protect the person. Record the concern, not a label about
                    them.
                  </Hint>
                }
                {...fieldError(errors, 'concern')}
              >
                <Textarea
                  placeholder="Describe what happened, when, and who is at risk"
                  value={form.concern}
                  onChange={(_event, data) => {
                    updateField('concern', data.value);
                  }}
                />
              </Field>
              <Field label={fieldLabels.immediateRisk} required {...fieldError(errors, 'immediateRisk')}>
                <Dropdown
                  placeholder="Select an option"
                  selectedOptions={form.immediateRisk ? [form.immediateRisk] : []}
                  value={form.immediateRisk}
                  onOptionSelect={(_event, data) => {
                    if (data.optionValue) {
                      updateField('immediateRisk', data.optionValue);
                    }
                  }}
                >
                  <Option value="Yes">Yes</Option>
                  <Option value="No">No</Option>
                  <Option value="Not sure">Not sure</Option>
                </Dropdown>
              </Field>
            </>
          ) : null}
        </section>

        <section className={styles.section}>
          <Title3 as="h2">Who is referring</Title3>
          <Field label={fieldLabels.referrerName} required {...fieldError(errors, 'referrerName')}>
            <Input
              value={form.referrerName}
              onChange={(_event, data) => {
                updateField('referrerName', data.value);
              }}
            />
          </Field>
          <Field label={fieldLabels.organisation} required {...fieldError(errors, 'organisation')}>
            <Input
              value={form.organisation}
              onChange={(_event, data) => {
                updateField('organisation', data.value);
              }}
            />
          </Field>
          <Field
            label={fieldLabels.contact}
            hint={<Hint>Used if the allocated worker needs to contact you about this referral.</Hint>}
          >
            <Input
              type="tel"
              value={form.contact}
              onChange={(_event, data) => {
                updateField('contact', data.value);
              }}
            />
          </Field>
        </section>

        <div className={styles.actions}>
          <Button appearance="primary" onClick={submit}>
            Submit referral
          </Button>
        </div>
      </main>
    </div>
  );
};
