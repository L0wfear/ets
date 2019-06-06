import * as React from 'react';

import LoadingOverlayLegacy from 'components/directories/order/forms/OrderMissionTemplate/LoadingOverlayLegacy';
import Routes from 'components/new/indexRoute';
import NotifiactionOrders from 'components/new/ui/modal_notification/NotifiactionOrders';
import AdmNotification from 'components/new/ui/adm_notification/AdmNotification';
import UserNotificationWs from 'components/notifications/UserNotificationWs';

import AppHeader from 'components/new/ui/app_header/AppHeader';
import AppFooter from 'components/new/ui/app_footer/AppFooter';
import withCheckPrivateRouteMain from 'components/new/utils/hoc/check_private_route_main/withCheckPrivateRouteMain';
import { AppStyled, AppContent } from './styled';
import EtsBootstrap from './ui/@bootstrap';
import { AppContentContainer } from './ui/@bootstrap/@global/AppContent';

const MainApp: React.FC<{}> = React.memo(
  () => {
    React.useEffect(
      () => {
        const SESSION_KEY2 = window.localStorage.getItem(global.SESSION_KEY2) || null;
        localStorage.setItem(global.SESSION_KEY, SESSION_KEY2);

        const SESSION_KEY_ETS_TEST_BY_DEV2 = window.localStorage.getItem(global.SESSION_KEY_ETS_TEST_BY_DEV2) || null;
        localStorage.setItem(global.SESSION_KEY_ETS_TEST_BY_DEV, SESSION_KEY_ETS_TEST_BY_DEV2);

        const versions = localStorage.getItem(global.API__KEY2) || '{}';
        localStorage.setItem(global.API__KEY, versions);
      },
      [],
    );
    return (
      <AppStyled>
        <AppHeader />
        <AppContentContainer>
          <Routes />
          <LoadingOverlayLegacy main />
          <NotifiactionOrders />
          <AdmNotification />
          <UserNotificationWs />
        </AppContentContainer>
        <AppFooter />
      </AppStyled>
    );
  },
);

export default withCheckPrivateRouteMain(MainApp);
