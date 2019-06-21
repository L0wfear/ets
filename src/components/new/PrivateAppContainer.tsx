import * as React from 'react';

import LoadingOverlayLegacy from 'components/directories/order/forms/OrderMissionTemplate/LoadingOverlayLegacy';
import Routes from 'components/new/indexRoute';
import NotifiactionOrders from 'components/new/ui/modal_notification/NotifiactionOrders';
import AdmNotification from 'components/new/ui/adm_notification/AdmNotification';
import UserNotificationWs from 'components/notifications/UserNotificationWs';

import AppHeader from 'components/new/ui/app_header/AppHeader';
import AppFooter from 'components/new/ui/app_footer/AppFooter';
import withCheckPrivateRouteMain from 'components/new/utils/hoc/check_private_route_main/withCheckPrivateRouteMain';
import { AppStyled } from './styled';

import { AppContentContainer } from './ui/@bootstrap/@global/AppContent';

const MainApp: React.FC<{}> = React.memo(
  () => {
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
