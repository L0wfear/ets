import * as React from 'react';

import hocAll from 'components/compositions/vokinda-hoc/recompose';
import triggerOnChangeCompany from 'components/compositions/vokinda-hoc/trigger-on-change-company/triggerOnChangeCompany';
import whitPreloader from 'components/ui/new/preloader/whitPreloader';

import DashboardTime from 'components/dashboard/new/time/DashboardTime';
import DashboardMenu from 'components/dashboard/new/menu/DashboardMenu';

require('components/dashboard/new/DashboardPage.scss');

const DashboardPage: React.SFC<any> = (props) => {
  return (
    <div className="ets-page-wrap dashboard_page">
      <DashboardTime />
      <DashboardMenu />
    </div>
  );
}

export default hocAll(
  triggerOnChangeCompany,
  whitPreloader({
    page: 'dashboard',
    typePreloader: 'mainpage',
  }),
)(DashboardPage);
