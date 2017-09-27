import { Actions } from 'flummox';

import {
  UserNotificationService,
  UserNotificationInfoService,
} from 'api/Services';

export default class UserNotificationActions extends Actions {
  getNotifications(payload = {}) {
    return UserNotificationService.get(payload);
  }
  async getUserNotificationInfo(props) {
    const data = await UserNotificationInfoService.get();
    return {
      result: data.result,
      ...props,
    };
  }
  changesUserNotificationsCount(count) {
    return { count };
  }

  async markAsRead(read_ids = [], update = this.getNotifications) {
    const payload = {
      read_ids,
    };
    this.changesUserNotificationsCount(-read_ids.length);
    return await UserNotificationService.put(payload, update, 'json');
  }
  markAllAsRead() {
    const payload = {
      is_read_all: true,
    };

    this.changesUserNotificationsCount('is_read_all');
    return UserNotificationService.put(payload, this.getNotifications, 'json');
  }
}
