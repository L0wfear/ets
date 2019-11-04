import * as React from 'react';
import NotificationBage from 'components/old/notifications/NotificationBadge';

import permissions from 'components/old/notifications/config-data/permissions';
import component from 'components/old/notifications/config-data/components';
import { ConfigPageData } from 'components/@next/@types/config_data';

const notification_page_config: ConfigPageData = {
  path: '/notification-registry',
  title: (
    <div>
      {'Уведомления '}<NotificationBage />
    </div>
  ),
  entyity: '',

  component,
  permissions,
};

export default notification_page_config;
