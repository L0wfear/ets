import { Actions } from 'flummox';

import {
  UserNotificationService,
  UserNotificationInfoService,
  UserAdmNotificationService,
} from 'api/Services';

export default class UserNotificationActions extends Actions {
  getNotifications(payload = {}) {
    return UserNotificationService.get(payload);
  }
  getNotificationsPopup(payload = {}) {
    return UserNotificationService.get(payload);
  }
  getAdmNotifications(payload = {}) {
    return UserAdmNotificationService.get(payload);
  }
  getNotReadAdmNotifications() {
    return UserAdmNotificationService.get({ is_read: false });
  }
  decNotificationsPopup(read_ids) {
    return this.markAsRead(read_ids, false);
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
      payload[front_type].read_ids.push(id)
    );

    this.changesUserNotificationsCount(-(payload.common.read_ids.length + payload.adm.read_ids.length));

    return Promise.all([
      (payload.common.read_ids.length ? UserNotificationService.put({ ...payload.common }, false, 'json') : Promise.reject())
        .then(this.getNotifications)
        .catch(() => {}),
      (payload.adm.read_ids.length ? UserAdmNotificationService.put({ ...payload.adm }, false, 'json') : Promise.reject())
        .then(this.getAdmNotifications)
        .catch(() => {}),
    ]).then(() => readData);
  }

  markAllAsRead() {
    const payload = {
      is_read_all: true,
    };
    this.changesUserNotificationsCount('is_read_all');

    return Promise.all([
      UserNotificationService.put(payload, false, 'json'),
      UserAdmNotificationService.put(payload, false, 'json'),
    ]).then(() => {
      this.getNotifications();
      this.getAdmNotifications();
    });
  }
}
