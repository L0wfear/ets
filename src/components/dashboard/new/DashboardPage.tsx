import * as React from 'react';

import hocAll from 'components/compositions/vokinda-hoc/recompose';
import triggerOnChangeCompany from 'components/compositions/vokinda-hoc/trigger-on-change-company/triggerOnChangeCompany';
import whitPreloader from 'components/ui/new/preloader/whitPreloader';

import DashboardTime from 'components/dashboard/new/time/DashboardTime';
import DashboardMenu from 'components/dashboard/new/menu/DashboardMenu';

import {
  DashboardPageContainer,
} from 'components/dashboard/new/styled/styled';

const DashboardPage: React.SFC<any> = (props) => {
  return (
    <DashboardPageContainer>
      <DashboardTime />
      <DashboardMenu />
    </DashboardPageContainer>
  );
}

export default hocAll(
  triggerOnChangeCompany,
  whitPreloader({
    page: 'dashboard',
    typePreloader: 'mainpage',
  }),
)(DashboardPage);
