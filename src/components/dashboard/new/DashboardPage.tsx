import * as React from 'react';

import DashboardTime from 'components/dashboard/new/time/DashboardTime';
import DashboardMenu from 'components/dashboard/new/menu/DashboardMenu';

require('components/dashboard/new/DashboardPage.scss');

const DashboardPage: React.SFC<any> = (props) => {
  return (
    <div className="ets-page-wrap dashboard_page">
      <DashboardTime />
      <DashboardMenu history={props.history}/>
    </div>
  );
}


export default DashboardPage;
