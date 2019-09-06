import * as React from 'react';
import styled from 'styled-components';
import themeAppContent from '../@themes/default/app_content/themeAppContent';

export const AppContentContainer = styled.div<{ themeName?: keyof typeof themeAppContent }>`
  transition: all 0.5s;

  background-color: ${({ theme, themeName }) => theme.app_content[themeName || 'default'].backgroundColor};
  color: ${({ theme, themeName }) => theme.app_content[themeName || 'default'].color};

  justify-self: flex-start;
  flex: 1 1 auto;
  position: relative;
  overflow: auto;
`;

export type AppContentProps = {
  themeName?: keyof typeof themeAppContent;
};

const AppContent: React.FC<AppContentProps> = React.memo(
  (props) => {
    return (
      <AppContentContainer themeName={props.themeName}>
        {props.children}
      </AppContentContainer>
    );
  },
);

export default AppContent;
