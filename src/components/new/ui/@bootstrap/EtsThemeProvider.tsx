import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import etsThemes from 'components/new/ui/@bootstrap/@themes/etsThemes';

type EtsThemeContextValue = {
  changeThemeName: (name: keyof typeof etsThemes) => void;
  themeName: keyof typeof etsThemes;
};

const defaultEtsThemeContext: EtsThemeContextValue = {
  changeThemeName: () => null,
  themeName: 'defaultEtsTheme',
};

export const EtsThemeContext = React.createContext<EtsThemeContextValue>(defaultEtsThemeContext);

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
      <ThemeProvider theme={etsThemes[value.themeName]}>
        <EtsThemeContext.Provider value={value}>
          { props.children }
        </EtsThemeContext.Provider>
      </ThemeProvider>
    );
  },
);

export default EtsThemeProvider;
