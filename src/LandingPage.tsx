import {
  Badge,
  Body1,
  Button,
  Caption1,
  Card,
  CardFooter,
  CardHeader,
  CardPreview,
  Divider,
  Dropdown,
  Field,
  FluentProvider,
  Link,
  Option,
  Subtitle1,
  Switch,
  Title1,
  Title2,
  Title3,
  makeStyles,
  teamsDarkTheme,
  teamsLightTheme,
  tokens,
  useId,
  webDarkTheme,
  webLightTheme,
} from '@fluentui/react-components';
import {
  ArrowReplyRegular,
  ColorRegular,
  LayerRegular,
  LocalLanguageRegular,
  OpenRegular,
  ShareRegular,
} from '@fluentui/react-icons';
import type { Direction, ThemeName } from './themes';
import { themeOptions } from './themes';

const DOCS_URL = 'https://storybooks.fluentui.dev/react/?path=/docs/components-fluentprovider--docs';

const resolveAsset = (asset: string) => {
  const ASSET_URL =
    'https://raw.githubusercontent.com/microsoft/fluentui/master/packages/react-components/react-card/stories/src/assets/';

  return `${ASSET_URL}${asset}`;
};

const nestedThemes = [
  { name: 'Web Light Theme', theme: webLightTheme },
  { name: 'Web Dark Theme', theme: webDarkTheme },
  { name: 'Teams Light Theme', theme: teamsLightTheme },
  { name: 'Teams Dark Theme', theme: teamsDarkTheme },
] as const;

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 1,
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  headerInner: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalL,
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalXXL}`,
    maxWidth: '960px',
    width: '100%',
    boxSizing: 'border-box',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  nav: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: tokens.spacingHorizontalL,
  },
  controls: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'end',
    gap: tokens.spacingHorizontalM,
  },
  themeField: {
    minWidth: '180px',
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
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: tokens.spacingVerticalM,
  },
  heroActions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalS,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: tokens.spacingVerticalL,
    width: '100%',
  },
  featureGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalL,
    width: '100%',
  },
  featureCard: {
    flex: '1 1 240px',
  },
  featureHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  icon: {
    color: tokens.colorBrandForeground1,
    fontSize: tokens.fontSizeHero700,
  },
  themes: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    width: '100%',
  },
  provider: {
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingHorizontalM,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  themeLabel: {
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground2,
    fontSize: tokens.fontSizeBase400,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingHorizontalS,
  },
  themeButton: {
    marginTop: tokens.spacingVerticalS,
  },
  dirRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalM,
    width: '100%',
  },
  dirSample: {
    flex: '1 1 220px',
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground2,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingHorizontalM,
  },
  card: {
    maxWidth: '720px',
    width: '100%',
  },
  footer: {
    marginTop: 'auto',
    borderTop: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
  },
  footerInner: {
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalXXL}`,
    maxWidth: '960px',
    width: '100%',
    boxSizing: 'border-box',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});

type FluentUIPageProps = {
  themeName: ThemeName;
  dir: Direction;
  onThemeChange: (themeName: ThemeName) => void;
  onDirChange: (dir: Direction) => void;
  onNavigate: (path: string) => void;
};

export const FluentUIPage = (props: FluentUIPageProps) => {
  const { themeName, dir, onThemeChange, onDirChange, onNavigate } = props;
  const styles = useStyles();
  const themeDropdownId = useId('theme');

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
        <div className={styles.brand}>
          <Subtitle1>Fluent UI</Subtitle1>
          <Badge appearance="tint" color="brand">
            Provider
          </Badge>
        </div>
        <nav className={styles.nav} aria-label="Page">
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
          <Link href="#features">Features</Link>
          <Link href="#themes">Themes</Link>
          <Link href="#direction">Direction</Link>
          <Link href={DOCS_URL} target="_blank" rel="noreferrer">
            Docs
          </Link>
        </nav>
        <div className={styles.controls}>
          <Field className={styles.themeField} label="Theme">
            <Dropdown
              id={themeDropdownId}
              selectedOptions={[themeName]}
              value={themeOptions[themeName].label}
              onOptionSelect={(_event, data) => {
                if (data.optionValue) {
                  onThemeChange(data.optionValue as ThemeName);
                }
              }}
            >
              {(Object.keys(themeOptions) as ThemeName[]).map(name => (
                <Option key={name} value={name} text={themeOptions[name].label}>
                  {themeOptions[name].label}
                </Option>
              ))}
            </Dropdown>
          </Field>
          <Switch
            label="Right to left"
            checked={dir === 'rtl'}
            onChange={(_event, data) => {
              onDirChange(data.checked ? 'rtl' : 'ltr');
            }}
          />
        </div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <Badge appearance="filled" color="brand">
            FluentProvider
          </Badge>
          <Title1 as="h1">A themed landing page</Title1>
          <Body1 as="p">
            FluentProvider turns a theme into CSS variables and passes settings such as direction to every Fluent UI
            component below it. Switch the page theme or text direction from the header to see the whole layout update.
          </Body1>
          <div className={styles.heroActions}>
            <Button appearance="primary" as="a" href="#themes">
              Explore themes
            </Button>
            <Button as="a" href={DOCS_URL} target="_blank" rel="noreferrer" icon={<OpenRegular />}>
              FluentProvider docs
            </Button>
          </div>
        </section>

        <section className={styles.section} id="features">
          <Title2 as="h2">What the provider gives you</Title2>
          <div className={styles.featureGrid}>
            <Card className={styles.featureCard}>
              <CardHeader
                image={<ColorRegular className={styles.icon} />}
                header={<Subtitle1>Themes</Subtitle1>}
                description={<Caption1>Web and Teams, light and dark</Caption1>}
              />
              <Body1 as="p">
                Apply webLightTheme, webDarkTheme, teamsLightTheme, or teamsDarkTheme. Brand, colour, and elevation
                tokens update together.
              </Body1>
            </Card>
            <Card className={styles.featureCard}>
              <CardHeader
                image={<LayerRegular className={styles.icon} />}
                header={<Subtitle1>Nested providers</Subtitle1>}
                description={<Caption1>Override a region of the page</Caption1>}
              />
              <Body1 as="p">
                Nest another FluentProvider to restyle a subtree. Each sample below keeps its own theme, even when the
                page theme changes.
              </Body1>
            </Card>
            <Card className={styles.featureCard}>
              <CardHeader
                image={<LocalLanguageRegular className={styles.icon} />}
                header={<Subtitle1>Direction</Subtitle1>}
                description={<Caption1>Left to right or right to left</Caption1>}
              />
              <Body1 as="p">
                Set dir on FluentProvider to render LTR or RTL. Layout, alignment, and reading order follow the
                provider.
              </Body1>
            </Card>
          </div>
        </section>

        <section className={styles.section} id="themes">
          <Title2 as="h2">Nested colour themes</Title2>
          <Body1 as="p">
            These nested providers match the FluentProvider default story. Their theme stays local, so you can compare
            palettes against the page theme you selected above.
          </Body1>
          <div className={styles.themes}>
            {nestedThemes.map(item => (
              <FluentProvider key={item.name} className={styles.provider} theme={item.theme}>
                <div className={styles.themeLabel}>{item.name}</div>
                <Button className={styles.themeButton}>{item.name}</Button>
              </FluentProvider>
            ))}
          </div>
        </section>

        <section className={styles.section} id="direction">
          <Title2 as="h2">Text direction</Title2>
          <Body1 as="p">A provider can render a region left-to-right or right-to-left without changing the rest of the page.</Body1>
          <div className={styles.dirRow}>
            <FluentProvider className={styles.provider} theme={webLightTheme} dir="ltr">
              <div className={styles.dirSample}>Text left to right</div>
            </FluentProvider>
            <FluentProvider className={styles.provider} theme={webLightTheme} dir="rtl" lang="ar">
              <div className={styles.dirSample}>نص من اليمين إلى اليسار</div>
            </FluentProvider>
          </div>
        </section>

        <Divider />

        <section className={styles.section}>
          <Title3 as="h3">Components pick up the page theme</Title3>
          <Body1 as="p">
            Cards, buttons, and typography all read tokens from the nearest FluentProvider. Change the header theme to
            restyle this card.
          </Body1>
          <Card className={styles.card}>
            <CardHeader
              image={<img src={resolveAsset('avatar_elvia.svg')} alt="Elvia Atkins avatar picture" />}
              header={
                <Body1>
                  <b>Elvia Atkins</b> mentioned you
                </Body1>
              }
              description={<Caption1>5h ago · About us - Overview</Caption1>}
            />
            <CardPreview logo={<img src={resolveAsset('docx.png')} alt="Microsoft Word document" />}>
              <img src={resolveAsset('doc_template.png')} alt="Preview of a Word document: About Us - Overview" />
            </CardPreview>
            <CardFooter>
              <Button icon={<ArrowReplyRegular />}>Reply</Button>
              <Button icon={<ShareRegular />}>Share</Button>
            </CardFooter>
          </Card>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
        <Caption1 as="p">
          Built with FluentProvider.{' '}
          <Link href={DOCS_URL} target="_blank" rel="noreferrer">
            Read the docs
          </Link>
        </Caption1>
        </div>
      </footer>
    </div>
  );
};
