import { useState } from 'react';
import { FluentProvider, makeStyles, tokens } from '@fluentui/react-components';
import { LandingPage } from './LandingPage';
import { themeOptions, type Direction, type ThemeName } from './themes';

const useStyles = makeStyles({
  provider: {
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
  },
});

const App = () => {
  const styles = useStyles();
  const [themeName, setThemeName] = useState<ThemeName>('webLight');
  const [dir, setDir] = useState<Direction>('ltr');

  return (
    <FluentProvider className={styles.provider} theme={themeOptions[themeName].theme} dir={dir}>
      <LandingPage themeName={themeName} dir={dir} onThemeChange={setThemeName} onDirChange={setDir} />
    </FluentProvider>
  );
};

export default App;
