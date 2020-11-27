import * as React from 'react';

import { compose } from 'recompose';
import triggerOnChangeCompany from 'components/old/compositions/vokinda-hoc/trigger-on-change-company/triggerOnChangeCompany';
import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';

import DashboardTime from 'components/new/pages/dashboard/time/DashboardTime';
import DashboardMenu from 'components/new/pages/dashboard/menu/DashboardMenu';

import {
  DashboardPageContainer,
} from 'components/new/pages/dashboard/styled/styled';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { resetAllLoadingCount } from 'redux-main/_middleware/ets-loading/module/actions-loading';

const page = 'dashboard';

const DashboardPage: React.FC<{}> = React.memo(
  () => {
    const dispatch = etsUseDispatch();
    
    React.useEffect(() => {
      return () => dispatch(resetAllLoadingCount());
    });
    React.useLayoutEffect(
      () => {
        const meta = document.querySelector('meta[property="og:title"]');
        const etsName = __DEVELOPMENT__ ? `__ETS::${process.env.STAND.toUpperCase()}__` : 'ЕТС';
        const new_title = `${etsName} Рабочий стол`;

        if (document) {
          document.title = new_title;
        }
        if (meta) {
          meta.setAttribute('content', new_title);
        }

        return () => {
          if (document) {
            document.title = etsName;
          }
          const metaNew = document.querySelector('meta[property="og:title"]');
          if (metaNew) {
            metaNew.setAttribute('content', etsName);
          }
        };
      },
    );

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
