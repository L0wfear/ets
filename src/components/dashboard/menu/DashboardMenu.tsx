import * as React from 'react';
import DashboardMenuCards from 'components/dashboard/menu/cards/DashboardMenuCards';
import DashboardMenuButtons from 'components/dashboard/menu/buttons/DashboardMenuButtons';

import {
  DashboardMenuContainer
} from 'components/dashboard/menu/styled/styled';

const DashboardMenu: React.SFC<any> = ({ history }) => (
  <DashboardMenuContainer>
    <DashboardMenuCards />
    <DashboardMenuButtons />
  </DashboardMenuContainer>
);

export default DashboardMenu;
