import * as React from 'react';
import DashboardMenuCards from 'components/dashboard/new/menu/cards/DashboardMenuCards';
import DashboardMenuButtons from 'components/dashboard/new/menu/buttons/DashboardMenuButtons';

import {
  DashboardMenuContainer
} from 'components/dashboard/new/menu/styled/styled';

const DashboardMenu: React.SFC<any> = ({ history }) => (
  <DashboardMenuContainer>
    <DashboardMenuCards />
    <DashboardMenuButtons />
  </DashboardMenuContainer>
);

export default DashboardMenu;
