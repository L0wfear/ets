import { Actions } from 'flummox';

import {
  UserNotificationService,
  UserAdmNotificationService,
} from 'api/Services';

export default class UserNotificationActions extends Actions {
  getNotifications(payload = {}) {
    return UserNotificationService.get(payload);
  }
  getAdmNotifications(payload = {}) {
    return UserAdmNotificationService.get(payload);
  }
  getNotReadAdmNotifications() {
    return UserAdmNotificationService.get({ is_read: false });
  }

  markAsReadOffline(readData = []) {
    return Promise.resolve(readData);
  }

  markAsRead(readData = []) {
    const payload = {
      common: {
        read_ids: [],
      },
      adm: {
        read_ids: [],
      },
    };

    readData.forEach(({ id, front_type }) =>
      payload[front_type] && payload[front_type].read_ids.push(id)
    );

    return Promise.all([
      (payload.common.read_ids.length ? UserNotificationService.put({ ...payload.common }, false, 'json') : Promise.reject())
        .then(() => this.getNotifications())
        .catch(() => {}),
      (payload.adm.read_ids.length ? UserAdmNotificationService.put({ ...payload.adm }, false, 'json') : Promise.reject())
        .then(() => this.getAdmNotifications())
        .catch(() => {}),
    ]).then(() => readData);
  }

  markAllAsRead() {
    const payload = {
      is_read_all: true,
    };

    return Promise.all([
      UserNotificationService.put(payload, false, 'json'),
      UserAdmNotificationService.put(payload, false, 'json'),
    ]).then(() => {
      this.getNotifications();
      this.getAdmNotifications();
    });
  }
}
