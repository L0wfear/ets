import * as React from 'react';
import { AppFooterContainer } from './styled';
import Support from './support/Support';
import CompanyName from './company_name/CompanyName';
import Version from './version/Version';

type AppFooterStateProps = {
};
type AppFooterDispatchProps = {};
type AppFooterOwnProps = {};
type AppFooterMergedProps = (
  AppFooterStateProps
  & AppFooterDispatchProps
  & AppFooterOwnProps
);
type AppFooterProps = AppFooterMergedProps;

const AppFooter: React.FC<AppFooterProps> = React.memo(
  () => {
    return (
      <AppFooterContainer>
        <Support />
        <CompanyName />
        <Version />
      </AppFooterContainer>
    );
  },
);

export default AppFooter;
