import * as React from 'react';
import DashboardMenuCards from 'components/dashboard/menu/cards/DashboardMenuCards';
import DashboardMenuButtons from 'components/dashboard/menu/buttons/DashboardMenuButtons';

require('components/dashboard/menu/DashboardMenu.scss');

const DashboardMenu: React.SFC<any> = ({ history }) => (
  <div className="dashboard_menu">
    <DashboardMenuCards />
    <DashboardMenuButtons />
  </div>
);

export default DashboardMenu;
