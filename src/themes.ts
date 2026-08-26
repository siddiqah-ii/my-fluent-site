import { teamsDarkTheme, teamsLightTheme, webDarkTheme, webLightTheme } from '@fluentui/react-components';

export const themeOptions = {
  webLight: { label: 'Web Light', theme: webLightTheme },
  webDark: { label: 'Web Dark', theme: webDarkTheme },
  teamsLight: { label: 'Teams Light', theme: teamsLightTheme },
  teamsDark: { label: 'Teams Dark', theme: teamsDarkTheme },
} as const;

export type ThemeName = keyof typeof themeOptions;
export type Direction = 'ltr' | 'rtl';
