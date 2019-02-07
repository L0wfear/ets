import * as React from 'react';
import DashboardMenuCards from 'components/new/pages/dashboard/menu/cards/DashboardMenuCards';
import DashboardMenuButtons from 'components/new/pages/dashboard/menu/buttons/DashboardMenuButtons';

import {
  DashboardMenuContainer
} from 'components/new/pages/dashboard/menu/styled/styled';

class DashboardMenu extends React.PureComponent<{}, {}> {
  render() {
    return (
      <DashboardMenuContainer>
        <DashboardMenuCards />
        <DashboardMenuButtons />
      </DashboardMenuContainer>
    );
  }
}

export default DashboardMenu;
