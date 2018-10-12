import * as React from 'react';

import hocAll from 'components/compositions/vokinda-hoc/recompose';
import triggerOnChangeCompany from 'components/compositions/vokinda-hoc/trigger-on-change-company/triggerOnChangeCompany';
import whitPreloader from 'components/ui/new/preloader/hoc/with-preloader/whitPreloader';

import DashboardTime from 'components/dashboard/time/DashboardTime';
import DashboardMenu from 'components/dashboard/menu/DashboardMenu';

import {
  DashboardPageContainer,
} from 'components/dashboard/styled/styled';

class DashboardPage extends React.PureComponent<{}, {}> {
  render() {
    return (
      <DashboardPageContainer>
        <DashboardTime />
        <DashboardMenu />
      </DashboardPageContainer>
    );
  }
}

export default hocAll(
  triggerOnChangeCompany,
  whitPreloader({
    page: 'dashboard',
    typePreloader: 'mainpage',
  }),
)(DashboardPage);
