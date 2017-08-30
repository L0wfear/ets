import { Actions } from 'flummox';

import {
  UserNotificationService,
} from 'api/Services';

export default class UserNotificationActions extends Actions {
  getNotifications(payload = {}) {
    return UserNotificationService.get(payload);
  }
  markAsRead(read_ids = [], update = this.getNotifications) {
    const payload = {
      read_ids,
    };

    return UserNotificationService.put(payload, update, 'json');
  }
  markAllAsRead() {
    const payload = {
      is_read_all: true,
    };

    return UserNotificationService.put(payload, this.getNotifications, 'json');
  }
}
