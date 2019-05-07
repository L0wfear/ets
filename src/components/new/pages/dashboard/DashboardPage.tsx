import * as React from 'react';

import { compose } from 'recompose';
import triggerOnChangeCompany from 'components/compositions/vokinda-hoc/trigger-on-change-company/triggerOnChangeCompany';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

import DashboardTime from 'components/new/pages/dashboard/time/DashboardTime';
import DashboardMenu from 'components/new/pages/dashboard/menu/DashboardMenu';

import {
  DashboardPageContainer,
} from 'components/new/pages/dashboard/styled/styled';

const page = 'dashboard';

const DashboardPage: React.FC<{}> = React.memo(
  () => {
    return (
      <DashboardPageContainer>
        <DashboardTime page={page} />
        <DashboardMenu page={page} />
      </DashboardPageContainer>
    );
  },
);

export default compose<any, any>(
  triggerOnChangeCompany,
  withPreloader({
    page,
    typePreloader: 'mainpage',
  }),
)(DashboardPage);
