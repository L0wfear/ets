import * as React from 'react';
import { Redirect } from 'react-router-dom';

import CompanyOptions from 'components/new/ui/app_header/desktop/right/change_role/CompanyOptionsNew';
import requireAuth from 'utils/auth';
import { ReduxState } from 'redux-main/@types/state';
import { getSessionState } from 'redux-main/reducers/selectors/index';
import { connect } from 'react-redux';
import { compose } from 'recompose';

class CahngeCompany extends React.Component<any, any> {
  render() {
    const { userData } = this.props;

    if (!userData.isGlavControl) {
      return <Redirect to={requireAuth(userData.permissionsSet, '/monitor')} />;
    }

    return (
      <div className={'company-switcher-big'}>
        <span className={'company-switcher-big-label'}>Выберите организацию</span>
        <CompanyOptions/>
      </div>
    );
  }
}

export default compose(
  connect<any, any, any, ReduxState>(
    (state) => ({
      userData: getSessionState(state).userData,
    }),
  ),
)(CahngeCompany);
