import * as React from 'react';
import DashboardMenuCards from 'components/dashboard/new/menu/cards/DashboardMenuCards';
import DashboardMenuButtons from 'components/dashboard/new/menu/buttons/DashboardMenuButtons';

require('components/dashboard/new/menu/DashboardMenu.scss');

const DashboardMenu: React.SFC<any> = ({ history }) => (
  <div className="dashboard_menu">
    <DashboardMenuCards history={history} />
    <DashboardMenuButtons />
  </div>
);

export default DashboardMenu;
