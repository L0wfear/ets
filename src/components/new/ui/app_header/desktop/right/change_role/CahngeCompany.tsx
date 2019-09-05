import * as React from 'react';
import { Redirect } from 'react-router-dom';

import CompanyOptions from 'components/new/ui/app_header/desktop/right/change_role/CompanyOptionsNew';
import requireAuth from 'utils/auth';
import { getSessionState } from 'redux-main/reducers/selectors';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

type OwnProps = {};
type Props = OwnProps & {};

const CahngeCompany: React.FC<Props> = React.memo(
  () => {
    const userData = etsUseSelector(
      (state) => getSessionState(state).userData,
    );

    if (!userData.isGlavControl) {
      return <Redirect to={requireAuth(userData.permissionsSet, '/monitor')} />;
    }

    return (
      <div className="company-switcher-big">
        <span className="company-switcher-big-label">Выберите организацию</span>
        <CompanyOptions/>
      </div>
    );
  },
);

export default CahngeCompany;
