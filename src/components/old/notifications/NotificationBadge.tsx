import * as React from 'react';

import { getUserNotificationInfo } from 'redux-main/reducers/modules/user_notifications/actions-user_notifications';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getUserNotificationsState } from 'redux-main/reducers/selectors';

const NotificationBadge: React.FC<{}> = React.memo(
  () => {
    const dispatch = etsUseDispatch();
    const countNotRead = etsUseSelector((state) => getUserNotificationsState(state).countNotRead);

    React.useEffect(
      () => {
        const loadData = () => {
          dispatch(
            getUserNotificationInfo(),
          );
        };

        const interval_id = setInterval(
          () => loadData(),
          1000 * 60 * 60,
        );

        loadData();

        return () => clearInterval(interval_id);
      },
      [],
    );

    return <EtsBootstrap.Badge>{countNotRead || 0}</EtsBootstrap.Badge>;
  },
);

export default NotificationBadge;
