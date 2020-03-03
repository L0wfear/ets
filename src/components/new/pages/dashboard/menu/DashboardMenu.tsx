import * as React from 'react';
import DashboardMenuCards from 'components/new/pages/dashboard/menu/cards/DashboardMenuCards';
import DashboardMenuButtons from 'components/new/pages/dashboard/menu/buttons/DashboardMenuButtons';

import {
  DashboardMenuContainer
} from 'components/new/pages/dashboard/menu/styled/styled';

const DashboardMenu: React.FC<{ page: string; }> = React.memo(
  (props) => {
    return (
      <DashboardMenuContainer>
        <DashboardMenuCards page={props.page} />
        <DashboardMenuButtons page={props.page} />
      </DashboardMenuContainer>
    );
  },
);

export default DashboardMenu;
