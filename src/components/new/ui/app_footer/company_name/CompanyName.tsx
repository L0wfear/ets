import * as React from 'react';

import { getSessionState } from 'redux-main/reducers/selectors';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { CompanyNameContainer } from 'components/new/ui/app_footer/company_name/styled';

type OwnProps = {};
type Propw = OwnProps & {};

const AppFooter: React.FC<Propw> = React.memo(
  () => {
    const userData = etsUseSelector((state) => getSessionState(state).userData);

    const company_name = userData.company_name || '';
    const structure_name = userData.structure_name || '';

    return (
      <CompanyNameContainer>
        <span>{`${company_name} ${structure_name}`}</span>
      </CompanyNameContainer>
    );
  },
);

export default AppFooter;
