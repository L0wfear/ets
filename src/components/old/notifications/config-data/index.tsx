import * as React from 'react';
import NotificationBage from 'components/old/notifications/NotificationBadge';

import permissions from 'components/old/notifications/config-data/permissions';
import component from 'components/old/notifications/config-data/components';

export default {
  path: '/notification-registry',
  title: (
    <div>
     {'Уведомления '}<NotificationBage />
    </div>
  ),
  entyity: '',
  noDotList: false,
  component,
  permissions,
};
