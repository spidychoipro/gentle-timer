export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    accent: string;
  };
}

export const themes: Theme[] = [
  {
    id: 'dracula',
    name: 'Gentle Focus',
    colors: {
      primary: '#D8FF63',
      secondary: '#91B88B',
      background: '#101410',
      surface: '#1A201B',
      text: '#F4F7ED',
      textSecondary: '#9AA596',
      border: '#2B342C',
      success: '#BCEB70',
      warning: '#F6C76B',
      error: '#FF7A6D',
      accent: '#7FE0C3',
    },
  },
  {
    id: 'light',
    name: 'Light',
    colors: {
      primary: '#007AFF',
      secondary: '#5856D6',
      background: '#F2F2F7',
      surface: '#FFFFFF',
      text: '#1C1C1E',
      textSecondary: '#8E8E93',
      border: '#C6C6C8',
      success: '#34C759',
      warning: '#FF9500',
      error: '#FF3B30',
      accent: '#5AC8FA',
    },
  },
  {
    id: 'dark',
    name: 'Dark',
    colors: {
      primary: '#0A84FF',
      secondary: '#5E5CE6',
      background: '#000000',
      surface: '#1C1C1E',
      text: '#FFFFFF',
      textSecondary: '#8E8E93',
      border: '#38383A',
      success: '#30D158',
      warning: '#FF9F0A',
      error: '#FF453A',
      accent: '#64D2FF',
    },
  },
  {
    id: 'nord',
    name: 'Nord',
    colors: {
      primary: '#88C0D0',
      secondary: '#81A1C1',
      background: '#2E3440',
      surface: '#3B4252',
      text: '#ECEFF4',
      textSecondary: '#4C566A',
      border: '#4C566A',
      success: '#A3BE8C',
      warning: '#EBCB8B',
      error: '#BF616A',
      accent: '#8FBCBB',
    },
  },
  {
    id: 'solarized',
    name: 'Solarized Dark',
    colors: {
      primary: '#268BD2',
      secondary: '#6C71C4',
      background: '#002B36',
      surface: '#073642',
      text: '#FDF6E3',
      textSecondary: '#586E75',
      border: '#586E75',
      success: '#859900',
      warning: '#B58900',
      error: '#DC322F',
      accent: '#2AA198',
    },
  },
  {
    id: 'monokai',
    name: 'Monokai',
    colors: {
      primary: '#A6E22E',
      secondary: '#FD971F',
      background: '#272822',
      surface: '#3E3D32',
      text: '#F8F8F2',
      textSecondary: '#75715E',
      border: '#75715E',
      success: '#A6E22E',
      warning: '#E6DB74',
      error: '#F92672',
      accent: '#66D9EF',
    },
  },
  {
    id: 'github',
    name: 'GitHub Dark',
    colors: {
      primary: '#58A6FF',
      secondary: '#BC8CFF',
      background: '#0D1117',
      surface: '#161B22',
      text: '#F0F6FC',
      textSecondary: '#8B949E',
      border: '#30363D',
      success: '#3FB950',
      warning: '#D29922',
      error: '#F85149',
      accent: '#79C0FF',
    },
  },
  {
    id: 'tokyonight',
    name: 'Tokyo Night',
    colors: {
      primary: '#7AA2F7',
      secondary: '#BB9AF7',
      background: '#1A1B26',
      surface: '#24283B',
      text: '#C0CAF5',
      textSecondary: '#565F89',
      border: '#3B4261',
      success: '#9ECE6A',
      warning: '#E0AF68',
      error: '#F7768E',
      accent: '#7DCFFF',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: {
      primary: '#66D9EF',
      secondary: '#A6E22E',
      background: '#2B303B',
      surface: '#343D46',
      text: '#CDD3D4',
      textSecondary: '#65737E',
      border: '#65737E',
      success: '#A3BE8C',
      warning: '#EBCB8B',
      error: '#BF616A',
      accent: '#B48EAD',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    colors: {
      primary: '#FF6B6B',
      secondary: '#FFE66D',
      background: '#1A1A2E',
      surface: '#16213E',
      text: '#EAEAEA',
      textSecondary: '#A0A0A0',
      border: '#4A4A6A',
      success: '#4ECDC4',
      warning: '#FFE66D',
      error: '#FF6B6B',
      accent: '#FF8E53',
    },
  },
];

export const getThemeById = (id: string): Theme => {
  return themes.find((theme) => theme.id === id) || themes[0];
};
