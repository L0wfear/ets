import * as React from 'react';

import { AppFooterContainer } from './styled';
import Support from './support/Support';
import CompanyName from './company_name/CompanyName';
import Version from './version/Version';

type Props = {};

const AppFooter: React.FC<Props> = React.memo(
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
