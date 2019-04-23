import * as React from 'react';

import LoadingOverlayLegacy from 'components/directories/order/forms/OrderMissionTemplate/LoadingOverlayLegacy';
import Routes from 'components/new/indexRoute';
import NotifiactionOrders from 'components/new/ui/modal_notification/NotifiactionOrders';
import AdmNotification from 'components/new/ui/adm_notification/AdmNotification';
import UserNotificationWs from 'components/notifications/UserNotificationWs';

import AppHeader from 'components/new/ui/app_header/AppHeader';
import AppFooter from 'components/new/ui/app_footer/AppFooter';
import withCheckPrivateRouteMain from 'components/new/utils/hoc/check_private_route_main/withCheckPrivateRouteMain';

const MainApp: React.FC<{}> = React.memo(
  () => (
    <div className="app">
      <AppHeader />
      <div className="app-content">
        <div className="app-content-absolute">
          <Routes />
          <LoadingOverlayLegacy main />
          <NotifiactionOrders />
          <AdmNotification />
          <UserNotificationWs />
        </div>
      </div>
      <AppFooter />
    </div>
  ),
);

export default withCheckPrivateRouteMain(MainApp);
