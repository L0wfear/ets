import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import etsThemes from './colors';

type EtsThemeContextValue = {
  changeThemeName: (name: keyof typeof etsThemes) => void,
  themeName: keyof typeof etsThemes,
};

const defaultEtsThemeContext: EtsThemeContextValue = {
  changeThemeName: () => null,
  themeName: 'defaultEtsTheme',
};

const EtsThemeContext = React.createContext<EtsThemeContextValue>(defaultEtsThemeContext);

type EtsThemeProviderProps = {}; // тк провайдер глобальный, то пока ничего не ждёт

const EtsThemeProvider: React.FC<EtsThemeProviderProps> = React.memo(
  (props) => {
    const [themeName, changeThemeName] = React.useState(defaultEtsThemeContext.themeName);
    const value: EtsThemeContextValue = React.useMemo(
      () => {
        return {
          themeName,
          changeThemeName,
        };
      },
      [themeName],
    );

    return (
      <EtsThemeContext.Provider value={value}>
        <ThemeProvider theme={etsThemes[value.themeName]}>
          { props.children }
        </ThemeProvider>
      </EtsThemeContext.Provider>
    );
  },
);

export default EtsThemeProvider;
